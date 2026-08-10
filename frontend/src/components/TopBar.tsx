import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Bell, Radio } from 'lucide-react';
import { api } from '../services/api';

interface MarketIndexItem {
  name: string;
  value: string;
  change: string;
  isUp: boolean;
}

export const TopBar: React.FC = () => {
  const [indices, setIndices] = useState<MarketIndexItem[]>([
    { name: 'NIFTY 50', value: '24,320.15', change: '+85.40 (+0.35%)', isUp: true },
    { name: 'SENSEX', value: '79,705.80', change: '+240.10 (+0.30%)', isUp: true },
    { name: 'BANK NIFTY', value: '50,450.30', change: '-120.50 (-0.24%)', isUp: false },
    { name: 'NASDAQ', value: '17,689.40', change: '+185.60 (+1.06%)', isUp: true },
    { name: 'S&P 500', value: '5,540.20', change: '+32.10 (+0.58%)', isUp: true }
  ]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchIndices = async () => {
    try {
      setIsRefreshing(true);
      const data = await api.getMarketIndices();
      if (Array.isArray(data) && data.length > 0) {
        setIndices(data.map((item: any) => ({
          name: item.name,
          value: item.value,
          change: item.change,
          isUp: item.status === 'up' || !item.change.startsWith('-')
        })));
      }
    } catch (err) {
      console.warn('Live indices fetch warning:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  useEffect(() => {
    fetchIndices();
    const interval = setInterval(fetchIndices, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-12 bg-[#0e1424] border-b border-slate-800/80 px-4 flex items-center justify-between text-xs select-none z-10">
      {/* Live Market Ticker */}
      <div className="flex items-center gap-6 overflow-x-auto py-1 scrollbar-none">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-500/30">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-[10px]">Live Ticker</span>
        </div>

        {indices.map((idx, i) => (
          <div key={i} className="flex items-center gap-2 font-mono whitespace-nowrap bg-slate-900/40 px-2.5 py-1 rounded border border-slate-800/60">
            <span className="font-semibold text-slate-300 text-[11px]">{idx.name}</span>
            <span className="text-slate-100 font-bold text-[11px]">{idx.value}</span>
            <span className={`flex items-center text-[10px] font-semibold ${idx.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
              {idx.isUp ? <TrendingUp className="w-3 h-3 mr-0.5 inline" /> : <TrendingDown className="w-3 h-3 mr-0.5 inline" />}
              {idx.change}
            </span>
          </div>
        ))}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <button 
          onClick={fetchIndices}
          className={`text-slate-400 hover:text-slate-200 p-1.5 rounded-md hover:bg-slate-800 transition-colors ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} 
          title="Refresh Live Data"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
        <button className="text-slate-400 hover:text-slate-200 p-1.5 rounded-md hover:bg-slate-800 transition-colors relative" title="Notifications">
          <Bell className="w-3.5 h-3.5" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1 right-1 animate-ping"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1 right-1"></span>
        </button>
      </div>
    </header>
  );
};
