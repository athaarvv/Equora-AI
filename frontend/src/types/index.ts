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

export interface NewsSource {
  name: string;
  title: string;
  url: string;
  timestamp: string;
  summary: string;
}

export interface ChartDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartPayload {
  symbol: string;
  title: string;
  type: 'LINE' | 'CANDLESTICK' | 'RSI';
  data: ChartDataPoint[];
  rsiValue?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolCalls?: string[];
  stockCards?: StockQuote[];
  charts?: ChartPayload[];
  sources?: NewsSource[];
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
  messages?: Message[];
}
