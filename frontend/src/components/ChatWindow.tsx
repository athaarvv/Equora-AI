import React, { useRef, useEffect } from 'react';
import { Sparkles, TrendingUp, HelpCircle, FileText, Calculator, Zap } from 'lucide-react';
import { Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { LoadingMessage } from './LoadingMessage';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onSendMessage }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickPrompts = [
    {
      icon: <HelpCircle className="w-4 h-4 text-emerald-400" />,
      title: "Simple Concept",
      prompt: "What is P/E Ratio?"
    },
    {
      icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
      title: "Real-time Quote",
      prompt: "What is TCS's P/E?"
    },
    {
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      title: "News & Reasoning",
      prompt: "Why did TCS fall today?"
    },
    {
      icon: <Calculator className="w-4 h-4 text-emerald-400" />,
      title: "Python Calculation",
      prompt: "Calculate return on ₹50,000 to ₹85,000 over 3 years."
    },
    {
      icon: <FileText className="w-4 h-4 text-emerald-400" />,
      title: "Annual Report RAG",
      prompt: "Analyze annual report: What are the major risks?"
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-12">
          {/* Brand Icon */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-2xl shadow-emerald-500/30 mb-4 animate-pulse">
            <Zap className="w-8 h-8 text-slate-950 fill-current" />
          </div>

          <h2 className="text-2xl font-bold text-white tracking-wide mb-2">
            EQUORA <span className="text-emerald-400">AI</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-lg mb-8 leading-relaxed">
            Conversational market intelligence. Ask any natural-language question about stocks, technicals, news, calculations, or uploaded financial reports.
          </p>

          {/* Quick Start Prompt Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => onSendMessage(qp.prompt)}
                className="glass-card p-3.5 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition-all text-xs group active:scale-[0.98]"
              >
                <div className="flex items-center gap-2 font-semibold text-slate-200 group-hover:text-emerald-400 mb-1">
                  {qp.icon}
                  <span>{qp.title}</span>
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1">{qp.prompt}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && <LoadingMessage />}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};
