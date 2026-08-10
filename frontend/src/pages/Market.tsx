import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { StockCard } from '../components/StockCard';
import { StockQuote } from '../types';
import { api } from '../services/api';
import { Search, TrendingUp, BarChart2 } from 'lucide-react';

export const MarketPage: React.FC = () => {
  const [symbol, setSymbol] = useState('TCS');
  const [quote, setQuote] = useState<StockQuote | null>({
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
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim()) return;
    try {
      const data = await api.getQuote(symbol.trim());
      setQuote(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#0b0f19] overflow-hidden">
      <Sidebar conversations={[]} onNewChat={() => {}} onSelectChat={() => {}} onDeleteChat={() => {}} />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto">
        <TopBar />

        <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Market & Stock Explorer
            </h1>
            <p className="text-xs text-slate-400">Search equities, retrieve metrics, and analyze valuation fundamentals.</p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Enter stock ticker (e.g. TCS, RELIANCE, INFY, NVDA)..."
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full bg-[#131b2e] text-xs text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 px-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Search Quote
            </button>
          </form>

          {/* Quote Card */}
          {quote && (
            <div className="space-y-4">
              <StockCard quote={quote} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-xl border border-slate-800">
                  <h3 className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                    <BarChart2 className="w-4 h-4 text-emerald-400" />
                    Valuation Summary
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {quote.symbol} is trading at a Price-to-Earnings (P/E) ratio of <span className="text-emerald-400 font-bold font-mono">{quote.peRatio}</span> against earnings per share of <span className="text-slate-100 font-semibold font-mono">₹{quote.eps}</span>. 
                  </p>
                </div>

                <div className="glass-card p-4 rounded-xl border border-slate-800">
                  <h3 className="text-xs font-bold text-slate-200 mb-2">Key Highlights</h3>
                  <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                    <li>Exchange: {quote.exchange} ({quote.sector})</li>
                    <li>24h Volume: {quote.volume.toLocaleString()} shares</li>
                    <li>Market Cap: ₹{quote.marketCapCr.toLocaleString()} Cr</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
