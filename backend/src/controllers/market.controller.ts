import { Request, Response } from 'express';
import { marketDataService } from '../services/marketData.service.js';

export const getQuote = async (req: Request, res: Response) => {
  const { symbol } = req.params;
  const quote = await marketDataService.getQuote(symbol);
  res.json(quote);
};

export const getHistory = async (req: Request, res: Response) => {
  const { symbol } = req.params;
  const period = (req.query.period as string) || '1Y';
  const history = await marketDataService.getHistoricalPrices(symbol, period);
  res.json(history);
};

export const getIndices = async (req: Request, res: Response) => {
  const indices = await marketDataService.getMarketIndices();
  res.json(indices);
};
