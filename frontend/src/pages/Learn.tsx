import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { GraduationCap, CheckCircle2, Lock, Award } from 'lucide-react';

export const LearnPage: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState(1);

  const levels = [
    {
      id: 1,
      title: 'Level 1: Stock Basics',
      status: 'UNLOCKED',
      lessons: ['What is a Stock & Equity share?', 'How Stock Exchanges (NSE/BSE) Work', 'Order Types: Market vs Limit Orders']
    },
    {
      id: 2,
      title: 'Level 2: Fundamental Analysis',
      status: 'UNLOCKED',
      lessons: ['Price to Earnings (P/E) Ratio Demystified', 'Balance Sheet & Cash Flow Statement Overview', 'Evaluating Return on Equity (ROE)']
    },
    {
      id: 3,
      title: 'Level 3: Technical Analysis',
      status: 'LOCKED',
      lessons: ['Understanding RSI (Overbought vs Oversold)', 'Moving Averages (SMA 50 vs EMA 200 Crossovers)', 'MACD Momentum Signals']
    },
    {
      id: 4,
      title: 'Level 4: Advanced Trading & Derivatives',
      status: 'LOCKED',
      lessons: ['Options Call vs Put Options Basics', 'Futures Hedging & Leverage Control', 'Risk-to-Reward Ratio Positioning']
    }
  ];

  return (
    <div className="flex h-screen w-screen bg-[#0b0f19] overflow-hidden">
      <Sidebar conversations={[]} onNewChat={() => {}} onSelectChat={() => {}} onDeleteChat={() => {}} />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto">
        <TopBar />

        <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              Equora Learning Mode — Financial Curriculum
            </h1>
            <p className="text-xs text-slate-400">Master stock market concepts step-by-step from zero to advanced trading.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {levels.map((lvl) => (
              <div key={lvl.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{lvl.title}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                    lvl.status === 'UNLOCKED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}>
                    {lvl.status}
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  {lvl.lessons.map((lesson, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{lesson}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
