"""
EQUORA AI - Returns & Volatility Engine
Calculates absolute return, CAGR, portfolio returns, max drawdown, and volatility.
"""

from typing import Dict, Any, List

def calculate_return(initial_investment: float, final_value: float) -> Dict[str, Any]:
    """Calculate absolute return percentage and total profit/loss."""
    profit_loss = final_value - initial_investment
    return_percentage = (profit_loss / initial_investment) * 100 if initial_investment else 0.0

    return {
        "initial_investment": round(initial_investment, 2),
        "final_value": round(final_value, 2),
        "profit_loss": round(profit_loss, 2),
        "return_percentage": round(return_percentage, 2),
        "formatted_return": f"{'+' if return_percentage >= 0 else ''}{round(return_percentage, 2)}%"
    }

def calculate_cagr(initial_value: float, final_value: float, years: float) -> Dict[str, Any]:
    """Calculate Compound Annual Growth Rate (CAGR)."""
    if initial_value <= 0 or years <= 0:
        cagr = 0.0
    else:
        cagr = ((final_value / initial_value) ** (1 / years) - 1) * 100

    return {
        "initial_value": round(initial_value, 2),
        "final_value": round(final_value, 2),
        "years": round(years, 2),
        "cagr": round(cagr, 2),
        "formatted_cagr": f"{round(cagr, 2)}% p.a."
    }

def calculate_drawdown(prices: List[float]) -> Dict[str, Any]:
    """Calculate Maximum Drawdown percentage from peak."""
    if not prices:
        return {"max_drawdown": 0.0, "peak": 0.0, "trough": 0.0}

    peak = prices[0]
    max_dd = 0.0
    trough = prices[0]

    for p in prices:
        if p > peak:
            peak = p
        dd = (peak - p) / peak * 100
        if dd > max_dd:
            max_dd = dd
            trough = p

    return {
        "max_drawdown": round(max_dd, 2),
        "peak": round(peak, 2),
        "trough": round(trough, 2)
    }

def calculate_volatility(prices: List[float]) -> Dict[str, Any]:
    """Calculate annualized volatility from price series."""
    if len(prices) < 2:
        return {"volatility": 0.0}

    returns = []
    for i in range(1, len(prices)):
        ret = (prices[i] - prices[i-1]) / prices[i-1]
        returns.append(ret)

    mean_ret = sum(returns) / len(returns)
    variance = sum((r - mean_ret) ** 2 for r in returns) / len(returns)
    daily_std = variance ** 0.5
    annualized_vol = daily_std * (252 ** 0.5) * 100

    return {
        "daily_std": round(daily_std * 100, 2),
        "annualized_volatility": round(annualized_vol, 2)
    }
