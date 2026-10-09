# Ledgerly Business

Ledgerly is a financial SaaS demonstration split into two independent applications:

| Application | Responsibility | Technology |
| --- | --- | --- |
| [`frontend/`](frontend) | SaaS interface, dashboard, chat UX and browser HTTP calls | Next.js 16, React 19, TypeScript, Tailwind |
| [`backend/`](backend) | Assistant API, safety rules, demo financial context and Groq integration | FastAPI, Python |

The browser never has access to `GROQ_API_KEY`. The key lives only in `backend/.env`, which is ignored by Git.

## Start locally

Open two terminals from this repository root.

```powershell
# Terminal 1 — FastAPI
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload --port 8000
```

Set the Groq key in `backend/.env`. Do not put it in the frontend.

```powershell
# Terminal 2 — Next.js
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The FastAPI health check is at [http://localhost:8000/health](http://localhost:8000/health), and its interactive API documentation is at [http://localhost:8000/docs](http://localhost:8000/docs).

## Configuration

`frontend/.env.local` contains only public browser settings:

```env
NEXT_PUBLIC_AI_PROVIDER=fastapi
NEXT_PUBLIC_AI_API_URL=http://localhost:8000
```

`backend/.env` contains the private server settings; start from `backend/.env.example`.

## Explaining the design

Read [the architecture guide](docs/assistant-architecture.md) for the HTTP contract and a short presentation script. The professor-facing Python notebook is at [backend/notebooks/assistant_demo.ipynb](backend/notebooks/assistant_demo.ipynb).
