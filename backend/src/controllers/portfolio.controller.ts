import { Request, Response, NextFunction } from 'express';
import { marketDataService } from '../services/marketData.service.js';

interface Holding {
  id: string;
  symbol: string;
  shares: number;
  avgPrice: number;
  sector: string;
}

let holdingsList: Holding[] = [
  { id: 'h1', symbol: 'TCS', shares: 10, avgPrice: 3200.00, sector: 'Information Technology' },
  { id: 'h2', symbol: 'RELIANCE', shares: 15, avgPrice: 2800.00, sector: 'Energy & Telecom' },
  { id: 'h3', symbol: 'INFY', shares: 25, avgPrice: 1420.00, sector: 'Information Technology' },
  { id: 'h4', symbol: 'NVDA', shares: 20, avgPrice: 110.00, sector: 'Semiconductors' }
];

export const getPortfolio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let totalInvested = 0;
    let currentValue = 0;

    const holdingsWithMetrics = await Promise.all(holdingsList.map(async h => {
      // Use fallback defaults if fetch fails so the whole portfolio doesn't crash
      let currentPrice = h.avgPrice; // Fallback price
      try {
         const quote = await marketDataService.getQuote(h.symbol);
         currentPrice = quote.price;
      } catch (e) {
         console.warn(`Could not fetch quote for ${h.symbol} in portfolio`);
      }
      
      const invested = h.shares * h.avgPrice;
      const value = h.shares * currentPrice;
      const pnl = value - invested;
      const pnlPct = (pnl / invested) * 100;

      totalInvested += invested;
      currentValue += value;

      return {
        ...h,
        currentPrice: currentPrice,
        investedAmount: Math.round(invested),
        currentValue: Math.round(value),
        pnl: Math.round(pnl),
        pnlPercentage: Math.round(pnlPct * 100) / 100
      };
    }));

    const totalPnL = currentValue - totalInvested;
    const totalPnLPct = totalInvested ? (totalPnL / totalInvested) * 100 : 0;

    res.json({
      summary: {
        totalInvested: Math.round(totalInvested),
        currentValue: Math.round(currentValue),
        totalPnL: Math.round(totalPnL),
        totalPnLPercentage: Math.round(totalPnLPct * 100) / 100
      },
      holdings: holdingsWithMetrics
    });
  } catch (err) {
    next(err);
  }
};

export const addHolding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { symbol, shares, avgPrice, sector } = req.body;
    const newHolding: Holding = {
      id: `h-${Date.now()}`,
      symbol: (symbol || 'TCS').toUpperCase(),
      shares: Number(shares) || 1,
      avgPrice: Number(avgPrice) || 100,
      sector: sector || 'General'
    };
    holdingsList.push(newHolding);
    res.status(201).json(newHolding);
  } catch (err) {
    next(err);
  }
};

export const deleteHolding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    holdingsList = holdingsList.filter(h => h.id !== id);
    res.json({ success: true, message: 'Holding removed' });
  } catch (err) {
    next(err);
  }
};
