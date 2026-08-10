import { Router } from 'express';
import { handleChatMessage, getConversations, getConversationById, deleteConversation } from '../controllers/chat.controller.js';

const router = Router();

router.post('/', handleChatMessage);
router.get('/', getConversations);
router.get('/:id', getConversationById);
router.delete('/:id', deleteConversation);

export default router;
