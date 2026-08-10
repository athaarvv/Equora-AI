import React from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Bell, User } from 'lucide-react';

export const TopBar: React.FC = () => {
  const indices = [
    { name: 'NIFTY 50', value: '24,320.15', change: '+85.40 (+0.35%)', isUp: true },
    { name: 'SENSEX', value: '79,705.80', change: '+240.10 (+0.30%)', isUp: true },
    { name: 'BANK NIFTY', value: '50,450.30', change: '-120.50 (-0.24%)', isUp: false },
    { name: 'NASDAQ', value: '17,689.40', change: '+185.60 (+1.06%)', isUp: true }
  ];

  return (
    <header className="h-12 bg-[#0e1424] border-b border-slate-800/80 px-4 flex items-center justify-between text-xs select-none z-10">
      {/* Live Market Ticker */}
      <div className="flex items-center gap-6 overflow-x-auto py-1 scrollbar-none">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Live Markets:
        </div>

        {indices.map((idx, i) => (
          <div key={i} className="flex items-center gap-2 font-mono whitespace-nowrap">
            <span className="font-semibold text-slate-300">{idx.name}</span>
            <span className="text-slate-100 font-bold">{idx.value}</span>
            <span className={`flex items-center text-[11px] font-semibold ${idx.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
              {idx.isUp ? <TrendingUp className="w-3 h-3 mr-0.5 inline" /> : <TrendingDown className="w-3 h-3 mr-0.5 inline" />}
              {idx.change}
            </span>
          </div>
        ))}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <button className="text-slate-400 hover:text-slate-200 p-1.5 rounded-md hover:bg-slate-800 transition-colors" title="Refresh Live Data">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
        <button className="text-slate-400 hover:text-slate-200 p-1.5 rounded-md hover:bg-slate-800 transition-colors relative" title="Notifications">
          <Bell className="w-3.5 h-3.5" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1 right-1"></span>
        </button>
      </div>
    </header>
  );
};
