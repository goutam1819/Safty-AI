import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, BarChart3, Users } from 'lucide-react';

export default function KPICards({ data }) {
  const kpis = data || {
    totalWorkers: 125,
    safeWorkers: 102,
    safePercentage: 82,
    unsafeWorkers: 23,
    unsafePercentage: 18,
    safetyCompliance: 82
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {/* 1. TOTAL WORKERS */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex items-center justify-between transition-transform hover:-translate-y-0.5 duration-200">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
              Total Workers
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {kpis.totalWorkers}
            </div>
            <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
              <span>↑ 2 today</span>
            </div>
          </div>
        </div>
        <div className="p-2 rounded-xl bg-slate-100 text-slate-400">
          <Users className="w-5 h-5" />
        </div>
      </div>

      {/* 2. SAFE WORKERS */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex items-center justify-between transition-transform hover:-translate-y-0.5 duration-200">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
              Safe Workers
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {kpis.safeWorkers}
            </div>
            <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>82%</span>
            </div>
          </div>
        </div>
        {/* Circular Progress Ring */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-100"
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
        </div>
      </div>

      {/* 3. UNSAFE WORKERS */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex items-center justify-between transition-transform hover:-translate-y-0.5 duration-200">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-red-500/15 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
              Unsafe Workers
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {kpis.unsafeWorkers}
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">
              18%
            </div>
          </div>
        </div>
        {/* Red Circular Progress Ring */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-100"
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
          <span className="absolute text-[10px] font-bold text-red-600">18%</span>
        </div>
      </div>

      {/* 4. SAFETY COMPLIANCE */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex items-center justify-between transition-transform hover:-translate-y-0.5 duration-200">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-600 flex items-center justify-center shrink-0">
            <BarChart3 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
              Safety Compliance
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {kpis.safetyCompliance}%
            </div>
            <div className="w-24 bg-slate-100 rounded-full h-2 mt-1.5 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${kpis.safetyCompliance}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
