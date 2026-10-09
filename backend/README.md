# Ledgerly assistant backend

This FastAPI service owns the assistant business rules, the demonstration financial context, and the Groq API key. It exposes one public endpoint for the Next.js frontend:

`POST /v1/assistant/messages`

## Demo rapide sous Windows

Depuis la racine du projet, lancez une fois :

```bat
.\setup-demo.bat
```

Ensuite, ouvrez deux terminaux :

```bat
:: Terminal 1
.\start-backend.bat

:: Terminal 2
.\start-frontend.bat
```

Le site est disponible sur `http://localhost:3000`, et FastAPI sur `http://127.0.0.1:8000`.

## Run manually

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload --port 8000
```

The interactive API contract is available at `http://localhost:8000/docs` while the service is running.

`backend/.env` is deliberately ignored by Git. It is the only place the Groq key belongs.

## Quota de tokens par client

FastAPI applique un plafond de tokens Groq par `client_id`. Pour la démo, le navigateur envoie l'identifiant de l'espace de travail courant ; lors de l'intégration de l'authentification, le backend devra le déduire du compte connecté plutôt que de faire confiance au navigateur.

Ajoutez ou modifiez ces valeurs dans `backend/.env` :

```env
ASSISTANT_TOKENS_PER_CLIENT=20000
ASSISTANT_MAX_COMPLETION_TOKENS=700
```

Après chaque réponse, l'API renvoie les tokens utilisés, le cumul et le solde du client. Quand le plafond est atteint, elle retourne `HTTP 429`. Le compteur actuel est conservé en mémoire pour cette démo et revient à zéro au redémarrage de FastAPI ; une base de données pourra ensuite remplacer ce stockage.

## Langue de la réponse

Le prompt système impose à Ledgerly de répondre dans la langue du dernier message utilisateur. La règle s'applique quelle que soit la langue des instructions système ou des données de démonstration. Les réponses locales de sécurité couvrent aussi le français, l'anglais, l'arabe et l'espagnol sans appeler Groq.

## Test the chatbot from Jupyter

Keep FastAPI running in one terminal, then open a second terminal in `backend/`:

```bat
:: Depuis la racine du projet, apres avoir lance start-backend.bat
backend\.venv\Scripts\python.exe -m jupyter lab backend\notebooks\assistant_demo.ipynb
```

Dans VS Code, cliquez sur **Select Kernel** puis choisissez **Python 3.14 (Ledgerly)**. Le notebook appelle le même endpoint FastAPI que le site. Il vérifie la santé de l’API, lance une vraie question métier, vérifie le garde-fou et affiche les tokens. Il ne lit ni n’expose `GROQ_API_KEY`.
