import { Request, Response, NextFunction } from 'express';
import { marketDataService } from '../services/marketData.service.js';

export const getAllQuotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quotes = await marketDataService.getAllQuotes();
    res.json(quotes);
  } catch (err) {
    next(err);
  }
};

export const getQuote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { symbol } = req.params;
    const quote = await marketDataService.getQuote(symbol);
    res.json(quote);
  } catch (err) {
    next(err);
  }
};

export const getHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { symbol } = req.params;
    const period = (req.query.period as string) || '1Y';
    const history = await marketDataService.getHistoricalPrices(symbol, period);
    res.json(history);
  } catch (err) {
    next(err);
  }
};

export const getIndices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const indices = await marketDataService.getMarketIndices();
    res.json(indices);
  } catch (err) {
    next(err);
  }
};
