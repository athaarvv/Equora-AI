/**
 * EQUORA AI MongoDB Mongoose Schemas Definition
 * Covers Users, Conversations, Messages, Watchlists, Portfolios, and Documents.
 */

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ConversationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, default: 'New Financial Query' },
  summary: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const MessageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  toolCalls: { type: Array, default: [] },
  sources: { type: Array, default: [] },
  stockCards: { type: Array, default: [] },
  charts: { type: Array, default: [] },
  timestamp: { type: Date, default: Date.now }
});

const PortfolioSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  holdings: [{
    symbol: { type: String, required: true },
    shares: { type: Number, required: true },
    avgPrice: { type: Number, required: true },
    sector: { type: String, default: 'General' }
  }],
  updatedAt: { type: Date, default: Date.now }
});

const WatchlistSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  symbols: [{ type: String, required: true }],
  updatedAt: { type: Date, default: Date.now }
});

const DocumentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  filename: { type: String, required: true },
  filesize: { type: Number },
  summary: { type: String },
  chunks: [{
    text: String,
    page: Number,
    embedding: [Number]
  }],
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = {
  UserSchema,
  ConversationSchema,
  MessageSchema,
  PortfolioSchema,
  WatchlistSchema,
  DocumentSchema
};
