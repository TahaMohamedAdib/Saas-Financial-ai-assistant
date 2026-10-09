from __future__ import annotations

import httpx
from dataclasses import dataclass
from fastapi import HTTPException

from app.config import settings
from app.models import AssistantRequest


GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions"


@dataclass(frozen=True)
class GroqCompletion:
    # On ne conserve que les données du fournisseur utiles au reste du backend.
    content: str
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int


def _token_count(usage: object, key: str) -> int:
    if not isinstance(usage, dict):
        return 0
    value = usage.get(key)
    return value if isinstance(value, int) and value >= 0 else 0


async def request_groq_completion(
    payload: AssistantRequest,
    system_prompt: str,
    max_completion_tokens: int | None = None,
) -> GroqCompletion:
    """Adaptateur Groq : la clé API ne sort jamais de la frontière FastAPI."""
    if not settings.groq_api_key:
        raise HTTPException(status_code=503, detail="Assistant provider is not configured on the server.")

    # Le modèle reçoit d’abord les règles, puis un historique limité et enfin la nouvelle question.
    messages: list[dict[str, str]] = [{"role": "system", "content": system_prompt}]
    messages.extend({"role": item.role, "content": item.content} for item in payload.history[-12:])
    messages.append({"role": "user", "content": payload.message})

    # Le service peut réduire la sortie selon le quota restant sans dépasser la limite générale du serveur.
    completion_limit = settings.assistant_max_completion_tokens
    if max_completion_tokens is not None:
        completion_limit = min(completion_limit, max(1, max_completion_tokens))

    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(30.0, connect=8.0)) as client:
            response = await client.post(
                GROQ_CHAT_URL,
                headers={"Authorization": f"Bearer {settings.groq_api_key}", "Content-Type": "application/json"},
                json={
                    "model": settings.groq_model,
                    "messages": messages,
                    "temperature": 0.45,
                    "max_completion_tokens": completion_limit,
                },
            )
    except httpx.TimeoutException as error:
        raise HTTPException(status_code=504, detail="The assistant provider timed out. Please try again.") from error
    except httpx.HTTPError as error:
        raise HTTPException(status_code=503, detail="The assistant provider is temporarily unavailable.") from error

    # Les détails bruts de l’erreur du fournisseur ne doivent pas arriver dans le navigateur.
    if response.status_code >= 400:
        raise HTTPException(status_code=502, detail="The assistant provider returned an error.")

    try:
        response_payload = response.json()
        content = response_payload["choices"][0]["message"]["content"].strip()
    except (KeyError, IndexError, TypeError, ValueError, AttributeError) as error:
        raise HTTPException(status_code=502, detail="The assistant provider returned an invalid response.") from error

    if not content:
        raise HTTPException(status_code=502, detail="The assistant provider returned an empty response.")
    # Les compteurs réels de Groq permettent à l’interface d’afficher le coût de ce prompt.
    usage = response_payload.get("usage")
    return GroqCompletion(
        content=content,
        prompt_tokens=_token_count(usage, "prompt_tokens"),
        completion_tokens=_token_count(usage, "completion_tokens"),
        total_tokens=_token_count(usage, "total_tokens"),
    )
