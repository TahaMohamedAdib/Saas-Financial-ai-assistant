from __future__ import annotations


def get_financial_demo_context() -> str:
    """A replaceable adapter for the application's real financial data source."""
    return """DEMONSTRATION DATA ONLY — do not present these figures as the user's live data.

October operating snapshot:
- Total expenses: EUR 4,550 (12% higher than September)
- Housing: EUR 1,420
- Food and dining: EUR 732 (EUR 92 above usual pace)
- Shopping: EUR 541
- Transportation: EUR 425
- Subscriptions: EUR 218
- Other: EUR 316
- Suggested dining cap: EUR 45 per week; following it could preserve EUR 88 this month.

Explain figures clearly, use concise bullet points or a small Markdown table when it adds clarity, and state when a conclusion relies on this demo dataset."""
