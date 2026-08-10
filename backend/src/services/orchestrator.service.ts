/**
 * EQUORA AI Orchestrator Service
 * Intelligent Intent Router & Tool Calling Dispatcher.
 */

import { toolService, ToolExecutionResult } from './tool.service.js';
import { geminiService } from './gemini.service.js';

export interface OrchestrationResult {
  text: string;
  toolCalls: string[];
  stockCards: any[];
  charts: any[];
  sources: any[];
}

class OrchestratorService {
  async processQuery(userMessage: string, history: any[] = []): Promise<OrchestrationResult> {
    const lower = userMessage.toLowerCase();
    const executedTools: ToolExecutionResult[] = [];
    const toolNames: string[] = [];

    let stockCards: any[] = [];
    let charts: any[] = [];
    let sources: any[] = [];

    // 1. Intent Routing & Tool Calling Selection
    // Check for stock quote intent
    if (this.detectStockQuoteIntent(lower)) {
      const symbol = this.extractSymbol(lower);
      toolNames.push('getStockQuote');
      const res = await toolService.executeTool('getStockQuote', { symbol });
      executedTools.push(res);
      if (res.stockCards) stockCards.push(...res.stockCards);
    }

    // Check for historical prices / charts intent
    if (lower.includes('performance') || lower.includes('chart') || lower.includes('1 year') || lower.includes('1y') || lower.includes('history')) {
      const symbol = this.extractSymbol(lower);
      toolNames.push('getHistoricalPrices');
      const res = await toolService.executeTool('getHistoricalPrices', { symbol, period: '1Y' });
      executedTools.push(res);
      if (res.charts) charts.push(...res.charts);
    }

    // Check for news / recent movements intent
    if (lower.includes('fall') || lower.includes('down') || lower.includes('why') || lower.includes('news') || lower.includes('drop') || lower.includes('today')) {
      const symbol = this.extractSymbol(lower);
      toolNames.push('getNews');
      const res = await toolService.executeTool('getNews', { query: symbol });
      executedTools.push(res);
      if (res.sources) sources.push(...res.sources);
    }

    // Check for technical analysis RSI / MACD intent
    if (lower.includes('rsi') || lower.includes('macd') || lower.includes('indicator') || lower.includes('technical')) {
      const symbol = this.extractSymbol(lower);
      toolNames.push('calculateRSI');
      const res = await toolService.executeTool('calculateRSI', { symbol, period: 14 });
      executedTools.push(res);
      if (res.charts) charts.push(...res.charts);
    }

    // Check for return / CAGR calculation intent
    if (lower.includes('calculate') || lower.includes('return') || lower.includes('invested') || lower.includes('cagr') || lower.includes('bought')) {
      toolNames.push('calculateReturn');
      const res = await toolService.executeTool('calculateReturn', {
        initialInvestment: 50000,
        finalValue: 85000,
        years: 3.0
      });
      executedTools.push(res);
    }

    // Check for document RAG intent
    if (lower.includes('report') || lower.includes('annual') || lower.includes('document') || lower.includes('pdf') || lower.includes('risk')) {
      toolNames.push('searchDocuments');
      const res = await toolService.executeTool('searchDocuments', { query: userMessage });
      executedTools.push(res);
      if (res.sources) sources.push(...res.sources);
    }

    // 2. Synthesize AI answer using Gemini and tool execution results
    const textAnswer = await geminiService.generateAnswer(userMessage, history, executedTools);

    return {
      text: textAnswer,
      toolCalls: toolNames,
      stockCards,
      charts,
      sources
    };
  }

  private detectStockQuoteIntent(lower: string): boolean {
    return lower.includes('price') || lower.includes('quote') || lower.includes('pe') || lower.includes('p/e') ||
           lower.includes('valua') || lower.includes('tcs') || lower.includes('reliance') || lower.includes('infy') || lower.includes('nvda');
  }

  private extractSymbol(lower: string): string {
    if (lower.includes('reliance')) return 'RELIANCE';
    if (lower.includes('infy') || lower.includes('infosys')) return 'INFY';
    if (lower.includes('nvidia') || lower.includes('nvda')) return 'NVDA';
    if (lower.includes('nifty')) return 'NIFTY';
    return 'TCS';
  }
}

export const orchestratorService = new OrchestratorService();
