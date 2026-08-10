import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { Settings, Key, Database, Cpu, CheckCircle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [geminiKey, setGeminiKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex h-screen w-screen bg-[#0b0f19] overflow-hidden">
      <Sidebar conversations={[]} onNewChat={() => {}} onSelectChat={() => {}} onDeleteChat={() => {}} />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto">
        <TopBar />

        <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-400" />
              Equora AI System Settings & API Configuration
            </h1>
            <p className="text-xs text-slate-400">Configure Gemini LLM API keys, analytics microservice endpoints, and model flags.</p>
          </div>

          <form onSubmit={handleSave} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-200 block mb-1.5 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-emerald-400" />
                Gemini API Key
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full bg-[#111726] text-xs text-white placeholder-slate-500 p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Your key is used for LLM intent routing and tool calling reasoning.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="py-2.5 px-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
              >
                {saved && <CheckCircle className="w-4 h-4" />}
                <span>{saved ? 'Settings Saved!' : 'Save System Configuration'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
