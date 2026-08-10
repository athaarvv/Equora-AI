import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { Star, TrendingUp, TrendingDown, Plus, Trash2 } from 'lucide-react';

export const WatchlistPage: React.FC = () => {
  const [watchlist, setWatchlist] = useState([
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3421.50, change: '-45.20 (-1.30%)', isUp: false },
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2890.10, change: '+32.50 (+1.14%)', isUp: true },
    { symbol: 'INFY', name: 'Infosys Limited', price: 1540.75, change: '-12.30 (-0.79%)', isUp: false },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 124.50, change: '+4.20 (+3.49%)', isUp: true }
  ]);

  return (
    <div className="flex h-screen w-screen bg-[#0b0f19] overflow-hidden">
      <Sidebar conversations={[]} onNewChat={() => {}} onSelectChat={() => {}} onDeleteChat={() => {}} />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto">
        <TopBar />

        <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              Stock Watchlist & Price Monitor
            </h1>
            <p className="text-xs text-slate-400">Track real-time prices, daily change alerts, and corporate updates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {watchlist.map((item) => (
              <div key={item.symbol} className="glass-card p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{item.symbol}</span>
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  </div>
                  <div className="text-xs text-slate-400">{item.name}</div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-sm font-bold text-white">₹{item.price}</div>
                  <div className={`text-xs font-semibold ${item.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {item.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
