import React from 'react';
import { AlertCircle, CheckCircle2, ChevronRight, Flame } from 'lucide-react';
import WorkerAvatar from './WorkerAvatar';

export default function RecentDetections({ detections = [], onViewAll }) {
  return (
    <div className="rounded-2xl bg-[#091226] border border-[#162a56] p-4 flex flex-col justify-between shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#142345]">
        <div className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
          <span>Recent Detections</span>
        </div>
        <button
          onClick={onViewAll}
          className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-0.5 transition-colors"
        >
          <span>View All</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Detections List */}
      <div className="divide-y divide-[#132247] mt-1 space-y-1">
        {detections.map((item) => {
          const isHazard = item.type === 'hazard';
          const isViolation = item.type === 'violation';
          const isSafe = item.type === 'safe';

          return (
            <div key={item.id} className="pt-2 pb-1.5 flex items-center justify-between group hover:bg-[#0c1938]/40 px-1.5 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                {/* Thumbnail */}
                {isHazard ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-red-500/40 shrink-0 relative">
                    <img src="/assets/smoke_hazard.jpg" alt="Hazard" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-red-900/30" />
                  </div>
                ) : (
                  <WorkerAvatar name={item.worker} violation={isViolation} size="md" />
                )}

                <div>
                  <div className="flex items-center gap-1.5">
                    {isHazard ? (
                      <span className="p-0.5 rounded bg-red-500/20 text-red-400">
                        <Flame className="w-3 h-3" />
                      </span>
                    ) : isViolation ? (
                      <span className="p-0.5 rounded bg-red-500/20 text-red-400">
                        <AlertCircle className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="p-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                      </span>
                    )}

                    <span className={`text-xs font-bold ${isSafe ? 'text-emerald-400' : isHazard ? 'text-red-400' : 'text-slate-100'}`}>
                      {item.title}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {item.worker}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {item.zone}
                  </div>
                </div>
              </div>

              {/* Timestamp */}
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 font-mono">
                  {item.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
