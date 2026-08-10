import yahooFinanceLib from 'yahoo-finance2';
const yahooFinance = (yahooFinanceLib as any).default || yahooFinanceLib;

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCapCr: number;
  peRatio: number;
  pbRatio: number;
  eps: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  volume: number;
  exchange: string;
  sector: string;
  timestamp: string;
  tickStatus?: 'up' | 'down' | 'neutral';
}

export interface HistoricalPrice {
  date: string;
  time?: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const DEFAULT_SYMBOLS = [
  'TCS.NS', 'RELIANCE.NS', 'INFY.NS', 'HDFCBANK.NS', 'ICICIBANK.NS',
  'TATAMOTORS.NS', 'SBIN.NS', 'WIPRO.NS', 'NVDA', 'AAPL', 'MSFT', 'TSLA', 'AMZN'
];

class MarketDataService {
  private lastPrices: Record<string, number> = {};

  private mapYahooQuoteToStockQuote(quote: any): StockQuote {
    const symbol = quote.symbol;
    const price = quote.regularMarketPrice || 0;
    
    let tickStatus: 'up' | 'down' | 'neutral' = 'neutral';
    if (this.lastPrices[symbol]) {
      if (price > this.lastPrices[symbol]) tickStatus = 'up';
      else if (price < this.lastPrices[symbol]) tickStatus = 'down';
    }
    this.lastPrices[symbol] = price;

    const exchange = quote.exchange === 'NSI' ? 'NSE' : quote.exchange || 'Unknown';
    const isIndian = exchange === 'NSE' || exchange === 'BSE' || symbol.endsWith('.NS') || symbol.endsWith('.BO');
    
    // Market cap conversion to match UI expectations (Crores for Indian, plain value or Billions for US)
    let marketCapCr = quote.marketCap || 0;
    if (isIndian) {
      marketCapCr = Math.floor(marketCapCr / 10000000); // Rough conversion to Crores for display
    }

    return {
      symbol: symbol.replace('.NS', ''),
      name: quote.shortName || quote.longName || symbol,
      price: Number(price.toFixed(2)),
      change: Number((quote.regularMarketChange || 0).toFixed(2)),
      changePercent: Number((quote.regularMarketChangePercent || 0).toFixed(2)),
      marketCapCr,
      peRatio: quote.trailingPE ? Number(quote.trailingPE.toFixed(2)) : 0,
      pbRatio: quote.priceToBook ? Number(quote.priceToBook.toFixed(2)) : 0,
      eps: quote.epsTrailingTwelveMonths ? Number(quote.epsTrailingTwelveMonths.toFixed(2)) : 0,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || 0,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow || 0,
      volume: quote.regularMarketVolume || 0,
      exchange: isIndian ? 'NSE' : exchange,
      sector: quote.sector || (isIndian ? 'Indian Equities' : 'US Tech'),
      timestamp: new Date().toISOString(),
      tickStatus
    };
  }

  async getAllQuotes(): Promise<StockQuote[]> {
    try {
      const quotes = await yahooFinance.quote(DEFAULT_SYMBOLS) as any[];
      return quotes.map((q: any) => this.mapYahooQuoteToStockQuote(q));
    } catch (error) {
      console.error('Error fetching all quotes:', error);
      return [];
    }
  }

  async getQuote(symbolInput: string): Promise<StockQuote> {
    try {
      // Basic normalization: if it's an Indian stock without suffix, try adding .NS
      let symbol = symbolInput.toUpperCase();
      if (!symbol.includes('.') && DEFAULT_SYMBOLS.includes(`${symbol}.NS`)) {
        symbol = `${symbol}.NS`;
      }
      
      const quote = await yahooFinance.quote(symbol) as any;
      return this.mapYahooQuoteToStockQuote(quote);
    } catch (error) {
      console.error(`Error fetching quote for ${symbolInput}:`, error);
      throw new Error(`Failed to fetch quote for ${symbolInput}`);
    }
  }

  async getHistoricalPrices(symbolInput: string, period: string = '1Y'): Promise<HistoricalPrice[]> {
    try {
      let symbol = symbolInput.toUpperCase();
      if (!symbol.includes('.') && DEFAULT_SYMBOLS.includes(`${symbol}.NS`)) {
        symbol = `${symbol}.NS`;
      }

      const end = new Date();
      const start = new Date();
      let interval: '1d' | '1wk' | '1mo' | '1m' | '5m' = '1d';

      if (period === '1D') {
        start.setDate(start.getDate() - 1); // Get past 1-2 days to ensure we have intraday ticks
        interval = '5m';
      } else if (period === '1W') {
        start.setDate(start.getDate() - 7);
        interval = '1d';
      } else if (period === '1M') {
        start.setMonth(start.getMonth() - 1);
        interval = '1d';
      } else if (period === '6M') {
        start.setMonth(start.getMonth() - 6);
        interval = '1wk';
      } else { // 1Y
        start.setFullYear(start.getFullYear() - 1);
        interval = '1wk';
      }

      const queryOptions = { period1: start.toISOString(), period2: end.toISOString(), interval };
      const result = await yahooFinance.chart(symbol, queryOptions as any) as any;
      
      if (!result.quotes || result.quotes.length === 0) return [];

      return result.quotes.map((q: any) => {
        const dateObj = new Date(q.date);
        let label = dateObj.toISOString().split('T')[0];
        let timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return {
          date: label,
          time: period === '1D' ? timeStr : label,
          open: Number(q.open?.toFixed(2) || 0),
          high: Number(q.high?.toFixed(2) || 0),
          low: Number(q.low?.toFixed(2) || 0),
          close: Number(q.close?.toFixed(2) || 0),
          volume: q.volume || 0
        };
      }).filter((q: any) => q.close > 0);
    } catch (error) {
      console.error(`Error fetching historical prices for ${symbolInput}:`, error);
      return [];
    }
  }

  async getMarketIndices() {
    try {
      const symbols = ['^NSEI', '^BSESN', '^NSEBANK', '^IXIC', '^GSPC'];
      const names: Record<string, string> = {
        '^NSEI': 'NIFTY 50',
        '^BSESN': 'SENSEX',
        '^NSEBANK': 'BANK NIFTY',
        '^IXIC': 'NASDAQ',
        '^GSPC': 'S&P 500'
      };
      
      const quotes = await yahooFinance.quote(symbols) as any[];
      
      return quotes.map((q: any) => {
        const change = q.regularMarketChange || 0;
        const pct = q.regularMarketChangePercent || 0;
        const isUp = change >= 0;
        const sign = isUp ? '+' : '';
        
        return {
          name: names[q.symbol] || q.symbol,
          value: q.regularMarketPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0',
          change: `${sign}${change.toFixed(2)} (${sign}${pct.toFixed(2)}%)`,
          isUp
        };
      });
    } catch (error) {
      console.error('Error fetching indices:', error);
      return [];
    }
  }
}

export const marketDataService = new MarketDataService();
