import { Router } from 'express';
import { getPortfolio, addHolding, deleteHolding } from '../controllers/portfolio.controller.js';

const router = Router();

router.get('/', getPortfolio);
router.post('/', addHolding);
router.delete('/:id', deleteHolding);

export default router;
