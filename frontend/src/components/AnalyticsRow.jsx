import React from 'react';
import { 
  Users, 
  PieChart as PieIcon, 
  Clock, 
  ChevronRight, 
  Activity,
  ArrowUpRight 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  COMPLIANCE_TREND_DATA, 
  VIOLATION_STATS_DATA, 
  RECENT_ACTIVITIES 
} from '../data/mockData';

export default function AnalyticsRow({ onViewAllActivity }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-5">
      {/* 1. SAFETY COMPLIANCE OVERVIEW */}
      <div className="rounded-2xl bg-[#091226] border border-[#162a56] p-4 flex flex-col justify-between shadow-xl">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-[#142345]">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Safety Compliance Overview</span>
            </div>
            <select className="bg-[#0e1e42] border border-[#1d3870] text-slate-300 text-[10px] rounded px-1.5 py-0.5 focus:outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">82%</span>
            <span className="text-xs text-slate-400">Overall Compliance</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              ↑ 6%
            </span>
          </div>
        </div>

        {/* Area Line Chart */}
        <div className="h-28 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={COMPLIANCE_TREND_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="complianceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1d63ff" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#1d63ff" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0d1a38', borderColor: '#1e3c75', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                itemStyle={{ color: '#38bdf8' }}
              />
              <Area 
                type="monotone" 
                dataKey="compliance" 
                stroke="#38bdf8" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#complianceGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. VIOLATION STATISTICS */}
      <div className="rounded-2xl bg-[#091226] border border-[#162a56] p-4 flex flex-col justify-between shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-[#142345]">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <PieIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>Violation Statistics</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Donut Chart */}
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={VIOLATION_STATS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={32}
                  outerRadius={48}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {VIOLATION_STATS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-base font-black text-white leading-tight">23</span>
              <span className="text-[8px] font-medium text-slate-400 leading-tight">Total</span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-1 text-[11px] pr-1">
            {VIOLATION_STATS_DATA.map((item) => (
              <div key={item.name} className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="text-slate-400 font-mono text-[10px]">{item.value} ({item.percentage})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. WORKER SAFETY STATUS */}
      <div className="rounded-2xl bg-[#091226] border border-[#162a56] p-4 flex flex-col justify-between shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-[#142345]">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>Worker Safety Status</span>
          </div>
        </div>

        {/* Dual Gauges */}
        <div className="flex items-center justify-around my-2">
          {/* Safe Ring */}
          <div className="relative w-20 h-20 flex flex-col items-center justify-center">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#132247]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500"
                strokeDasharray="82, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-emerald-400">82%</span>
              <span className="text-[8px] text-slate-400">Safe</span>
            </div>
          </div>

          {/* Unsafe Ring */}
          <div className="relative w-20 h-20 flex flex-col items-center justify-center">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#132247]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-red-500"
                strokeDasharray="18, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-red-400">18%</span>
              <span className="text-[8px] text-slate-400">Unsafe</span>
            </div>
          </div>
        </div>

        {/* Total Workers Footer */}
        <div className="pt-2 border-t border-[#142345] flex items-center justify-center gap-2 text-xs text-slate-400">
          <Users className="w-3.5 h-3.5 text-blue-400" />
          <span>Total Workers: <strong className="text-white font-bold">125</strong></span>
        </div>
      </div>

      {/* 4. RECENT ACTIVITY */}
      <div className="rounded-2xl bg-[#091226] border border-[#162a56] p-4 flex flex-col justify-between shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-[#142345]">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Recent Activity</span>
          </div>
          <button onClick={onViewAllActivity} className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-0.5">
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2 mt-2">
          {RECENT_ACTIVITIES.map((act, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs">
              <span className="text-[10px] font-mono text-slate-400 shrink-0 mt-0.5">{act.time}</span>
              <div>
                <div className="font-semibold text-white leading-tight">{act.text}</div>
                <div className="text-[10px] text-slate-400">{act.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
