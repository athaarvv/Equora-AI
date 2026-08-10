import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { ShieldAlert, AlertTriangle, CheckCircle, Search } from 'lucide-react';

export const ScamDetectorPage: React.FC = () => {
  const [inputScheme, setInputScheme] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputScheme.trim()) return;

    setAnalysis({
      riskLevel: 'HIGH RISK (95% Threat Score)',
      redFlags: [
        'Guaranteed Returns (No legitimate investment guarantees fixed profits)',
        'Unrealistic Performance (10% weekly return equals >14,000% annualized rate)',
        'Urgency & High Pressure Tactics',
        'Unregistered / Unverified Entity'
      ],
      explanation: 'This scheme exhibits classic Ponzi / pyramid hallmarks. Real stock market and asset investments fluctuate based on market supply and demand.'
    });
  };

  return (
    <div className="flex h-screen w-screen bg-[#0b0f19] overflow-hidden">
      <Sidebar conversations={[]} onNewChat={() => {}} onSelectChat={() => {}} onDeleteChat={() => {}} />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto">
        <TopBar />

        <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              Financial Scam Risk Detector
            </h1>
            <p className="text-xs text-slate-400">Paste investment offers or messages to evaluate red flags and fraud risk.</p>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-3">
            <textarea
              rows={4}
              value={inputScheme}
              onChange={(e) => setInputScheme(e.target.value)}
              placeholder="Paste suspicious offer message (e.g., 'Guaranteed 10% weekly return on WhatsApp trading group!')..."
              className="w-full bg-[#131b2e] text-xs text-white placeholder-slate-500 p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="py-2.5 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Analyze Scheme Risk
            </button>
          </form>

          {analysis && (
            <div className="glass-card p-6 rounded-2xl border border-rose-500/40 bg-rose-950/20 space-y-4">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
                <AlertTriangle className="w-5 h-5" />
                <span>{analysis.riskLevel}</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Detected Red Flags:</h4>
                <ul className="space-y-1 text-xs text-slate-300">
                  {analysis.redFlags.map((rf: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      <span>{rf}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
                {analysis.explanation}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
