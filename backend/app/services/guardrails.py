from __future__ import annotations

import re


# Ce contrôle local bloque une demande dangereuse avant tout appel payant au modèle.
DISCRIMINATION_PATTERNS = (
    re.compile(r"\bdiscriminat(?:e|ion|ory)\b", re.IGNORECASE),
    re.compile(r"\b(discrimination|discriminer|discriminatoire|raciste|racism|sexiste|sexisme)\b", re.IGNORECASE),
    re.compile(r"\b(refus(?:er)?|exclu(?:re|sion)?)\b.{0,80}\b(race|ethnie|religion|genre|sexe|handicap|nationalit[ée])\b", re.IGNORECASE),
)

FRENCH_DISCRIMINATION_RESPONSE = (
    "Je ne peux pas aider à discriminer, exclure ou traiter différemment des personnes "
    "selon une caractéristique protégée. Je peux en revanche aider à créer une politique "
    "professionnelle, légale et inclusive pour votre entreprise."
)

ENGLISH_DISCRIMINATION_RESPONSE = (
    "I cannot help discriminate against, exclude, or treat people differently based on a protected "
    "characteristic. I can help you create a professional, legal, and inclusive business policy instead."
)

ARABIC_DISCRIMINATION_RESPONSE = (
    "لا يمكنني المساعدة في التمييز ضد الأشخاص أو استبعادهم أو معاملتهم بشكل مختلف بسبب صفة محمية. "
    "يمكنني بدلاً من ذلك مساعدتك في وضع سياسة مهنية وقانونية وشاملة لشركتك."
)

SPANISH_DISCRIMINATION_RESPONSE = (
    "No puedo ayudar a discriminar, excluir ni tratar de forma diferente a personas por una característica "
    "protegida. En cambio, puedo ayudarte a crear una política empresarial profesional, legal e inclusiva."
)

LANGUAGE_MARKERS: tuple[tuple[str, re.Pattern[str]], ...] = (
    ("ar", re.compile(r"[\u0600-\u06ff]")),
    ("fr", re.compile(r"\b(comment|pourquoi|dépense|entreprise|bonjour|budget|avec|dans|les|des)\b", re.IGNORECASE)),
    ("es", re.compile(r"\b(cómo|gastos|empresa|presupuesto|hola|para|con|los|las)\b", re.IGNORECASE)),
)


def is_discrimination_related(message: str) -> bool:
    return any(pattern.search(message) for pattern in DISCRIMINATION_PATTERNS)


def discrimination_response_for(message: str) -> str:
    """Retourne une réponse locale dans la langue la plus probable du message bloqué."""
    for language, pattern in LANGUAGE_MARKERS:
        if pattern.search(message):
            return {
                "ar": ARABIC_DISCRIMINATION_RESPONSE,
                "fr": FRENCH_DISCRIMINATION_RESPONSE,
                "es": SPANISH_DISCRIMINATION_RESPONSE,
            }[language]
    return ENGLISH_DISCRIMINATION_RESPONSE


def build_system_prompt(demo_context: str) -> str:
    # Le prompt fixe le rôle de l’assistant et indique clairement que les données sont fictives.
    return f"""You are Ledgerly AI, a warm, practical business copilot inside a finance SaaS product.

You can answer questions about running a business: finance, expenses, budgets, cash flow, operations,
marketing, sales, reporting, team processes, planning, and how to use Ledgerly. Be direct and human;
do not sound like a generic policy notice. Ask a short follow-up question when essential context is missing.

Language is determined by the user's latest message. Always answer in that same language, even though the
system instructions and the demonstration data may use another language. If the user mixes languages, use
the dominant one. Do not announce or explain the language choice.

Never assist with discrimination, exclusion, or unequal treatment based on protected characteristics.
Do not pretend that demo data is a user's real financial data. Do not invent account balances or transactions.
Do not give individualized legal, tax, or investment advice; instead give high-level business information and
suggest consulting a qualified professional for decisions requiring it.

{demo_context}"""
