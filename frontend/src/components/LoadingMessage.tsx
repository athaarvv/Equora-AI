import React from 'react';
import { Bot, Cpu, Sparkles } from 'lucide-react';

export const LoadingMessage: React.FC = () => {
  return (
    <div className="flex gap-3 my-4 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20 shrink-0">
        <Bot className="w-4 h-4" />
      </div>

      <div className="glass-card rounded-2xl px-4 py-3 border border-slate-700/60 max-w-md">
        <div className="flex items-center gap-2.5 text-xs text-emerald-400 font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-400" />
          <span>Equora AI Orchestration Engine...</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
          <Cpu className="w-3 h-3 text-slate-500 animate-pulse" />
          Routing intent & executing tools (Market Quotes, Python Engine, News)...
        </div>

        <div className="flex items-center gap-1.5 mt-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};
