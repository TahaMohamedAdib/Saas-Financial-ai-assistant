from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class HistoryMessage(BaseModel):
    # Le rôle et le texte suffisent pour conserver un court contexte de conversation.
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=4_000)


class AssistantRequest(BaseModel):
    # Cette classe décrit exactement le JSON envoyé par le chat React.
    # Plus tard, cette valeur viendra du compte authentifié et non du navigateur.
    client_id: str = Field(min_length=1, max_length=120)
    conversation_id: str = Field(min_length=1, max_length=120)
    message: str = Field(min_length=1, max_length=4_000)
    history: list[HistoryMessage] = Field(default_factory=list, max_length=20)


class ClientTokenQuota(BaseModel):
    # Ce résumé permet à l'interface d'afficher le quota du client sans exposer de secret.
    clientId: str
    limitTokens: int = Field(ge=1)
    usedTokens: int = Field(ge=0)
    remainingTokens: int = Field(ge=0)


class TokenUsage(BaseModel):
    # Groq renvoie ces compteurs après un appel réel ; une demande filtrée reste à zéro.

    promptTokens: int = Field(ge=0)
    completionTokens: int = Field(ge=0)
    totalTokens: int = Field(ge=0)
    source: Literal["groq", "guardrail"]
    quota: ClientTokenQuota


class AssistantMessage(BaseModel):
    id: str
    role: Literal["assistant"] = "assistant"
    content: str
    createdAt: str
    usage: TokenUsage


class AssistantResponse(BaseModel):
    # Les clés en camelCase correspondent directement aux conventions TypeScript du frontend.
    conversationId: str
    message: AssistantMessage
