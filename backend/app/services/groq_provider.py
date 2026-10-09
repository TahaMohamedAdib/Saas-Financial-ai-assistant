from __future__ import annotations

import httpx
from fastapi import HTTPException

from app.config import settings
from app.models import AssistantRequest


GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions"


async def request_groq_completion(payload: AssistantRequest, system_prompt: str) -> str:
    """External provider adapter. Its API key never crosses the FastAPI boundary."""
    if not settings.groq_api_key:
        raise HTTPException(status_code=503, detail="Assistant provider is not configured on the server.")

    messages: list[dict[str, str]] = [{"role": "system", "content": system_prompt}]
    messages.extend({"role": item.role, "content": item.content} for item in payload.history[-12:])
    messages.append({"role": "user", "content": payload.message})

    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(30.0, connect=8.0)) as client:
            response = await client.post(
                GROQ_CHAT_URL,
                headers={"Authorization": f"Bearer {settings.groq_api_key}", "Content-Type": "application/json"},
                json={"model": settings.groq_model, "messages": messages, "temperature": 0.45, "max_tokens": 700},
            )
    except httpx.TimeoutException as error:
        raise HTTPException(status_code=504, detail="The assistant provider timed out. Please try again.") from error
    except httpx.HTTPError as error:
        raise HTTPException(status_code=503, detail="The assistant provider is temporarily unavailable.") from error

    if response.status_code >= 400:
        raise HTTPException(status_code=502, detail="The assistant provider returned an error.")

    try:
        content = response.json()["choices"][0]["message"]["content"].strip()
    except (KeyError, IndexError, TypeError, ValueError, AttributeError) as error:
        raise HTTPException(status_code=502, detail="The assistant provider returned an invalid response.") from error

    if not content:
        raise HTTPException(status_code=502, detail="The assistant provider returned an empty response.")
    return content
