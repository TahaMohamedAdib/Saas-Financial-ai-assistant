# Ledgerly assistant backend

This FastAPI service owns the assistant business rules, the demonstration financial context, and the Groq API key. It exposes one public endpoint for the Next.js frontend:

`POST /v1/assistant/messages`

## Run locally

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload --port 8000
```

The interactive API contract is available at `http://localhost:8000/docs` while the service is running.

`backend/.env` is deliberately ignored by Git. It is the only place the Groq key belongs.
