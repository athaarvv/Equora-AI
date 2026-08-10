import { Router } from 'express';
import { getQuote, getHistory, getIndices } from '../controllers/market.controller.js';

const router = Router();

router.get('/quote/:symbol', getQuote);
router.get('/history/:symbol', getHistory);
router.get('/indices', getIndices);

export default router;
