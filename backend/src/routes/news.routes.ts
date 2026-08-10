import { Router, Request, Response } from 'express';
import { newsService } from '../services/news.service.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const query = (req.query.q as string) || 'market';
  const news = await newsService.searchNews(query);
  res.json(news);
});

router.get('/company/:symbol', async (req: Request, res: Response) => {
  const { symbol } = req.params;
  const news = await newsService.searchNews(symbol, symbol);
  res.json(news);
});

export default router;
