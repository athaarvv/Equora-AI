import axios from 'axios';
import { Conversation, Message, StockQuote } from '../types';

const API_BASE = '/api';

export const api = {
  // Chat APIs
  async sendChatMessage(message: string, conversationId?: string) {
    const res = await axios.post<{ conversationId: string; title: string; message: Message }>(
      `${API_BASE}/chat`,
      { message, conversationId }
    );
    return res.data;
  },

  async getConversations() {
    const res = await axios.get<Conversation[]>(`${API_BASE}/chat`);
    return res.data;
  },

  async getConversationById(id: string) {
    const res = await axios.get<Conversation & { messages: Message[] }>(`${API_BASE}/chat/${id}`);
    return res.data;
  },

  async deleteConversation(id: string) {
    const res = await axios.delete(`${API_BASE}/chat/${id}`);
    return res.data;
  },

  // Market APIs
  async getAllQuotes() {
    const res = await axios.get<StockQuote[]>(`${API_BASE}/market/all`);
    return res.data;
  },

  async getQuote(symbol: string) {
    const res = await axios.get<StockQuote>(`${API_BASE}/market/quote/${symbol}`);
    return res.data;
  },

  async getHistory(symbol: string, period: string = '1Y') {
    const res = await axios.get(`${API_BASE}/market/history/${symbol}?period=${period}`);
    return res.data;
  },

  async getMarketIndices() {
    const res = await axios.get(`${API_BASE}/market/indices`);
    return res.data;
  },

  // Portfolio APIs
  async getPortfolio() {
    const res = await axios.get(`${API_BASE}/portfolio`);
    return res.data;
  },

  // Documents API
  async uploadDocument(formData: FormData) {
    const res = await axios.post(`${API_BASE}/documents/upload`, formData);
    return res.data;
  }
};
