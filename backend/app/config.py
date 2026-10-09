from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


# Toute la configuration privée reste dans le backend Python, jamais dans Next.js.
BACKEND_ROOT = Path(__file__).resolve().parents[1]


def _read_dotenv(path: Path) -> dict[str, str]:
    """Charge un petit fichier .env sans dépendance et sans afficher ses valeurs."""
    if not path.is_file():
        return {}

    values: dict[str, str] = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip('"').strip("'")
    return values


_file_environment = _read_dotenv(BACKEND_ROOT / ".env")


def _setting(name: str, default: str = "") -> str:
    # Les variables du serveur de déploiement sont prioritaires sur le fichier .env local.
    return os.getenv(name) or _file_environment.get(name, default)


def _positive_int_setting(name: str, default: int) -> int:
    """Lit une limite numérique et arrête le démarrage si sa valeur est incohérente."""
    raw_value = _setting(name, str(default))
    try:
        value = int(raw_value)
    except ValueError as error:
        raise ValueError(f"{name} must be a positive integer.") from error

    if value < 1:
        raise ValueError(f"{name} must be a positive integer.")
    return value


@dataclass(frozen=True)
class Settings:
    groq_api_key: str
    groq_model: str
    frontend_origins: tuple[str, ...]
    assistant_tokens_per_client: int
    assistant_max_completion_tokens: int


# Les paramètres sont lus une fois au démarrage pour garder une configuration cohérente.
settings = Settings(
    groq_api_key=_setting("GROQ_API_KEY"),
    groq_model=_setting("GROQ_MODEL", "openai/gpt-oss-20b"),
    frontend_origins=tuple(
        origin.strip()
        for origin in _setting("FRONTEND_ORIGIN", "http://localhost:3000").split(",")
        if origin.strip()
    ),
    # Cette limite est par client identifié et se réinitialise tant qu'une base de données n'est pas branchée.
    assistant_tokens_per_client=_positive_int_setting("ASSISTANT_TOKENS_PER_CLIENT", 20_000),
    assistant_max_completion_tokens=_positive_int_setting("ASSISTANT_MAX_COMPLETION_TOKENS", 700),
)
