/**
 * EQUORA AI Backend Server Entry Point
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import chatRoutes from './routes/chat.routes.js';
import marketRoutes from './routes/market.routes.js';
import newsRoutes from './routes/news.routes.js';
import portfolioRoutes from './routes/portfolio.routes.js';
import documentRoutes from './routes/document.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

import { groqService } from './services/groq.service.js';

// Health Check
app.get('/api/health', (req, res) => {
  const geminiConfigured = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here');
  const groqConfigured = groqService.isAvailable();

  res.json({
    status: 'online',
    service: 'EQUORA AI Backend Orchestrator',
    aiProviders: {
      gemini: geminiConfigured ? 'configured' : 'fallback-mode',
      groq: groqConfigured ? 'configured' : 'not-configured',
      localEngine: 'active'
    },
    timestamp: new Date().toISOString()
  });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/documents', documentRoutes);

// Error Handling Middleware
app.use(errorHandler);

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 EQUORA AI Backend Orchestrator running on port ${PORT}`);
    console.log(`   Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
}

export default app;
