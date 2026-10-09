from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.models import AssistantRequest, AssistantResponse
from app.services.assistant_service import answer_assistant_question


# Ce fichier reste volontairement léger : la logique métier vit dans services/.
app = FastAPI(
    title="Ledgerly Assistant API",
    version="1.0.0",
    description="Backend-only service for Ledgerly's business assistant.",
)

# Seul le frontend Next.js configuré peut appeler cette API depuis un navigateur.
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.frontend_origins),
    allow_credentials=False,
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)


@app.get("/health", tags=["system"])
async def health() -> dict[str, str]:
    # Cette route permet au déploiement ou au professeur de vérifier que l’API répond.
    return {"status": "ok"}


@app.post(
    "/v1/assistant/messages",
    response_model=AssistantResponse,
    tags=["assistant"],
    summary="Ask Ledgerly's business assistant a question",
)
async def create_assistant_message(payload: AssistantRequest) -> AssistantResponse:
    # FastAPI valide le JSON avant d’appeler cette fonction de service.
    return await answer_assistant_question(payload)
