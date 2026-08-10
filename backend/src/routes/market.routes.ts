import { Router } from 'express';
import { getAllQuotes, getQuote, getHistory, getIndices } from '../controllers/market.controller.js';

const router = Router();

router.get('/all', getAllQuotes);
router.get('/quote/:symbol', getQuote);
router.get('/history/:symbol', getHistory);
router.get('/indices', getIndices);

export default router;
