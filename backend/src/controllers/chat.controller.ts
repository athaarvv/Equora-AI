import { Request, Response } from 'express';
import { orchestratorService } from '../services/orchestrator.service.js';

interface InMemoryChat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    toolCalls?: string[];
    stockCards?: any[];
    charts?: any[];
    sources?: any[];
    timestamp: string;
  }>;
}

const chatsMap = new Map<string, InMemoryChat>();

// Pre-seed sample conversation for chat history UI demonstration
chatsMap.set('chat-1', {
  id: 'chat-1',
  title: 'TCS Q1 Performance & Fall Analysis',
  createdAt: new Date(Date.now() - 3600000).toISOString(),
  updatedAt: new Date(Date.now() - 1800000).toISOString(),
  messages: [
    {
      id: 'msg-1',
      role: 'user',
      content: 'Why did TCS fall today?',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'msg-2',
      role: 'assistant',
      content: `### 📰 Current News Analysis for **TCS**\n\nTCS dipped today due to short-term cautious guidance regarding North American IT cloud transformation budgets.`,
      toolCalls: ['getStockQuote', 'getNews'],
      stockCards: [{
        symbol: 'TCS',
        name: 'Tata Consultancy Services Ltd.',
        price: 3421.50,
        change: -45.20,
        changePercent: -1.30,
        marketCapCr: 1238450,
        peRatio: 28.4,
        pbRatio: 12.1,
        eps: 120.45,
        fiftyTwoWeekHigh: 4254.75,
        fiftyTwoWeekLow: 3150.00,
        volume: 2450100,
        exchange: 'NSE',
        sector: 'Information Technology',
        timestamp: new Date().toISOString()
      }],
      sources: [{
        name: 'Financial Express / Market Wire',
        title: 'TCS Q1 Revenue Growth Softens Amid IT Spending Caution',
        url: 'https://finance.example.com/news/tcs-q1-spending-caution',
        timestamp: 'Aug 10, 2026 • 09:30 AM',
        summary: 'TCS reported a mild dip in quarterly deal momentum due to client budget deferrals.'
      }],
      timestamp: new Date(Date.now() - 3590000).toISOString()
    }
  ]
});

export const handleChatMessage = async (req: Request, res: Response) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    let chat = conversationId ? chatsMap.get(conversationId) : undefined;
    if (!chat) {
      const newId = `chat-${Date.now()}`;
      chat = {
        id: newId,
        title: message.length > 30 ? message.substring(0, 30) + '...' : message,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: []
      };
      chatsMap.set(newId, chat);
    }

    // Add user message
    const userMsg = {
      id: `msg-${Date.now()}-u`,
      role: 'user' as const,
      content: message,
      timestamp: new Date().toISOString()
    };
    chat.messages.push(userMsg);

    // Process via AI Orchestrator
    const result = await orchestratorService.processQuery(message, chat.messages);

    // Add assistant response
    const assistantMsg = {
      id: `msg-${Date.now()}-a`,
      role: 'assistant' as const,
      content: result.text,
      toolCalls: result.toolCalls,
      stockCards: result.stockCards,
      charts: result.charts,
      sources: result.sources,
      timestamp: new Date().toISOString()
    };
    chat.messages.push(assistantMsg);
    chat.updatedAt = new Date().toISOString();

    res.json({
      conversationId: chat.id,
      title: chat.title,
      message: assistantMsg
    });
  } catch (err: any) {
    res.status(500).json({
      error: true,
      message: 'Failed to process financial AI chat query.',
      fallbackMessage: "I couldn't complete the query right now. Please try again."
    });
  }
};

export const getConversations = async (req: Request, res: Response) => {
  const chats = Array.from(chatsMap.values()).map(c => ({
    id: c.id,
    title: c.title,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    lastMessage: c.messages[c.messages.length - 1]?.content || ''
  }));
  res.json(chats);
};

export const getConversationById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const chat = chatsMap.get(id);
  if (!chat) return res.status(404).json({ error: 'Conversation not found.' });
  res.json(chat);
};

export const deleteConversation = async (req: Request, res: Response) => {
  const { id } = req.params;
  chatsMap.delete(id);
  res.json({ success: true, message: 'Conversation deleted.' });
};
