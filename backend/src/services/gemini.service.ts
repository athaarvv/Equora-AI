/**
 * EQUORA AI Gemini Service
 * Handles AI model calls, central financial system prompt, tool orchestration, and memory context.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

import { groqService } from './groq.service.js';

export const SYSTEM_PROMPT = `
You are Equora AI, a high-precision conversational AI specialized in financial markets, equities, technical analysis, fundamental metrics, investing, macroeconomics, portfolio management, and financial document analysis.

Core Behavioral Guidelines:
1. Category-Free Experience: Seamlessly answer general concept questions, retrieve real-time quotes, perform Python calculations, or analyze current news without asking the user to choose categories.
2. Verified Grounding: When financial tools return data, incorporate quotes, historical charts, verified news, or annual report citations in your response.
3. No Financial Advice Guarantee: Provide evidence-based analysis, calculations, and explanations without making guaranteed price predictions.
4. Calculation Precision: Rely on tool-provided numerical calculations (RSI, CAGR, Returns, P/E) rather than guessing math.
5. Structured Clear Output: Use clear markdown, bullet points, headers, and bold text for readability.
`.trim();

class GeminiService {
  private aiClient: any = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      try {
        this.aiClient = new GoogleGenerativeAI(apiKey);
      } catch (err) {
        console.warn('[GeminiService] Initializing without active API key (using dynamic financial engine fallback)');
      }
    }
  }

  async generateAnswer(prompt: string, contextMessages: any[] = [], toolResults: any[] = []): Promise<string> {
    if (this.aiClient) {
      try {
        const model = this.aiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const response = await model.generateContent(`${SYSTEM_PROMPT}\n\nUser Question: ${prompt}\n\nTool Results: ${JSON.stringify(toolResults)}`);
        if (response && response.response) {
          return response.response.text();
        }
      } catch (err) {
        console.error('[Gemini API Error, checking Groq/fallback]:', err);
      }
    }

    // Try Groq API if GROQ_API_KEY is configured
    if (groqService.isAvailable()) {
      const groqAns = await groqService.generateAnswer(prompt, contextMessages, toolResults);
      if (groqAns) return groqAns;
    }

    // Local Financial Reasoning Engine Fallback
    return this.synthesizeLocalResponse(prompt, toolResults);
  }

  private synthesizeLocalResponse(prompt: string, toolResults: any[]): string {
    const lower = prompt.toLowerCase();

    // Check if tools were executed
    for (const tool of toolResults) {
      if (tool.toolName === 'getStockQuote') {
        const q = tool.result;
        return `### 📊 Market Quote: **${q.name} (${q.symbol})**\n\n` +
          `- **Current Price**: ₹${q.price.toLocaleString()} (${q.change >= 0 ? '+' : ''}${q.change} / ${q.changePercent}%)\n` +
          `- **Market Cap**: ₹${q.marketCapCr.toLocaleString()} Cr\n` +
          `- **P/E Ratio**: ${q.peRatio} | **EPS**: ₹${q.eps}\n` +
          `- **52-Week Range**: ₹${q.fiftyTwoWeekLow} — ₹${q.fiftyTwoWeekHigh}\n\n` +
          `**Analysis**: ${q.symbol} is currently trading at a P/E of **${q.peRatio}** on the ${q.exchange} exchange under the **${q.sector}** sector.`;
      }

      if (tool.toolName === 'getNews') {
        const news = tool.result[0];
        return `### 📰 Current News Analysis for **${tool.args.query.toUpperCase()}**\n\n` +
          `**Headline**: *${news.title}*\n` +
          `**Source**: ${news.source} (${news.timestamp})\n\n` +
          `**Summary**: ${news.summary}\n\n` +
          `**Market Impact**: The recent market movement in ${tool.args.query.toUpperCase()} is primarily influenced by quarterly earnings guidance, operational execution in key markets, and broader industry trends.`;
      }

      if (tool.toolName === 'calculateRSI') {
        const rsi = tool.result;
        return `### 📈 Technical Analysis: RSI Indicator for **${tool.args.symbol.toUpperCase()}**\n\n` +
          `- **RSI Value (14 Period)**: **${rsi.rsi}**\n` +
          `- **Signal**: **${rsi.signal}**\n` +
          `- **Interpretation**: ${rsi.interpretation}\n\n` +
          `When RSI is above 70, the asset is considered overbought; below 30 indicates oversold conditions. Currently at **${rsi.rsi}**, momentum is in the **${rsi.signal.toLowerCase()}** zone.`;
      }

      if (tool.toolName === 'calculateReturn') {
        const r = tool.result;
        return `### 🧮 Financial Return Calculation\n\n` +
          `- **Initial Investment**: ₹${r.initial_investment.toLocaleString()}\n` +
          `- **Final Value**: ₹${r.final_value.toLocaleString()}\n` +
          `- **Total Profit/Loss**: **₹${r.profit_loss.toLocaleString()}** (${r.formatted_return})\n` +
          `- **Annualized Return (CAGR)**: **${r.formatted_cagr}** over ${r.years} year(s).\n\n` +
          `*Note: Calculations are generated deterministically by the Python Financial Engine.*`;
      }

      if (tool.toolName === 'searchDocuments') {
        const chunk = tool.result[0];
        return `### 📑 Document Analysis Citation\n\n` +
          `From **${chunk ? chunk.section : 'Annual Report'}** (Page ${chunk ? chunk.page : 1}):\n\n` +
          `> "${chunk ? chunk.text : 'Information retrieved from company report.'}"\n\n` +
          `**Summary**: The annual report highlights operational strategies, cash flow management, and key enterprise risk disclosures.`;
      }
    }

    // Default conceptual Q&A responses
    if (lower.includes('p/e') || lower.includes('pe ratio')) {
      return `### 💡 Understanding the P/E Ratio (Price-to-Earnings)\n\n` +
        `The **Price-to-Earnings (P/E) ratio** measures a company's current share price relative to its per-share earnings.\n\n` +
        `$$\\text{P/E Ratio} = \\frac{\\text{Market Price per Share}}{\\text{Earnings per Share (EPS)}}$$\n\n` +
        `- **High P/E**: Investors expect higher earnings growth in the future compared to companies with a lower P/E.\n` +
        `- **Low P/E**: May indicate the company is currently undervalued or performing well relative to its current price.`;
    }

    return `Hello! I am **Equora AI**, your conversational financial intelligence assistant. Ask me anything about stocks (e.g. *"What is TCS price?"*), market events (*"Why did TCS fall today?"*), technical indicators (*"What is TCS RSI?"*), calculations (*"Calculate return on ₹50k to ₹80k over 3 yrs"*), or uploaded annual reports!`;
  }
}

export const geminiService = new GeminiService();
