import React from 'react';
import { 
  LayoutDashboard, 
  Video, 
  UploadCloud, 
  AlertTriangle, 
  BarChart3, 
  History, 
  Settings,
  Shield,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live-monitoring', label: 'Live Monitoring', icon: Video },
    { id: 'upload-import', label: 'Upload / Import', icon: UploadCloud },
    { id: 'violations', label: 'Violations', icon: AlertTriangle, badge: '5' },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 min-w-[16rem] bg-[#070d1e] border-r border-[#152342] flex flex-col justify-between h-screen sticky top-0 select-none z-30">
      {/* Brand Logo Header */}
      <div>
        <div className="p-5 flex items-center gap-3 border-b border-[#152342]/60">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Shield className="w-6 h-6 text-white stroke-[2.2]" />
          </div>
          <div>
            <div className="font-bold text-white tracking-wide text-base leading-tight flex items-center gap-1.5">
              <span>Industrial Safety</span>
              <span className="text-blue-500 font-extrabold text-sm px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30">AI</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight mt-0.5">
              AI-Powered Safety Intelligence
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3.5 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#1b64da] text-white shadow-lg shadow-blue-600/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-[#0f1d3d]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && !isActive && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Safety First Brand Card */}
      <div className="p-4 border-t border-[#152342]/60">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#0c1836] to-[#070e24] border border-[#1b3466]/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-white tracking-wide">Safety First</div>
            <div className="text-[10px] text-slate-400">People. Process. AI.</div>
          </div>
        </div>
        <div className="mt-2 text-center text-[10px] text-slate-500">
          BPUT Hackathon 2026 Edition
        </div>
      </div>
    </aside>
  );
}
