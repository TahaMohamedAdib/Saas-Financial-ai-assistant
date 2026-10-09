# Architecture de l’assistant Ledgerly

## Vue d’ensemble

```text
Navigateur
  │
  │  POST http://localhost:8000/v1/assistant/messages
  ▼
frontend/ — Next.js / React
  src/features/assistant/assistant-screen.tsx   Interface, état du chat
  src/features/assistant/assistant-client.ts    Appel HTTP uniquement
  │
  ▼
backend/ — FastAPI / Python
  app/main.py                                  Routes HTTP et CORS
  app/models.py                                Validation Pydantic + contrat JSON
  app/services/assistant_service.py            Cas d’usage
  app/services/token_quota.py                  Quota de tokens par client
  app/services/guardrails.py                   Règles métier, langue et anti-discrimination
  app/data/demo_context.py                     Données financières de démonstration
  app/services/groq_provider.py                Appel sécurisé vers Groq
  │
  ▼
Groq API
```

## Séparation nette

| Zone | Rôle | Ne contient jamais |
| --- | --- | --- |
| `frontend/` | Interface React, composants, état local et requêtes HTTP | Clé Groq, prompt système, règles métier Python |
| `backend/` | API, validation, contexte de démonstration, règles et fournisseur IA | Composants React ou code exécuté par le navigateur |
| `backend/.env` | Secrets de serveur | Code versionné ; ce fichier est ignoré par Git |

Le frontend n’a aucune route `/api/assistant`. Il appelle FastAPI directement. Cette décision rend chaque partie déployable séparément et permet de remplacer Groq sans toucher au chat React.

## Contrat HTTP

### Requête

`POST /v1/assistant/messages`

```json
{
  "client_id": "workspace-alex-morgan",
  "conversation_id": "conversation-uuid",
  "message": "Analyse mes dépenses de ce mois",
  "history": [
    { "role": "user", "content": "Bonjour" },
    { "role": "assistant", "content": "Bonjour, comment puis-je vous aider ?" }
  ]
}
```

### Réponse

```json
{
  "conversationId": "conversation-uuid",
  "message": {
    "id": "message-uuid",
    "role": "assistant",
    "content": "Voici une synthèse…",
    "createdAt": "2026-10-09T12:00:00+00:00",
    "usage": {
      "promptTokens": 240,
      "completionTokens": 96,
      "totalTokens": 336,
      "source": "groq",
      "quota": {
        "clientId": "workspace-alex-morgan",
        "limitTokens": 20000,
        "usedTokens": 336,
        "remainingTokens": 19664
      }
    }
  }
}
```

Les types Pydantic dans `backend/app/models.py` contrôlent la requête et la réponse ; FastAPI publie automatiquement ce contrat dans `/docs`. `promptTokens` inclut les instructions système et l’historique transmis au modèle. Une demande refusée par le garde-fou retourne `source: "guardrail"` et trois compteurs à zéro, car Groq n’est pas appelé.

## Quota par client

`token_quota.py` cumule les tokens réellement retournés par Groq pour chaque `client_id`. Le plafond est configuré avec `ASSISTANT_TOKENS_PER_CLIENT` (20&nbsp;000 par défaut) et la réponse affiche le cumul restant. Une fois le plafond atteint, FastAPI répond `HTTP 429` sans contacter Groq. Pendant la démo, le stockage est en mémoire : il revient donc à zéro au redémarrage. Une intégration PostgreSQL ou Redis pourra remplacer ce service sans modifier le frontend.

## Parcours d’une question

1. `assistant-screen.tsx` construit le message et l’historique de la conversation.
2. `assistant-client.ts` appelle l’API FastAPI avec `fetch`.
3. `main.py` valide le JSON avec `AssistantRequest` et autorise seulement l’origine frontend configurée.
4. `assistant_service.py` bloque une demande discriminatoire avant tout appel au modèle, adapte la réponse locale à la langue détectée et consulte le quota du client.
5. Pour une demande autorisée, le backend ajoute uniquement le contexte de démonstration autorisé et appelle Groq.
6. Les tokens réels débitent le quota du client ; la réponse respecte le contrat JSON, puis React l’affiche dans le fil de discussion.

Le prompt système impose aussi la langue du dernier message utilisateur à la réponse Groq. Ainsi, les instructions internes en anglais et les données de démonstration ne changent pas la langue choisie par le client.

## Comment l’expliquer en 30 secondes

> « Le projet contient deux applications indépendantes. Le frontend Next.js ne fait que gérer l’expérience utilisateur et envoyer une requête HTTP. Le backend FastAPI reçoit cette requête, la valide avec Pydantic, applique les règles de sécurité et prépare le contexte financier de démonstration. Ensuite seulement, il appelle Groq avec une clé qui reste dans `backend/.env`. Le contrat JSON est documenté automatiquement par FastAPI, donc l’équipe peut remplacer le fournisseur IA ou ajouter une base de données sans modifier les composants React. »

## Notebook Python

[`backend/notebooks/assistant_demo.ipynb`](../backend/notebooks/assistant_demo.ipynb) reprend les concepts de filtrage, contexte de démonstration et appel Groq dans un format présentable en cours. Le notebook ne contient pas de clé API.
