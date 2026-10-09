from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from fastapi import HTTPException

from app.config import settings
from app.data.demo_context import get_financial_demo_context
from app.models import AssistantMessage, AssistantRequest, AssistantResponse, TokenUsage
from app.services.groq_provider import request_groq_completion
from app.services.guardrails import build_system_prompt, discrimination_response_for, is_discrimination_related
from app.services.token_quota import token_quota


def _response(conversation_id: str, content: str, usage: TokenUsage) -> AssistantResponse:
    # Un seul endroit construit le format de réponse attendu par le client TypeScript.
    return AssistantResponse(
        conversationId=conversation_id,
        message=AssistantMessage(
            id=str(uuid4()),
            content=content,
            createdAt=datetime.now(timezone.utc).isoformat(),
            usage=usage,
        ),
    )


async def answer_assistant_question(payload: AssistantRequest) -> AssistantResponse:
    """Applique la sécurité, prépare le contexte, puis appelle le fournisseur IA."""
    # Les requêtes d'un même client sont traitées l'une après l'autre pour préserver son quota.
    async with token_quota.lock_client(payload.client_id):
        quota = await token_quota.get_quota(payload.client_id)

        # La sécurité est vérifiée avant tout appel externe : une demande bloquée ne consomme aucun token Groq.
        if is_discrimination_related(payload.message):
            return _response(
                payload.conversation_id,
                discrimination_response_for(payload.message),
                TokenUsage(promptTokens=0, completionTokens=0, totalTokens=0, source="guardrail", quota=quota),
            )

        # Le plafond est contrôlé avant l'appel payant. Le navigateur reçoit une erreur 429 claire si le client l'a atteint.
        if quota.remainingTokens == 0:
            raise HTTPException(
                status_code=429,
                detail="The AI token limit for this client has been reached. Please try again after the quota is reset.",
            )

        # Le contexte est fictif aujourd’hui ; cet appel sera le point d’intégration de la future base de données.
        completion = await request_groq_completion(
            payload,
            build_system_prompt(get_financial_demo_context()),
            max_completion_tokens=min(quota.remainingTokens, settings.assistant_max_completion_tokens),
        )
        # Groq renvoie les compteurs réels après sa réponse : c'est cette valeur qui est débitée du quota.
        quota = await token_quota.add_usage(payload.client_id, completion.total_tokens)
        return _response(
            payload.conversation_id,
            completion.content,
            TokenUsage(
                promptTokens=completion.prompt_tokens,
                completionTokens=completion.completion_tokens,
                totalTokens=completion.total_tokens,
                source="groq",
                quota=quota,
            ),
        )
