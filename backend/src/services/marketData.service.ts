import axios from 'axios';
import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'da3jhppr01qual4qdiugda3jhppr01qual4qdiv0';
const ALPHA_VANTAGE_API_KEY = 'demo';

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCapCr?: number;
  peRatio?: number;
  pbRatio?: number;
  eps?: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  volume?: number;
  exchange: string;
  sector?: string;
  timestamp: string;
  tickStatus?: 'up' | 'down' | 'neutral';
  currency?: string;
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

const INDIAN_API_BASE = 'https://stock.indianapi.in';

class MarketDataService {
  private lastPrices: Record<string, number> = {};

  private get headers() {
    return {
      'X-Api-Key': process.env.INDIAN_API_KEY || ''
    };
  }

  private get yf() {
    return yahooFinance;
  }

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
    
    let marketCapCr = quote.marketCap || 0;
    if (isIndian) {
      marketCapCr = Math.floor(marketCapCr / 10000000); 
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

  private mapIndianApiQuoteToStockQuote(quote: any, querySymbol: string): StockQuote {
    const symbol = quote.tickerId || querySymbol;
    const price = quote.currentPrice?.NSE || quote.currentPrice?.BSE || 0;
    
    let tickStatus: 'up' | 'down' | 'neutral' = 'neutral';
    if (this.lastPrices[symbol]) {
      if (price > this.lastPrices[symbol]) tickStatus = 'up';
      else if (price < this.lastPrices[symbol]) tickStatus = 'down';
    }
    this.lastPrices[symbol] = price;

    return {
      symbol,
      name: quote.companyName || symbol,
      price: Number(price),
      change: 0, 
      changePercent: Number(quote.percentChange || 0),
      marketCapCr: quote.keyMetrics?.MarketCap ? Number(quote.keyMetrics.MarketCap.replace(/[^0-9.]/g, '')) : 0,
      peRatio: Number(quote.keyMetrics?.PE || 0),
      pbRatio: Number(quote.keyMetrics?.PB || 0),
      eps: 0, 
      fiftyTwoWeekHigh: Number(quote.yearHigh || 0),
      fiftyTwoWeekLow: Number(quote.yearLow || 0),
      volume: 0,
      exchange: 'NSE',
      sector: quote.industry || 'Indian Equities',
      timestamp: new Date().toISOString(),
      tickStatus
    };
  }

  async getAllQuotes(): Promise<StockQuote[]> {
    try {
      const quotes = await Promise.all(DEFAULT_SYMBOLS.map(sym => this.getQuote(sym).catch(() => null)));
      return quotes.filter(q => q !== null) as StockQuote[];
    } catch (error) {
      console.error('Error fetching all quotes:', error);
      return [];
    }
  }

  async getQuote(symbol: string): Promise<StockQuote> {
    let querySymbol = symbol.toUpperCase().trim();
    const indianStocks = ['TCS', 'RELIANCE', 'INFY', 'HDFCBANK', 'ICICIBANK', 'TATAMOTORS', 'SBIN', 'WIPRO'];
    if (indianStocks.includes(querySymbol)) {
      querySymbol += '.NS';
    }
    const isIndian = querySymbol.endsWith('.NS') || querySymbol.endsWith('.BO');
    
    if (isIndian && process.env.INDIAN_API_KEY && process.env.INDIAN_API_KEY !== 'your_indian_api_key_here') {
      try {
        const response = await axios.get(`${INDIAN_API_BASE}/stock?name=${querySymbol}`, { headers: this.headers });
        if (response.data) {
          return this.mapIndianApiQuoteToStockQuote(response.data, querySymbol);
        }
      } catch (e) {
         console.warn(`Indian API failed for ${querySymbol}, falling back to Finnhub/YF`);
      }
    }

    try {
      const cleanSymbol = querySymbol.replace('.NS', '').replace('.BO', '');
      const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${cleanSymbol}&token=${FINNHUB_API_KEY}`);
      if (response.data && response.data.c !== 0) {
        const data = response.data;
        const price = data.c;
        let tickStatus: 'up' | 'down' | 'neutral' = 'neutral';
        if (this.lastPrices[querySymbol]) {
          if (price > this.lastPrices[querySymbol]) tickStatus = 'up';
          else if (price < this.lastPrices[querySymbol]) tickStatus = 'down';
        }
        this.lastPrices[querySymbol] = price;
        return {
          symbol: querySymbol,
          name: querySymbol,
          price: price,
          change: data.d || 0,
          changePercent: data.dp || 0,
          tickStatus,
          fiftyTwoWeekHigh: data.h || 0,
          fiftyTwoWeekLow: data.l || 0,
          exchange: isIndian ? 'NSE' : 'US',
          timestamp: new Date().toISOString(),
          currency: isIndian ? 'INR' : 'USD'
        };
      }
    } catch (e) {
      console.warn(`Finnhub failed for ${querySymbol}, falling back to YF`);
    }

    try {
      const quote = await yahooFinance.quote(querySymbol);
      return this.mapYahooQuoteToStockQuote(quote);
    } catch (error: any) {
      console.error(`Error fetching quote for ${querySymbol}:`, error.message);
      throw new Error(`Failed to fetch quote for ${querySymbol}`);
    }
  }

  async getHistoricalPrices(symbol: string, period: string = '1Y'): Promise<HistoricalPrice[]> {
    let querySymbol = symbol.toUpperCase().trim();
    const indianStocks = ['TCS', 'RELIANCE', 'INFY', 'HDFCBANK', 'ICICIBANK', 'TATAMOTORS', 'SBIN', 'WIPRO'];
    if (indianStocks.includes(querySymbol)) {
      querySymbol += '.NS';
    }
    const isIndian = querySymbol.endsWith('.NS') || querySymbol.endsWith('.BO');
    
    let indianPeriod = '1yr';
    if (period === '1M') indianPeriod = '1mo';
    if (period === '6M') indianPeriod = '6mo';
    
    if (isIndian && period !== '1D' && period !== '1W' && process.env.INDIAN_API_KEY && process.env.INDIAN_API_KEY !== 'your_indian_api_key_here') {
        try {
          const response = await axios.get(`${INDIAN_API_BASE}/historical_data?stock_name=${querySymbol}&period=${indianPeriod}&filter=price`, { headers: this.headers });
          
          if (response.data && response.data.datasets && response.data.datasets.length > 0) {
            const priceDataset = response.data.datasets.find((d: any) => d.metric === 'Price');
            if (priceDataset && priceDataset.values) {
               return priceDataset.values.map((v: any) => {
                  const dateStr = v[0];
                  const priceVal = Number(v[1]);
                  return {
                    date: dateStr,
                    time: dateStr,
                    open: priceVal,
                    high: priceVal,
                    low: priceVal,
                    close: priceVal,
                    volume: 0
                  };
               });
            }
          }
        } catch (e) {
           console.warn(`Indian API historical failed for ${querySymbol}, falling back to Alpha Vantage/YF`);
        }
    }

    try {
      const cleanSymbol = querySymbol.replace('.NS', '').replace('.BO', '');
      const avResponse = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${cleanSymbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
      if (avResponse.data && avResponse.data['Time Series (Daily)']) {
        const timeSeries = avResponse.data['Time Series (Daily)'];
        const dates = Object.keys(timeSeries).sort();
        
        let daysToKeep = 365;
        if (period === '1M') daysToKeep = 30;
        if (period === '6M') daysToKeep = 180;
        
        const recentDates = dates.slice(-daysToKeep);
        return recentDates.map(dateStr => {
          const dayData = timeSeries[dateStr];
          return {
            date: dateStr,
            time: dateStr,
            open: Number(dayData['1. open']),
            high: Number(dayData['2. high']),
            low: Number(dayData['3. low']),
            close: Number(dayData['4. close']),
            volume: Number(dayData['5. volume'])
          };
        });
      }
    } catch (e) {
      console.warn(`Alpha Vantage failed for ${querySymbol}, falling back to YF`);
    }

    try {
      const end = new Date();
      const start = new Date();
      let interval: '1d' | '1wk' | '1mo' | '1m' | '5m' = '1d';

      if (period === '1D') {
        start.setDate(start.getDate() - 5);
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
      } else { 
        start.setFullYear(start.getFullYear() - 1);
        interval = '1wk';
      }

      const queryOptions = { period1: start.toISOString(), period2: end.toISOString(), interval };
      const result = await this.yf.chart(querySymbol, queryOptions as any) as any;
      
      if (!result.quotes || result.quotes.length === 0) return [];

      let mapped = result.quotes.map((q: any) => {
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

      // If it's a 1D chart and we fetched 5 days of data, filter only the last available day's data
      if (period === '1D' && mapped.length > 0) {
        const lastDate = mapped[mapped.length - 1].date;
        mapped = mapped.filter((q: any) => q.date === lastDate);
      }

      return mapped;
    } catch (error: any) {
      console.error(`Error fetching historical prices for ${querySymbol}:`, error.message);
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
      
      const quotes = await this.yf.quote(symbols) as any[];
      
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
    } catch (error: any) {
      console.error('Error fetching indices:', error.message);
      return [];
    }
  }
}

export const marketDataService = new MarketDataService();
