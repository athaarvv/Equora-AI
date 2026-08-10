"""
EQUORA AI - Technical Indicators Engine
Implements RSI, SMA, EMA, MACD, and Bollinger Bands using Pandas/NumPy.
"""

from typing import List, Dict, Any

def calculate_sma(prices: List[float], period: int = 14) -> List[float]:
    """Calculate Simple Moving Average."""
    if len(prices) < period:
        return prices
    sma = []
    for i in range(len(prices)):
        if i < period - 1:
            sma.append(sum(prices[:i+1]) / (i + 1))
        else:
            sma.append(sum(prices[i-period+1:i+1]) / period)
    return [round(x, 2) for x in sma]

def calculate_ema(prices: List[float], period: int = 14) -> List[float]:
    """Calculate Exponential Moving Average."""
    if not prices:
        return []
    multiplier = 2 / (period + 1)
    ema = [prices[0]]
    for i in range(1, len(prices)):
        val = (prices[i] - ema[-1]) * multiplier + ema[-1]
        ema.append(val)
    return [round(x, 2) for x in ema]

def calculate_rsi(prices: List[float], period: int = 14) -> Dict[str, Any]:
    """Calculate Relative Strength Index (RSI)."""
    if len(prices) <= period:
        current_rsi = 50.0
    else:
        gains = []
        losses = []
        for i in range(1, len(prices)):
            change = prices[i] - prices[i-1]
            if change > 0:
                gains.append(change)
                losses.append(0.0)
            else:
                gains.append(0.0)
                losses.append(abs(change))
        
        avg_gain = sum(gains[-period:]) / period
        avg_loss = sum(losses[-period:]) / period
        
        if avg_loss == 0:
            current_rsi = 100.0
        else:
            rs = avg_gain / avg_loss
            current_rsi = 100 - (100 / (1 + rs))

    signal = "NEUTRAL"
    if current_rsi >= 70:
        signal = "OVERBOUGHT"
    elif current_rsi <= 30:
        signal = "OVERSOLD"

    return {
        "rsi": round(current_rsi, 2),
        "period": period,
        "signal": signal,
        "interpretation": f"RSI is at {round(current_rsi, 2)}, indicating {signal.lower()} conditions."
    }

def calculate_macd(prices: List[float], fast_period: int = 12, slow_period: int = 26, signal_period: int = 9) -> Dict[str, Any]:
    """Calculate Moving Average Convergence Divergence (MACD)."""
    fast_ema = calculate_ema(prices, fast_period)
    slow_ema = calculate_ema(prices, slow_period)
    
    macd_line = [f - s for f, s in zip(fast_ema, slow_ema)]
    signal_line = calculate_ema(macd_line, signal_period)
    histogram = [m - s for m, s in zip(macd_line, signal_line)]
    
    latest_macd = macd_line[-1] if macd_line else 0.0
    latest_signal = signal_line[-1] if signal_line else 0.0
    latest_hist = histogram[-1] if histogram else 0.0

    trend = "BULLISH" if latest_macd > latest_signal else "BEARISH"

    return {
        "macd": round(latest_macd, 2),
        "signal_line": round(latest_signal, 2),
        "histogram": round(latest_hist, 2),
        "trend": trend
    }

def calculate_bollinger(prices: List[float], period: int = 20, num_std: float = 2.0) -> Dict[str, Any]:
    """Calculate Bollinger Bands."""
    if len(prices) < period:
        period = max(1, len(prices))
    
    recent_prices = prices[-period:]
    sma = sum(recent_prices) / len(recent_prices)
    variance = sum((x - sma) ** 2 for x in recent_prices) / len(recent_prices)
    std_dev = variance ** 0.5
    
    upper = sma + (std_dev * num_std)
    lower = sma - (std_dev * num_std)

    return {
        "middle": round(sma, 2),
        "upper": round(upper, 2),
        "lower": round(lower, 2),
        "bandwidth": round((upper - lower) / sma * 100, 2) if sma else 0.0
    }
