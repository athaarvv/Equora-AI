import React, { useState } from 'react';
import { User, Bot, Volume2, Copy, Check, Sparkles } from 'lucide-react';
import { Message } from '../types';
import { StockCard } from './StockCard';
import { SourceCard } from './SourceCard';
import { Chart } from './Chart';
import { useVoice } from '../hooks/useVoice';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const { speak, isSpeaking, stopSpeaking } = useVoice();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleListen = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(message.content);
    }
  };

  return (
    <div className={`flex gap-3 my-4 ${isUser ? 'flex-row-reverse' : ''} group`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-md ${
        isUser
          ? 'bg-slate-700 text-slate-200 border border-slate-600'
          : 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/20'
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Content Container */}
      <div className={`max-w-3xl space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl p-4 text-sm leading-relaxed ${
          isUser
            ? 'bg-emerald-600/90 text-white rounded-tr-none shadow-md shadow-emerald-900/20 font-medium'
            : 'glass-card text-slate-100 border border-slate-700/60 rounded-tl-none'
        }`}>
          {/* Formatted Markdown Content */}
          <div className="prose prose-invert max-w-none text-xs leading-relaxed whitespace-pre-line">
            {message.content}
          </div>

          {/* Render Stock Cards if attached */}
          {message.stockCards && message.stockCards.map((quote, idx) => (
            <StockCard key={idx} quote={quote} />
          ))}

          {/* Render Interactive Charts if attached */}
          {message.charts && message.charts.map((payload, idx) => (
            <Chart key={idx} payload={payload} />
          ))}

          {/* Render Verified Sources if attached */}
          {message.sources && message.sources.length > 0 && (
            <SourceCard sources={message.sources} />
          )}

          {/* Tool Indicators Badge */}
          {message.toolCalls && message.toolCalls.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-slate-800/80 text-[10px]">
              <span className="text-slate-400 font-sans flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Tools Executed:
              </span>
              {message.toolCalls.map((t, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20 font-semibold">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Message Action Controls (Copy & Listen) */}
        {!isUser && (
          <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleListen}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
                isSpeaking ? 'text-emerald-400 bg-emerald-500/10' : 'hover:text-white hover:bg-slate-800'
              }`}
              title="Listen to Response"
            >
              <Volume2 className="w-3 h-3" />
              <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 rounded-md hover:text-white hover:bg-slate-800 transition-colors"
              title="Copy Text"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
