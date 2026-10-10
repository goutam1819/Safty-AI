import React from 'react';
import { Upload, Video, FileText, Settings, Zap } from 'lucide-react';

export default function QuickActions({ onAction }) {
  const actions = [
    {
      id: 'upload-video',
      label: 'Upload Video',
      icon: Upload,
      bg: 'bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600',
      shadow: 'shadow-blue-600/30',
      action: 'upload-import'
    },
    {
      id: 'live-camera',
      label: 'Live Camera',
      icon: Video,
      bg: 'bg-gradient-to-br from-sky-600 to-cyan-700 hover:from-sky-500 hover:to-cyan-600',
      shadow: 'shadow-cyan-600/30',
      action: 'live-monitoring'
    },
    {
      id: 'generate-report',
      label: 'Generate Report',
      icon: FileText,
      bg: 'bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600',
      shadow: 'shadow-emerald-600/30',
      action: 'reports'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      bg: 'bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600',
      shadow: 'shadow-purple-600/30',
      action: 'settings'
    },
  ];

  return (
    <div className="rounded-2xl bg-[#091226] border border-[#162a56] p-4 flex flex-col justify-between shadow-xl">
      <div className="pb-3 border-b border-[#142345]">
        <div className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          <span>Quick Actions</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mt-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onAction && onAction(act.action)}
              className={`p-3 rounded-xl ${act.bg} text-white font-semibold text-xs flex flex-col items-center justify-center gap-2 shadow-lg ${act.shadow} transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0`}
            >
              <div className="p-2 rounded-lg bg-white/15">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="tracking-wide">{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
