"""
EQUORA AI - Python Analytics Microservice API
Exposes endpoints for RSI, MACD, Returns, CAGR, Ratios, and Drawdown.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from indicators import calculate_rsi, calculate_macd, calculate_sma, calculate_ema, calculate_bollinger
from returns import calculate_return, calculate_cagr, calculate_drawdown, calculate_volatility
from ratios import evaluate_ratios

app = FastAPI(title="EQUORA AI Analytics Engine", version="1.0.0")

class PriceSeriesRequest(BaseModel):
    prices: List[float]
    period: Optional[int] = 14

class ReturnRequest(BaseModel):
    initial_investment: float
    final_value: float
    years: Optional[float] = 1.0

class RatiosRequest(BaseModel):
    price: float
    eps: float
    book_value: Optional[float] = 100.0
    net_income: Optional[float] = 1000.0
    equity: Optional[float] = 5000.0
    total_debt: Optional[float] = 500.0
    revenue: Optional[float] = 10000.0
    operating_profit: Optional[float] = 2000.0

@app.get("/")
def health_check():
    return {"status": "ok", "service": "EQUORA AI Python Analytics Engine"}

@app.post("/analytics/rsi")
def rsi_endpoint(req: PriceSeriesRequest):
    if not req.prices:
        raise HTTPException(status_code=400, detail="Price series cannot be empty")
    return calculate_rsi(req.prices, req.period or 14)

@app.post("/analytics/macd")
def macd_endpoint(req: PriceSeriesRequest):
    if not req.prices:
        raise HTTPException(status_code=400, detail="Price series cannot be empty")
    return calculate_macd(req.prices)

@app.post("/analytics/returns")
def returns_endpoint(req: ReturnRequest):
    ret = calculate_return(req.initial_investment, req.final_value)
    cagr = calculate_cagr(req.initial_investment, req.final_value, req.years or 1.0)
    return {**ret, **cagr}

@app.post("/analytics/ratios")
def ratios_endpoint(req: RatiosRequest):
    return evaluate_ratios(req.dict())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
