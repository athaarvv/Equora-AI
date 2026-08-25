import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Plus, MessageSquare, TrendingUp, PieChart, Star, 
  FileText, GraduationCap, ShieldAlert, Settings, Trash2, Search, Zap 
} from 'lucide-react';
import { Conversation } from '../types';

interface SidebarProps {
  conversations: Conversation[];
  activeChatId?: string;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = conversations.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-64 h-screen bg-[#111726] border-r border-slate-800 flex flex-col justify-between select-none z-20">
      {/* Top Branding Header */}
      <div>
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Zap className="w-5 h-5 text-slate-950 fill-current" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-wide text-white flex items-center gap-1">
                EQUORA <span className="text-emerald-400 text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 font-semibold">AI</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">Financial Intelligence</p>
            </div>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={onNewChat}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold text-xs rounded-lg shadow-md shadow-emerald-500/15 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            New Chat
          </button>
        </div>

        {/* Search Chats Input */}
        <div className="px-3 mb-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#182033] text-xs text-slate-200 placeholder-slate-500 pl-8 pr-3 py-1.5 rounded-md border border-slate-700/60 focus:outline-none focus:border-emerald-500/60"
            />
          </div>
        </div>

        {/* Main Navigation Links */}
        <nav className="px-2 space-y-1 mb-4">
          <NavLink
            to="/"
            className={({ isActive }: { isActive: boolean }) => 
              `flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                isActive && !activeChatId ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20' : 'text-slate-300 hover:bg-[#182033] hover:text-white'
              }`
            }
          >
            <MessageSquare className="w-4 h-4" />
            Conversational AI
          </NavLink>

          <NavLink
            to="/market"
            className={({ isActive }: { isActive: boolean }) => 
              `flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                isActive ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20' : 'text-slate-300 hover:bg-[#182033] hover:text-white'
              }`
            }
          >
            <TrendingUp className="w-4 h-4" />
            Market & Stocks
          </NavLink>

          <NavLink
            to="/portfolio"
            className={({ isActive }: { isActive: boolean }) => 
              `flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                isActive ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20' : 'text-slate-300 hover:bg-[#182033] hover:text-white'
              }`
            }
          >
            <PieChart className="w-4 h-4" />
            Portfolio Analyzer
          </NavLink>

          <NavLink
            to="/watchlist"
            className={({ isActive }: { isActive: boolean }) => 
              `flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                isActive ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20' : 'text-slate-300 hover:bg-[#182033] hover:text-white'
              }`
            }
          >
            <Star className="w-4 h-4" />
            Watchlist
          </NavLink>

          <NavLink
            to="/documents"
            className={({ isActive }: { isActive: boolean }) => 
              `flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                isActive ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20' : 'text-slate-300 hover:bg-[#182033] hover:text-white'
              }`
            }
          >
            <FileText className="w-4 h-4" />
            Report Analyzer (RAG)
          </NavLink>

          <NavLink
            to="/learn"
            className={({ isActive }: { isActive: boolean }) => 
              `flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                isActive ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20' : 'text-slate-300 hover:bg-[#182033] hover:text-white'
              }`
            }
          >
            <GraduationCap className="w-4 h-4" />
            Learning Mode
          </NavLink>

          <NavLink
            to="/scam-detector"
            className={({ isActive }: { isActive: boolean }) => 
              `flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                isActive ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20' : 'text-slate-300 hover:bg-[#182033] hover:text-white'
              }`
            }
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Scam Risk Detector
          </NavLink>
        </nav>

        {/* Chat History Section */}
        <div className="px-3 py-1">
          <h2 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1">
            Recent Conversations
          </h2>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            {filteredChats.length === 0 ? (
              <p className="text-[11px] text-slate-500 px-2 py-1">No chats found.</p>
            ) : (
              filteredChats.map(c => (
                <div
                  key={c.id}
                  onClick={() => onSelectChat(c.id)}
                  className={`group flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md cursor-pointer transition-colors ${
                    activeChatId === c.id ? 'bg-[#1e2942] text-emerald-400 font-medium' : 'text-slate-300 hover:bg-[#182033]'
                  }`}
                >
                  <span className="truncate pr-2">{c.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(c.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-opacity p-0.5"
                    title="Delete Chat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer / Account */}
      <div className="p-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center font-semibold text-slate-200 text-xs border border-slate-600">
            EQ
          </div>
          <div>
            <div className="font-semibold text-slate-200 text-xs">Investor Account</div>
            <div className="text-[10px] text-emerald-400 font-medium">Pro Financial AI</div>
          </div>
        </div>
        <NavLink to="/settings" className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors">
          <Settings className="w-4 h-4" />
        </NavLink>
      </div>
    </aside>
  );
};
