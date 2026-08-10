import React from 'react';
import { Newspaper, ExternalLink, Calendar } from 'lucide-react';
import { NewsSource } from '../types';

interface SourceCardProps {
  sources: NewsSource[];
}

export const SourceCard: React.FC<SourceCardProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="my-3 space-y-2">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
        <Newspaper className="w-3.5 h-3.5 text-emerald-400" />
        Verified Sources & Citations ({sources.length})
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {sources.map((src, i) => (
          <a
            key={i}
            href={src.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-3 rounded-lg border border-slate-800 hover:border-emerald-500/40 transition-colors block group"
          >
            <div className="flex items-center justify-between text-[11px] text-emerald-400 font-semibold mb-1">
              <span className="truncate">{src.name}</span>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </div>
            <h4 className="text-xs font-semibold text-slate-200 group-hover:text-white line-clamp-2 mb-1.5">
              {src.title}
            </h4>
            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
              {src.summary}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
              <Calendar className="w-3 h-3" />
              {src.timestamp}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
