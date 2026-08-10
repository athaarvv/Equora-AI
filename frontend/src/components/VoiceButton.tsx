import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceButtonProps {
  isListening: boolean;
  onClick: () => void;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({ isListening, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative p-2.5 rounded-xl transition-all ${
        isListening
          ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse'
          : 'bg-[#1e2942] text-slate-300 hover:text-emerald-400 hover:bg-[#253454] border border-slate-700/60'
      }`}
      title={isListening ? 'Listening... Speak now' : 'Voice Input'}
    >
      {isListening ? (
        <MicOff className="w-4 h-4 stroke-[2.5]" />
      ) : (
        <Mic className="w-4 h-4 stroke-[2]" />
      )}
    </button>
  );
};
