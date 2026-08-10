import React from 'react';
import { TrendingUp, TrendingDown, Building2, BarChart2 } from 'lucide-react';
import { StockQuote } from '../types';

interface StockCardProps {
  quote: StockQuote;
}

export const StockCard: React.FC<StockCardProps> = ({ quote }) => {
  const isPositive = quote.change >= 0;

  return (
    <div className="glass-card rounded-xl p-4 my-3 border border-slate-700/60 shadow-lg hover:border-slate-600 transition-colors max-w-md">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-white tracking-wide">{quote.symbol}</span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {quote.exchange}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium truncate max-w-[220px]">{quote.name}</p>
        </div>

        <div className="text-right font-mono">
          <div className="text-lg font-bold text-white">₹{quote.price.toLocaleString()}</div>
          <div className={`text-xs font-semibold flex items-center justify-end ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
            {isPositive ? '+' : ''}{quote.change} ({quote.changePercent}%)
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-xs font-mono">
        <div className="bg-[#111726]/60 p-2 rounded-lg border border-slate-800/80">
          <div className="text-[10px] text-slate-400 uppercase font-sans">Market Cap</div>
          <div className="font-semibold text-slate-200 text-xs">₹{quote.marketCapCr.toLocaleString()} Cr</div>
        </div>

        <div className="bg-[#111726]/60 p-2 rounded-lg border border-slate-800/80">
          <div className="text-[10px] text-slate-400 uppercase font-sans">P/E Ratio</div>
          <div className="font-semibold text-emerald-400 text-xs">{quote.peRatio}</div>
        </div>

        <div className="bg-[#111726]/60 p-2 rounded-lg border border-slate-800/80">
          <div className="text-[10px] text-slate-400 uppercase font-sans">EPS</div>
          <div className="font-semibold text-slate-200 text-xs">₹{quote.eps}</div>
        </div>
      </div>

      {/* 52 Week Bar */}
      <div className="mt-3 text-[11px] font-mono text-slate-400">
        <div className="flex justify-between mb-1 text-[10px] font-sans">
          <span>52W Low: ₹{quote.fiftyTwoWeekLow}</span>
          <span>52W High: ₹{quote.fiftyTwoWeekHigh}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
            style={{
              width: `${Math.min(100, Math.max(10, ((quote.price - quote.fiftyTwoWeekLow) / (quote.fiftyTwoWeekHigh - quote.fiftyTwoWeekLow)) * 100))}%`
            }}
          />
        </div>
      </div>
    </div>
  );
};
