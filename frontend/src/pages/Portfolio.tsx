import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { PieChart, TrendingUp, DollarSign, Plus, Trash2, Zap } from 'lucide-react';
import { api } from '../services/api';

export const PortfolioPage: React.FC = () => {
  const [portfolio, setPortfolio] = useState<any>({
    summary: { totalInvested: 245000, currentValue: 278900, totalPnL: 33900, totalPnLPercentage: 13.84 },
    holdings: [
      { id: 'h1', symbol: 'TCS', shares: 10, avgPrice: 3200, currentPrice: 3421.50, investedAmount: 32000, currentValue: 34215, pnl: 2215, pnlPercentage: 6.92, sector: 'IT' },
      { id: 'h2', symbol: 'RELIANCE', shares: 15, avgPrice: 2800, currentPrice: 2890.10, investedAmount: 42000, currentValue: 43351, pnl: 1351, pnlPercentage: 3.22, sector: 'Energy' },
      { id: 'h3', symbol: 'INFY', shares: 25, avgPrice: 1420, currentPrice: 1540.75, investedAmount: 35500, currentValue: 38518, pnl: 3018, pnlPercentage: 8.50, sector: 'IT' },
      { id: 'h4', symbol: 'NVDA', shares: 20, avgPrice: 110, currentPrice: 124.50, investedAmount: 135500, currentValue: 162816, pnl: 27316, pnlPercentage: 20.15, sector: 'Semiconductors' }
    ]
  });

  useEffect(() => {
    api.getPortfolio().then(data => {
      if (data && data.summary) setPortfolio(data);
    }).catch(() => {});
  }, []);

  return (
    <div className="flex h-screen w-screen bg-[#0b0f19] overflow-hidden">
      <Sidebar conversations={[]} onNewChat={() => {}} onSelectChat={() => {}} onDeleteChat={() => {}} />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto">
        <TopBar />

        <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-400" />
              Portfolio Analyzer & Scenario Simulator
            </h1>
            <p className="text-xs text-slate-400">Track total value, P&L breakdown, sector exposure, and perform stress testing.</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-xl border border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Total Invested</div>
              <div className="text-xl font-bold font-mono text-white mt-1">₹{portfolio.summary.totalInvested.toLocaleString()}</div>
            </div>

            <div className="glass-card p-4 rounded-xl border border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Current Value</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">₹{portfolio.summary.currentValue.toLocaleString()}</div>
            </div>

            <div className="glass-card p-4 rounded-xl border border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Overall P&L</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +₹{portfolio.summary.totalPnL.toLocaleString()} ({portfolio.summary.totalPnLPercentage}%)
              </div>
            </div>
          </div>

          {/* Holdings Table */}
          <div className="glass-card rounded-xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200">Asset Holdings</h3>
              <button className="py-1 px-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" />
                Add Holding
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#111726] text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Symbol</th>
                    <th className="p-3">Shares</th>
                    <th className="p-3">Avg Price</th>
                    <th className="p-3">Current Price</th>
                    <th className="p-3">Current Value</th>
                    <th className="p-3">P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {portfolio.holdings.map((h: any) => (
                    <tr key={h.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-bold text-white">{h.symbol}</td>
                      <td className="p-3">{h.shares}</td>
                      <td className="p-3">₹{h.avgPrice}</td>
                      <td className="p-3">₹{h.currentPrice}</td>
                      <td className="p-3 font-semibold">₹{h.currentValue.toLocaleString()}</td>
                      <td className={`p-3 font-semibold ${h.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {h.pnl >= 0 ? '+' : ''}₹{h.pnl.toLocaleString()} ({h.pnlPercentage}%)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
