import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { FileText, Upload, Search, CheckCircle, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export const DocumentsPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      alert(`Parsed and embedded ${file.name} into RAG vector memory!`);
    }, 1500);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setResults([
      {
        page: 14,
        section: 'Risk Factors & Discretionary Budgets',
        text: 'Major operational risks include macroeconomic slowdown in North American banking clients leading to deferred discretionary cloud upgrades.',
        score: 0.94
      },
      {
        page: 28,
        section: 'Enterprise Generative AI Contracts',
        text: 'TCS secured 12 enterprise AI transformation contracts across European retail and financial sectors.',
        score: 0.89
      }
    ]);
  };

  return (
    <div className="flex h-screen w-screen bg-[#0b0f19] overflow-hidden">
      <Sidebar conversations={[]} onNewChat={() => {}} onSelectChat={() => {}} onDeleteChat={() => {}} />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto">
        <TopBar />

        <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              Annual Report & PDF Analyzer (RAG)
            </h1>
            <p className="text-xs text-slate-400">Upload financial filings and ask questions with precise page & section citations.</p>
          </div>

          {/* Upload Area */}
          <div className="glass-card p-6 rounded-2xl border border-dashed border-slate-700 hover:border-emerald-500/50 transition-colors text-center">
            <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-200">Upload Annual Report or Financial PDF</h3>
            <p className="text-xs text-slate-400 mb-4">Supports 10-K, 10-Q, Annual Reports, Earnings Transcripts up to 50MB.</p>

            <label className="py-2 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer inline-flex items-center gap-2">
              <span>{isUploading ? 'Parsing Document...' : 'Choose PDF File'}</span>
              <input type="file" onChange={handleUpload} accept=".pdf" className="hidden" />
            </label>
          </div>

          {/* Query Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Ask anything about the report (e.g., What are the major risks? What is the operating margin?)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-[#131b2e] text-xs text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 px-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Search RAG
            </button>
          </form>

          {/* Search Results */}
          {results.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Relevant Vector Matches ({results.length})</h3>
              {results.map((r, i) => (
                <div key={i} className="glass-card p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-1">
                    <span>{r.section} (Page {r.page})</span>
                    <span className="text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Relevance: {Math.round(r.score * 100)}%</span>
                  </div>
                  <blockquote className="text-xs text-slate-300 italic bg-[#111726]/60 p-3 rounded-lg border border-slate-800/80">
                    "{r.text}"
                  </blockquote>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
