from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


BACKEND_ROOT = Path(__file__).resolve().parents[1]


def _read_dotenv(path: Path) -> dict[str, str]:
    """Load a tiny, dependency-free .env file without exposing its values."""
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
    return os.getenv(name) or _file_environment.get(name, default)


@dataclass(frozen=True)
class Settings:
    groq_api_key: str
    groq_model: str
    frontend_origins: tuple[str, ...]


settings = Settings(
    groq_api_key=_setting("GROQ_API_KEY"),
    groq_model=_setting("GROQ_MODEL", "openai/gpt-oss-20b"),
    frontend_origins=tuple(
        origin.strip()
        for origin in _setting("FRONTEND_ORIGIN", "http://localhost:3000").split(",")
        if origin.strip()
    ),
)
