"""
EQUORA AI - Financial Ratios Engine
Calculates P/E, P/B, EPS, ROE, ROCE, Debt to Equity, and Profit Margins.
"""

from typing import Dict, Any

def evaluate_ratios(data: Dict[str, float]) -> Dict[str, Any]:
    """Evaluate financial metrics and return benchmark analysis."""
    price = data.get("price", 0.0)
    eps = data.get("eps", 1.0)
    book_value = data.get("book_value", 1.0)
    net_income = data.get("net_income", 0.0)
    equity = data.get("equity", 1.0)
    total_debt = data.get("total_debt", 0.0)
    revenue = data.get("revenue", 1.0)
    operating_profit = data.get("operating_profit", 0.0)

    pe_ratio = round(price / eps, 2) if eps else 0.0
    pb_ratio = round(price / book_value, 2) if book_value else 0.0
    roe = round((net_income / equity) * 100, 2) if equity else 0.0
    debt_to_equity = round(total_debt / equity, 2) if equity else 0.0
    net_margin = round((net_income / revenue) * 100, 2) if revenue else 0.0
    op_margin = round((operating_profit / revenue) * 100, 2) if revenue else 0.0

    valuation = "Fairly Valued"
    if pe_ratio > 35:
        valuation = "High Valuation / Growth Premium"
    elif pe_ratio < 15 and pe_ratio > 0:
        valuation = "Attractive / Undervalued"

    return {
        "pe_ratio": pe_ratio,
        "pb_ratio": pb_ratio,
        "roe": roe,
        "debt_to_equity": debt_to_equity,
        "net_margin": net_margin,
        "operating_margin": op_margin,
        "valuation_summary": valuation
    }
