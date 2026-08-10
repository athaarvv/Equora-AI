/**
 * EQUORA AI Market Data Service
 * Provides quotes, historical prices, company metrics, and indices.
 * Includes intelligent mock fallbacks for Indian (NSE/BSE) & US stocks.
 */

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
}

export interface HistoricalPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

class MarketDataService {
  private mockQuotes: Record<string, StockQuote> = {
    TCS: {
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
    },
    RELIANCE: {
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd.',
      price: 2890.10,
      change: 32.50,
      changePercent: 1.14,
      marketCapCr: 1954300,
      peRatio: 26.2,
      pbRatio: 2.3,
      eps: 110.30,
      fiftyTwoWeekHigh: 3024.90,
      fiftyTwoWeekLow: 2220.00,
      volume: 4890000,
      exchange: 'NSE',
      sector: 'Energy & Telecommunications',
      timestamp: new Date().toISOString()
    },
    INFY: {
      symbol: 'INFY',
      name: 'Infosys Limited',
      price: 1540.75,
      change: -12.30,
      changePercent: -0.79,
      marketCapCr: 639800,
      peRatio: 24.1,
      pbRatio: 7.8,
      eps: 63.90,
      fiftyTwoWeekHigh: 1733.00,
      fiftyTwoWeekLow: 1355.00,
      volume: 3100000,
      exchange: 'NSE',
      sector: 'Information Technology',
      timestamp: new Date().toISOString()
    },
    NVIDIA: {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      price: 124.50,
      change: 4.20,
      changePercent: 3.49,
      marketCapCr: 3060000,
      peRatio: 68.5,
      pbRatio: 45.2,
      eps: 1.82,
      fiftyTwoWeekHigh: 140.76,
      fiftyTwoWeekLow: 40.85,
      volume: 45000000,
      exchange: 'NASDAQ',
      sector: 'Semiconductors / AI',
      timestamp: new Date().toISOString()
    },
    NIFTY: {
      symbol: 'NIFTY50',
      name: 'NIFTY 50 Index',
      price: 24320.15,
      change: 85.40,
      changePercent: 0.35,
      marketCapCr: 0,
      peRatio: 22.8,
      pbRatio: 3.9,
      eps: 1066.00,
      fiftyTwoWeekHigh: 25078.00,
      fiftyTwoWeekLow: 19250.00,
      volume: 0,
      exchange: 'NSE',
      sector: 'Market Index',
      timestamp: new Date().toISOString()
    }
  };

  async getQuote(symbolInput: string): Promise<StockQuote> {
    const key = symbolInput.toUpperCase().replace('.NS', '').trim();
    if (this.mockQuotes[key]) {
      return this.mockQuotes[key];
    }

    // Default dynamic lookup fallback
    return {
      symbol: key,
      name: `${key} Corp`,
      price: 1250.00,
      change: 15.40,
      changePercent: 1.25,
      marketCapCr: 450000,
      peRatio: 21.5,
      pbRatio: 4.2,
      eps: 58.14,
      fiftyTwoWeekHigh: 1500.00,
      fiftyTwoWeekLow: 980.00,
      volume: 1200000,
      exchange: 'NSE',
      sector: 'General Enterprise',
      timestamp: new Date().toISOString()
    };
  }

  async getHistoricalPrices(symbolInput: string, period: string = '1Y'): Promise<HistoricalPrice[]> {
    const quote = await this.getQuote(symbolInput);
    const basePrice = quote.price;
    const points = period === '1M' ? 30 : period === '6M' ? 180 : 365;

    const list: HistoricalPrice[] = [];
    let current = basePrice * 0.82; // Start from earlier historical price

    for (let i = points; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const fluctuation = (Math.sin(i / 10) * 0.015 + (Math.random() - 0.48) * 0.02);
      current = Math.max(10, current * (1 + fluctuation));

      list.push({
        date: date.toISOString().split('T')[0],
        open: Number((current * 0.995).toFixed(2)),
        high: Number((current * 1.015).toFixed(2)),
        low: Number((current * 0.988).toFixed(2)),
        close: Number(current.toFixed(2)),
        volume: Math.floor(1000000 + Math.random() * 2000000)
      });
    }

    // Ensure last close matches quote price
    if (list.length > 0) {
      list[list.length - 1].close = basePrice;
    }

    return list;
  }

  async getMarketIndices() {
    return [
      { name: 'NIFTY 50', value: '24,320.15', change: '+85.40 (+0.35%)', status: 'up' },
      { name: 'SENSEX', value: '79,705.80', change: '+240.10 (+0.30%)', status: 'up' },
      { name: 'BANK NIFTY', value: '50,450.30', change: '-120.50 (-0.24%)', status: 'down' },
      { name: 'NASDAQ', value: '17,689.40', change: '+185.60 (+1.06%)', status: 'up' },
      { name: 'S&P 500', value: '5,540.20', change: '+32.10 (+0.58%)', status: 'up' }
    ];
  }
}

export const marketDataService = new MarketDataService();
