/**
 * EQUORA AI Function & Tool Calling Registry
 * Declarations and handlers for LLM tool invocation.
 */

import { marketDataService } from './marketData.service.js';
import { newsService } from './news.service.js';
import { pythonService } from './python.service.js';
import { ragService } from './rag.service.js';

export interface ToolExecutionResult {
  toolName: string;
  args: any;
  result: any;
  sources?: any[];
  stockCards?: any[];
  charts?: any[];
}

export class ToolService {
  public toolsDeclaration = [
    {
      name: 'getStockQuote',
      description: 'Get real-time financial quote, P/E ratio, market cap, 52-week range for a stock symbol (e.g. TCS, RELIANCE, INFY, NVDA).',
      parameters: {
        type: 'OBJECT',
        properties: {
          symbol: { type: 'STRING', description: 'Stock ticker symbol (e.g., TCS, RELIANCE, INFY, NVDA)' }
        },
        required: ['symbol']
      }
    },
    {
      name: 'getHistoricalPrices',
      description: 'Get historical price series for chart plotting and performance evaluation over period (1M, 6M, 1Y).',
      parameters: {
        type: 'OBJECT',
        properties: {
          symbol: { type: 'STRING', description: 'Stock ticker symbol' },
          period: { type: 'STRING', description: 'Time window: 1M, 6M, or 1Y' }
        },
        required: ['symbol']
      }
    },
    {
      name: 'getNews',
      description: 'Get current news, corporate announcements, and market reports for a stock or topic.',
      parameters: {
        type: 'OBJECT',
        properties: {
          query: { type: 'STRING', description: 'Search term or stock symbol' }
        },
        required: ['query']
      }
    },
    {
      name: 'calculateRSI',
      description: 'Calculate Relative Strength Index (RSI) momentum technical indicator using Python analytics.',
      parameters: {
        type: 'OBJECT',
        properties: {
          symbol: { type: 'STRING', description: 'Stock symbol' },
          period: { type: 'NUMBER', description: 'RSI period length (default 14)' }
        },
        required: ['symbol']
      }
    },
    {
      name: 'calculateReturn',
      description: 'Calculate investment return, profit/loss, and Compound Annual Growth Rate (CAGR).',
      parameters: {
        type: 'OBJECT',
        properties: {
          initialInvestment: { type: 'NUMBER', description: 'Initial investment amount in currency' },
          finalValue: { type: 'NUMBER', description: 'Final investment value in currency' },
          years: { type: 'NUMBER', description: 'Investment horizon in years' }
        },
        required: ['initialInvestment', 'finalValue']
      }
    },
    {
      name: 'searchDocuments',
      description: 'Search annual reports, financial PDFs, or uploaded documents using RAG vector similarity search.',
      parameters: {
        type: 'OBJECT',
        properties: {
          query: { type: 'STRING', description: 'Question or search query about the document' }
        },
        required: ['query']
      }
    }
  ];

  async executeTool(name: string, args: any): Promise<ToolExecutionResult> {
    switch (name) {
      case 'getStockQuote': {
        const quote = await marketDataService.getQuote(args.symbol);
        return {
          toolName: name,
          args,
          result: quote,
          stockCards: [quote]
        };
      }

      case 'getHistoricalPrices': {
        const period = args.period || '1Y';
        const history = await marketDataService.getHistoricalPrices(args.symbol, period);
        const quote = await marketDataService.getQuote(args.symbol);
        return {
          toolName: name,
          args,
          result: { symbol: args.symbol, period, historyLength: history.length, latestPrice: quote.price },
          charts: [{
            symbol: args.symbol,
            title: `${quote.name} (${args.symbol}) — ${period} Historical Price`,
            type: 'LINE',
            data: history
          }]
        };
      }

      case 'getNews': {
        const news = await newsService.searchNews(args.query);
        return {
          toolName: name,
          args,
          result: news,
          sources: news.map(item => ({
            name: item.source,
            title: item.title,
            url: item.url,
            timestamp: item.timestamp,
            summary: item.summary
          }))
        };
      }

      case 'calculateRSI': {
        const history = await marketDataService.getHistoricalPrices(args.symbol, '1M');
        const prices = history.map(h => h.close);
        const rsiRes = await pythonService.calculateRSI(prices, args.period || 14);
        return {
          toolName: name,
          args,
          result: rsiRes,
          charts: [{
            symbol: args.symbol,
            title: `${args.symbol} RSI Indicator (Period: ${args.period || 14})`,
            type: 'RSI',
            data: history.slice(-20),
            rsiValue: rsiRes.rsi
          }]
        };
      }

      case 'calculateReturn': {
        const retRes = await pythonService.calculateReturns(
          args.initialInvestment,
          args.finalValue,
          args.years || 1.0
        );
        return {
          toolName: name,
          args,
          result: retRes
        };
      }

      case 'searchDocuments': {
        const chunks = await ragService.searchDocument(args.query);
        return {
          toolName: name,
          args,
          result: chunks,
          sources: chunks.map(c => ({
            name: `Annual Report (Page ${c.page})`,
            title: c.section,
            summary: c.text,
            timestamp: 'Report Citation'
          }))
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}

export const toolService = new ToolService();
