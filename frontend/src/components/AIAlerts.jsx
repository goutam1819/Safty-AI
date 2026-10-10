import React from 'react';
import { Flame, AlertTriangle, ShieldAlert, ChevronRight } from 'lucide-react';

export default function AIAlerts({ alerts = [], onViewAll }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Flame':
      case 'flame':
        return <Flame className="w-4 h-4 text-red-400" />;
      case 'AlertTriangle':
      case 'alert-triangle':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'ShieldAlert':
      case 'shield-alert':
      default:
        return <ShieldAlert className="w-4 h-4 text-orange-400" />;
    }
  };

  return (
    <div className="rounded-2xl bg-[#091226] border border-[#162a56] p-4 flex flex-col justify-between shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#142345]">
        <div className="flex items-center gap-2">
          <div className="text-xs font-bold text-white tracking-wide">
            AI Alerts
          </div>
          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-red-500 text-white">
            {alerts.length}
          </span>
        </div>
        <button
          onClick={onViewAll}
          className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition-colors"
        >
          <span>View All</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Alerts Items */}
      <div className="space-y-2 mt-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="p-2.5 rounded-xl bg-[#0c1836] border border-[#1b3466]/70 hover:border-blue-500/50 transition-all flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {getIcon(alert.icon)}
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                  {alert.title}
                </div>
                <div className="text-[11px] text-slate-400">
                  {alert.zone}
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 font-mono">
                {alert.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
