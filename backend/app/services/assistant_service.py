from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from app.data.demo_context import get_financial_demo_context
from app.models import AssistantMessage, AssistantRequest, AssistantResponse
from app.services.groq_provider import request_groq_completion
from app.services.guardrails import DISCRIMINATION_RESPONSE, build_system_prompt, is_discrimination_related


def _response(conversation_id: str, content: str) -> AssistantResponse:
    return AssistantResponse(
        conversationId=conversation_id,
        message=AssistantMessage(
            id=str(uuid4()),
            content=content,
            createdAt=datetime.now(timezone.utc).isoformat(),
        ),
    )


async def answer_assistant_question(payload: AssistantRequest) -> AssistantResponse:
    """The assistant use case: safety check, context preparation, then provider call."""
    if is_discrimination_related(payload.message):
        return _response(payload.conversation_id, DISCRIMINATION_RESPONSE)

    content = await request_groq_completion(payload, build_system_prompt(get_financial_demo_context()))
    return _response(payload.conversation_id, content)
