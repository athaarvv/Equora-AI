import React, { useState, useRef } from 'react';
import { Send, Paperclip, Sparkles } from 'lucide-react';
import { VoiceButton } from './VoiceButton';
import { useVoice } from '../hooks/useVoice';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isListening, startListening } = useVoice();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleVoiceInput = () => {
    startListening((speechText) => {
      setText(speechText);
      onSendMessage(speechText);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendMessage(`Analyze annual report document: ${file.name}`);
    }
  };

  return (
    <div className="p-4 bg-[#0d1322] border-t border-slate-800 select-none">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".pdf,.docx,.txt" 
        className="hidden" 
      />

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative glass-card rounded-2xl p-2 border border-slate-700/80 focus-within:border-emerald-500/80 transition-colors shadow-2xl">
          <textarea
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask anything about stocks, markets, P/E ratios, TCS fall, technicals, or upload annual report..."
            className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 p-2 focus:outline-none resize-none font-sans"
          />

          <div className="flex items-center justify-between px-2 pt-1 border-t border-slate-800/60">
            {/* File & Attachment Trigger */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-[#182033] rounded-xl transition-colors text-xs flex items-center gap-1 font-medium"
                title="Upload Annual Report / PDF for RAG analysis"
              >
                <Paperclip className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px]">Upload Report</span>
              </button>

              <VoiceButton isListening={isListening} onClick={handleVoiceInput} />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!text.trim() || isLoading}
              className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                text.trim() && !isLoading
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20 active:scale-[0.98]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Ask Equora</span>
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-2 font-medium">
          Equora AI provides evidence-first market intelligence with verified data sources.
        </p>
      </form>
    </div>
  );
};
