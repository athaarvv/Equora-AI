import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { StockCard } from '../components/StockCard';
import { StockQuote, ChartDataPoint } from '../types';
import { api } from '../services/api';
import { 
  Search, TrendingUp, TrendingDown, BarChart2, Radio, Play, Pause, 
  Activity, RefreshCw, Zap, Layers, ChevronRight, Eye
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar 
} from 'recharts';

export const MarketPage: React.FC = () => {
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('TCS');
  const [selectedQuote, setSelectedQuote] = useState<StockQuote | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [timeframe, setTimeframe] = useState<string>('1D');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'NSE' | 'NASDAQ' | 'GAINERS' | 'LOSERS'>('ALL');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [loadingChart, setLoadingChart] = useState<boolean>(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('');

  // Fetch all stock quotes from backend
  const fetchAllQuotes = async () => {
    try {
      const data = await api.getAllQuotes();
      if (Array.isArray(data)) {
        setQuotes(data);
        setLastUpdatedTime(new Date().toLocaleTimeString());
        
        // Update selected stock if currently active
        const current = data.find(q => q.symbol.toUpperCase() === selectedSymbol.toUpperCase());
        if (current) {
          setSelectedQuote(current);
        }
      }
    } catch (err) {
      console.error('Error fetching all quotes:', err);
    }
  };

  // Fetch chart price history for selected stock and timeframe
  const fetchChartHistory = async (symbol: string, tf: string) => {
    try {
      setLoadingChart(true);
      const history = await api.getHistory(symbol, tf);
      if (Array.isArray(history)) {
        setChartData(history);
      }
    } catch (err) {
      console.error('Error fetching chart history:', err);
    } finally {
      setLoadingChart(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAllQuotes();
    fetchChartHistory(selectedSymbol, timeframe);
  }, []);

  // Timeframe change handler
  const handleTimeframeChange = (tf: string) => {
    setTimeframe(tf);
    fetchChartHistory(selectedSymbol, tf);
  };

  // Select stock handler
  const handleSelectStock = (stock: StockQuote) => {
    setSelectedSymbol(stock.symbol);
    setSelectedQuote(stock);
    fetchChartHistory(stock.symbol, timeframe);
  };

  // Live Auto-Refresh Interval (2 seconds)
  useEffect(() => {
    let interval: any = null;
    if (isLiveStreaming) {
      interval = setInterval(() => {
        fetchAllQuotes();
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLiveStreaming, selectedSymbol]);

  // Filtered quotes based on search and category
  const filteredQuotes = quotes.filter(q => {
    const matchesSearch = 
      q.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.sector.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeCategory === 'NSE') return q.exchange === 'NSE';
    if (activeCategory === 'NASDAQ') return q.exchange === 'NASDAQ';
    if (activeCategory === 'GAINERS') return q.changePercent > 0;
    if (activeCategory === 'LOSERS') return q.changePercent < 0;

    return true;
  });

  return (
    <div className="flex h-screen w-screen bg-[#0b0f19] overflow-hidden text-slate-100 font-sans">
      <Sidebar conversations={[]} onNewChat={() => {}} onSelectChat={() => {}} onDeleteChat={() => {}} />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto">
        <TopBar />

        <div className="p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 md:p-5 rounded-2xl border border-slate-800 shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                  <Activity className="w-5 h-5" />
                </span>
                <h1 className="text-lg md:text-xl font-bold text-white tracking-wide">
                  Live Stock Market & Equities Hub
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-pulse" /> LIVE STREAMING
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Real-time price ticks for Indian & US stocks • Auto-refresh active • Interactive intraday charts
              </p>
            </div>

            {/* Live Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLiveStreaming(!isLiveStreaming)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
                  isLiveStreaming 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {isLiveStreaming ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> Live Tick Active (2s)
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> Resume Streaming
                  </>
                )}
              </button>

              <button
                onClick={fetchAllQuotes}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
                title="Refresh Market Data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {lastUpdatedTime && (
                <span className="text-[10px] font-mono text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800">
                  Refreshed: {lastUpdatedTime}
                </span>
              )}
            </div>
          </div>

          {/* Featured Live Chart Section */}
          {selectedQuote && (
            <div className="bg-[#111726] rounded-2xl border border-slate-800/90 p-5 shadow-2xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-sm font-mono text-emerald-400">
                    {selectedQuote.symbol.substring(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-white">{selectedQuote.name}</h2>
                      <span className="text-[10px] font-mono font-bold bg-slate-800 px-2 py-0.5 rounded text-slate-300 border border-slate-700">
                        {selectedQuote.exchange} • {selectedQuote.sector}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-lg font-extrabold font-mono text-white">
                        {selectedQuote.exchange === 'NASDAQ' ? '$' : '₹'}
                        {selectedQuote.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                      <span className={`text-xs font-bold font-mono flex items-center gap-0.5 px-2 py-0.5 rounded ${
                        selectedQuote.change >= 0 
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-rose-950/80 text-rose-400 border border-rose-500/30'
                      }`}>
                        {selectedQuote.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {selectedQuote.change >= 0 ? '+' : ''}{selectedQuote.change.toFixed(2)} ({selectedQuote.changePercent >= 0 ? '+' : ''}{selectedQuote.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeframe Controls */}
                <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
                  {['1D', '1W', '1M', '6M', '1Y'].map(tf => (
                    <button
                      key={tf}
                      onClick={() => handleTimeframeChange(tf)}
                      className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all ${
                        timeframe === tf
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Live Area Chart */}
              <div className="h-72 w-full relative">
                {loadingChart && (
                  <div className="absolute inset-0 bg-[#111726]/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
                  </div>
                )}
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="liveChartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={selectedQuote.change >= 0 ? '#10b981' : '#f43f5e'} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={selectedQuote.change >= 0 ? '#10b981' : '#f43f5e'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                    <XAxis 
                      dataKey={timeframe === '1D' ? 'time' : 'date'} 
                      stroke="#475569" 
                      tick={{ fontSize: 10, fill: '#94a3b8' }}
                    />
                    <YAxis 
                      domain={['auto', 'auto']}
                      stroke="#475569" 
                      tick={{ fontSize: 10, fill: '#94a3b8' }}
                      tickFormatter={(val) => `${selectedQuote.exchange === 'NASDAQ' ? '$' : '₹'}${val}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        borderColor: '#334155',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#f8fafc',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                      }}
                      formatter={(val: any) => [`${selectedQuote.exchange === 'NASDAQ' ? '$' : '₹'}${Number(val).toLocaleString()}`, 'Price']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="close" 
                      stroke={selectedQuote.change >= 0 ? '#10b981' : '#f43f5e'} 
                      strokeWidth={2.5}
                      fillOpacity={1} 
                      fill="url(#liveChartGrad)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Fundamental Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">P/E Ratio</span>
                  <p className="text-sm font-bold font-mono text-emerald-400">{selectedQuote.peRatio}</p>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">P/B Ratio</span>
                  <p className="text-sm font-bold font-mono text-white">{selectedQuote.pbRatio}</p>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">EPS</span>
                  <p className="text-sm font-bold font-mono text-white">₹{selectedQuote.eps}</p>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Market Cap</span>
                  <p className="text-sm font-bold font-mono text-slate-200">
                    {selectedQuote.exchange === 'NASDAQ' ? `$${(selectedQuote.marketCapCr / 1000).toFixed(1)}B` : `₹${selectedQuote.marketCapCr.toLocaleString()} Cr`}
                  </p>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">52W High</span>
                  <p className="text-sm font-bold font-mono text-emerald-400">₹{selectedQuote.fiftyTwoWeekHigh.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">52W Low</span>
                  <p className="text-sm font-bold font-mono text-rose-400">₹{selectedQuote.fiftyTwoWeekLow.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Search & Category Filter Bar */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Filter stock by name, symbol, or sector (e.g. TCS, RELIANCE, NVDA, Banking, IT)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111726] text-xs text-white placeholder-slate-500 pl-10 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500/60 font-mono transition-colors"
                />
              </div>

              {/* Category tabs */}
              <div className="flex items-center gap-1 bg-[#111726] p-1 rounded-xl border border-slate-800 overflow-x-auto scrollbar-none">
                {[
                  { id: 'ALL', label: 'All Shares' },
                  { id: 'NSE', label: 'NSE Equities' },
                  { id: 'NASDAQ', label: 'US Tech' },
                  { id: 'GAINERS', label: 'Top Gainers' },
                  { id: 'LOSERS', label: 'Top Losers' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id as any)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                      activeCategory === tab.id
                        ? 'bg-slate-800 text-emerald-400 font-bold border border-slate-700 shadow'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Stocks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredQuotes.map(stock => {
                const isSelected = stock.symbol.toUpperCase() === selectedSymbol.toUpperCase();
                const isUp = stock.change >= 0;

                return (
                  <div
                    key={stock.symbol}
                    onClick={() => handleSelectStock(stock)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected 
                        ? 'bg-emerald-950/30 border-emerald-500/60 shadow-lg shadow-emerald-950/40' 
                        : 'bg-[#111726] border-slate-800/90 hover:border-slate-700 hover:bg-[#151c2e]'
                    }`}
                  >
                    {/* Live tick badge flash indicator */}
                    {stock.tickStatus === 'up' && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    )}
                    {stock.tickStatus === 'down' && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
                    )}

                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-mono font-extrabold text-sm text-white tracking-wide group-hover:text-emerald-400 transition-colors">
                          {stock.symbol}
                        </span>
                        <p className="text-[11px] text-slate-400 truncate max-w-[150px]">{stock.name}</p>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                        {stock.exchange}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mt-3">
                      <div>
                        <span className="text-base font-extrabold font-mono text-white">
                          {stock.exchange === 'NASDAQ' ? '$' : '₹'}
                          {stock.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className={`flex items-center text-xs font-bold font-mono px-2 py-0.5 rounded ${
                        isUp ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30' : 'bg-rose-950/80 text-rose-400 border border-rose-500/30'
                      }`}>
                        {isUp ? <TrendingUp className="w-3 h-3 mr-0.5 inline" /> : <TrendingDown className="w-3 h-3 mr-0.5 inline" />}
                        {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    {/* 52-Week Range Bar */}
                    <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px]">
                      <div className="flex justify-between text-slate-400 mb-1 font-mono">
                        <span>Low: ₹{stock.fiftyTwoWeekLow}</span>
                        <span>High: ₹{stock.fiftyTwoWeekHigh}</span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full"
                          style={{
                            width: `${Math.min(100, Math.max(0, ((stock.price - stock.fiftyTwoWeekLow) / (stock.fiftyTwoWeekHigh - stock.fiftyTwoWeekLow)) * 100))}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
