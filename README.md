# Ledgerly Business

Ledgerly is a financial SaaS demonstration split into two independent applications:

| Application | Responsibility | Technology |
| --- | --- | --- |
| [`frontend/`](frontend) | SaaS interface, dashboard, chat UX and browser HTTP calls | Next.js 16, React 19, TypeScript, Tailwind |
| [`backend/`](backend) | Assistant API, safety rules, demo financial context and Groq integration | FastAPI, Python |

The browser never has access to `GROQ_API_KEY`. The key lives only in `backend/.env`, which is ignored by Git.

## Démonstration devant le professeur (Windows)

Depuis la racine du projet, n’écrivez pas `uvicorn` directement. Utilisez les lanceurs préparés :

```bat
:: Une seule fois avant la présentation
.\setup-demo.bat

:: Terminal 1 — laissez cette fenêtre ouverte
.\start-backend.bat

:: Terminal 2
.\start-frontend.bat
```

Ouvrez ensuite [http://localhost:3000](http://localhost:3000). Pour le notebook, ouvrez `backend/notebooks/assistant_demo.ipynb` dans VS Code, cliquez sur **Select Kernel**, choisissez **Python 3.14 (Ledgerly)**, puis cliquez sur **Run All**.

Checklist rapide :

1. Le terminal backend affiche `Uvicorn running on http://127.0.0.1:8000`.
2. Le navigateur ouvre le SaaS sur le port `3000`.
3. La première cellule du notebook affiche `FastAPI est disponible`.
4. La question métier affiche une réponse et ses tokens ; le test de sécurité affiche `0` token Groq.

## Start locally (manual)

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

The assistant also has a configurable token quota for each client. In `backend/.env`, adjust `ASSISTANT_TOKENS_PER_CLIENT` (20,000 by default) and restart FastAPI. The demo stores that counter in memory, so it resets when the backend restarts.

## Explaining the design

Read [the architecture guide](docs/assistant-architecture.md) for the HTTP contract and a short presentation script. The professor-facing Python notebook is at [backend/notebooks/assistant_demo.ipynb](backend/notebooks/assistant_demo.ipynb).
