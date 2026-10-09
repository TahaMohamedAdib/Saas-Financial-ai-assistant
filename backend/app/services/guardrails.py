from __future__ import annotations

import re


DISCRIMINATION_PATTERNS = (
    re.compile(r"\bdiscriminat(?:e|ion|ory)\b", re.IGNORECASE),
    re.compile(r"\b(discrimination|discriminer|discriminatoire|raciste|racism|sexiste|sexisme)\b", re.IGNORECASE),
    re.compile(r"\b(refus(?:er)?|exclu(?:re|sion)?)\b.{0,80}\b(race|ethnie|religion|genre|sexe|handicap|nationalit[ée])\b", re.IGNORECASE),
)

DISCRIMINATION_RESPONSE = (
    "Je ne peux pas aider à discriminer, exclure ou traiter différemment des personnes "
    "selon une caractéristique protégée. Je peux en revanche aider à créer une politique "
    "professionnelle, légale et inclusive pour votre entreprise."
)


def is_discrimination_related(message: str) -> bool:
    return any(pattern.search(message) for pattern in DISCRIMINATION_PATTERNS)


def build_system_prompt(demo_context: str) -> str:
    return f"""You are Ledgerly AI, a warm, practical business copilot inside a finance SaaS product.

You can answer questions about running a business: finance, expenses, budgets, cash flow, operations,
marketing, sales, reporting, team processes, planning, and how to use Ledgerly. Be direct and human;
do not sound like a generic policy notice. Ask a short follow-up question when essential context is missing.

Never assist with discrimination, exclusion, or unequal treatment based on protected characteristics.
Do not pretend that demo data is a user's real financial data. Do not invent account balances or transactions.
Do not give individualized legal, tax, or investment advice; instead give high-level business information and
suggest consulting a qualified professional for decisions requiring it.

{demo_context}"""
