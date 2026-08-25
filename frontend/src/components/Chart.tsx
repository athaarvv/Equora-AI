import React from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { ChartPayload } from '../types';
import { LineChart as LineChartIcon } from 'lucide-react';

interface ChartProps {
  payload: ChartPayload;
}

export const Chart: React.FC<ChartProps> = ({ payload }) => {
  if (!payload || !payload.data || payload.data.length === 0) return null;

  return (
    <div className="glass-card rounded-xl p-4 my-3 border border-slate-700/60 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <LineChartIcon className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-200 tracking-wide">{payload.title}</h3>
        </div>
        <span className="text-[10px] font-mono uppercase bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-700 font-semibold">
          {payload.symbol} • Interactive Chart
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={payload.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3654" opacity={0.5} />
            <XAxis 
              dataKey="date" 
              stroke="#64748b" 
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickFormatter={(str: string) => str.length > 5 ? str.substring(5) : str}
            />
            <YAxis 
              domain={['auto', 'auto']}
              stroke="#64748b" 
              tick={{ fontSize: 10, fill: '#94a3b8' }} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#131b2e', 
                borderColor: '#2a3654',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#f8fafc'
              }}
              formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Close Price']}
            />
            <Area 
              type="monotone" 
              dataKey="close" 
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#chartColor)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
