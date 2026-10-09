from __future__ import annotations

import asyncio
from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from app.config import settings
from app.models import ClientTokenQuota


class InMemoryTokenQuota:
    """Suit la consommation par client jusqu'à l'ajout d'une base de données."""

    def __init__(self, limit_tokens: int) -> None:
        self._limit_tokens = limit_tokens
        self._used_tokens_by_client: dict[str, int] = {}
        self._lock = asyncio.Lock()
        self._client_locks: dict[str, asyncio.Lock] = {}

    def _quota(self, client_id: str, used_tokens: int) -> ClientTokenQuota:
        return ClientTokenQuota(
            clientId=client_id,
            limitTokens=self._limit_tokens,
            usedTokens=used_tokens,
            remainingTokens=max(0, self._limit_tokens - used_tokens),
        )

    async def get_quota(self, client_id: str) -> ClientTokenQuota:
        """Retourne le compteur actuel sans consommer de token."""
        async with self._lock:
            return self._quota(client_id, self._used_tokens_by_client.get(client_id, 0))

    @asynccontextmanager
    async def lock_client(self, client_id: str) -> AsyncIterator[None]:
        """Sérialise les appels d'un même client pour éviter qu'il dépasse son quota en parallèle."""
        async with self._lock:
            client_lock = self._client_locks.setdefault(client_id, asyncio.Lock())

        async with client_lock:
            yield

    async def add_usage(self, client_id: str, token_count: int) -> ClientTokenQuota:
        """Ajoute uniquement les tokens réellement retournés par Groq."""
        async with self._lock:
            used_tokens = self._used_tokens_by_client.get(client_id, 0) + max(0, token_count)
            self._used_tokens_by_client[client_id] = used_tokens
            return self._quota(client_id, used_tokens)


# Pendant la démo, les compteurs vivent en mémoire et repartent à zéro au redémarrage de FastAPI.
# Une future implémentation PostgreSQL ou Redis pourra garder la même interface get_quota/add_usage.
token_quota = InMemoryTokenQuota(settings.assistant_tokens_per_client)
