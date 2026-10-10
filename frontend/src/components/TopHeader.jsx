import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, CheckCircle2, AlertTriangle, Flame, Shield, User, LogOut, Settings as SettingsIcon } from 'lucide-react';

export default function TopHeader({ onSearch, onNotificationClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState('Apr 10, 2025  10:24 AM');

  useEffect(() => {
    // Keep dynamic realistic clock
    const updateTime = () => {
      const now = new Date();
      const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
      setCurrentTime(now.toLocaleString('en-US', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <header className="h-16 px-6 bg-[#080e1f] border-b border-[#142344] flex items-center justify-between sticky top-0 z-20">
      {/* Search Bar */}
      <div className="relative w-96 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search locations, workers, events..."
          className="w-full pl-10 pr-4 py-2 bg-[#0d1833] border border-[#1d3363] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-6">
        {/* System Online Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-emerald-400 tracking-wide">System Online</span>
        </div>

        {/* Date & Time */}
        <div className="text-xs font-medium text-slate-300">
          {currentTime}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#122245] transition-colors"
            title="AI Alert Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-lg shadow-red-500/50">
              3
            </span>
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-[#0d1a38] border border-[#1e3b75] rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#1b3466]">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-blue-400" />
                  <span>Real-Time Safety Alerts</span>
                </div>
                <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30 font-bold">
                  3 Critical
                </span>
              </div>
              <div className="divide-y divide-[#15274d] text-xs">
                <div className="py-2.5 flex gap-2.5 items-start">
                  <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400 shrink-0">
                    <Flame className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Fire/Smoke Detected</div>
                    <div className="text-[11px] text-slate-400">Zone B — Paint Booth</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">10:18 AM • Conf 94%</div>
                  </div>
                </div>
                <div className="py-2.5 flex gap-2.5 items-start">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Helmet Missing</div>
                    <div className="text-[11px] text-slate-400">Worker 12 — Zone A</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">10:22 AM • Conf 98%</div>
                  </div>
                </div>
                <div className="py-2.5 flex gap-2.5 items-start">
                  <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 shrink-0">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Safety Vest Violation</div>
                    <div className="text-[11px] text-slate-400">Worker 34 — Zone C</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">10:15 AM • Conf 96%</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-[#122245] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white ring-2 ring-blue-500/30">
              A
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-white leading-tight">Admin</div>
              <div className="text-[10px] text-slate-400">Safety Officer</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-48 bg-[#0d1a38] border border-[#1e3b75] rounded-xl shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-[#1b3466]">
                <div className="text-xs font-semibold text-white">Safety Commander</div>
                <div className="text-[10px] text-slate-400">admin@industrialsafety.ai</div>
              </div>
              <div className="py-1 text-xs text-slate-300">
                <button className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#152a55] rounded-lg text-left">
                  <User className="w-3.5 h-3.5 text-blue-400" /> Profile Details
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#152a55] rounded-lg text-left">
                  <SettingsIcon className="w-3.5 h-3.5 text-blue-400" /> Preferences
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-1.5 text-red-400 hover:bg-red-500/10 rounded-lg text-left">
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
