import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Camera, 
  Cpu, 
  Bell, 
  Network, 
  ShieldCheck, 
  Save, 
  Check, 
  Edit3 
} from 'lucide-react';

export default function SettingsPage() {
  const [activeNav, setActiveNav] = useState('General');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // AI Detection Toggles
  const [aiToggles, setAiToggles] = useState({
    helmet: true,
    vest: true,
    shoes: true,
    gloves: true,
    goggles: true,
    smokeFire: true,
  });

  // Notification Toggles
  const [notifyToggles, setNotifyToggles] = useState({
    email: true,
    push: true,
    sms: false,
  });

  const toggleAi = (key) => {
    setAiToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleNotify = (key) => {
    setNotifyToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const settingsNav = [
    { id: 'General', label: 'General', icon: Building2 },
    { id: 'Users & Roles', label: 'Users & Roles', icon: Users },
    { id: 'Camera Settings', label: 'Camera Settings', icon: Camera },
    { id: 'AI Detection', label: 'AI Detection', icon: Cpu },
    { id: 'Notifications', label: 'Notifications', icon: Bell },
    { id: 'Integrations', label: 'Integrations', icon: Network },
    { id: 'Security', label: 'Security', icon: ShieldCheck },
  ];

  return (
    <div className="p-6 space-y-5 max-w-[1700px] mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#142345]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Settings</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage system configuration, users and preferences
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saveSuccess ? 'Changes Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Sub-nav */}
        <div className="lg:col-span-3 rounded-2xl bg-[#091226] border border-[#162a56] p-3 shadow-xl h-fit space-y-1">
          {settingsNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-400 hover:text-white hover:bg-[#0d1a38]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Settings Cards (Exact match to Reference 2) */}
        <div className="lg:col-span-9 space-y-5">
          {/* Top Row: Organization Details & System Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Organization Details */}
            <div className="rounded-2xl bg-[#091226] border border-[#162a56] p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#142345]">
                  <h3 className="text-xs font-bold text-white tracking-wide">
                    Organization Details
                  </h3>
                  <button className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold">
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                </div>
                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Organization Name</span>
                    <span className="text-white font-bold">ABC Manufacturing Pvt. Ltd.</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Location</span>
                    <span className="text-white">Bhubaneswar, Odisha</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Contact Email</span>
                    <span className="text-blue-400 font-mono">admin@abc.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Preferences */}
            <div className="rounded-2xl bg-[#091226] border border-[#162a56] p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#142345]">
                  <h3 className="text-xs font-bold text-white tracking-wide">
                    System Preferences
                  </h3>
                  <button className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold">
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                </div>
                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Language</span>
                    <span className="text-white font-semibold">English (Default)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Timezone</span>
                    <span className="text-white font-mono">(GMT+05:30) Asia/Kolkata</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Date Format</span>
                    <span className="text-white font-mono">DD/MM/YYYY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: AI Detection Settings & Notification Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* AI Detection Settings */}
            <div className="rounded-2xl bg-[#091226] border border-[#162a56] p-5 shadow-xl">
              <div className="pb-3 border-b border-[#142345] mb-3">
                <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <span>AI Detection Settings</span>
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { key: 'helmet', label: 'Helmet Detection' },
                  { key: 'vest', label: 'Vest Detection' },
                  { key: 'shoes', label: 'Safety Shoes Detection' },
                  { key: 'gloves', label: 'Gloves Detection' },
                  { key: 'goggles', label: 'Goggles Detection' },
                  { key: 'smokeFire', label: 'Smoke & Fire Detection' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <span className="text-slate-300 font-medium">{item.label}</span>
                    <button
                      type="button"
                      onClick={() => toggleAi(item.key)}
                      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        aiToggles[item.key] ? 'bg-blue-600' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          aiToggles[item.key] ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Settings */}
            <div className="rounded-2xl bg-[#091226] border border-[#162a56] p-5 shadow-xl">
              <div className="pb-3 border-b border-[#142345] mb-3">
                <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-400" />
                  <span>Notification Settings</span>
                </h3>
              </div>

              <div className="space-y-3.5 text-xs">
                {[
                  { key: 'email', label: 'Email Alerts' },
                  { key: 'push', label: 'Push Notifications' },
                  { key: 'sms', label: 'SMS Alerts' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <span className="text-slate-300 font-medium">{item.label}</span>
                    <button
                      type="button"
                      onClick={() => toggleNotify(item.key)}
                      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        notifyToggles[item.key] ? 'bg-blue-600' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          notifyToggles[item.key] ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-3 rounded-xl bg-[#0c1836] border border-[#1b3466] text-[11px] text-slate-400">
                Critical severity events trigger instant multi-channel broadcast across SMS, Push, and Sirens.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
