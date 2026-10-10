import React from 'react';
import { HardHat, ShieldCheck, Flame, BellRing, Sparkles } from 'lucide-react';

export default function HeroBanner() {
  const capabilityTags = [
    { label: "Helmet Detection", icon: HardHat, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
    { label: "PPE Compliance", icon: ShieldCheck, color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
    { label: "Smoke & Fire Detection", icon: Flame, color: "text-red-400 bg-red-500/10 border-red-500/30" },
    { label: "Real-time Alerts", icon: BellRing, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  ];

  return (
    <div className="relative rounded-2xl bg-gradient-to-r from-[#0b152d] via-[#0d1c3d] to-[#0a142c] border border-[#162a56] overflow-hidden mb-5 p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Background Decorative Tech Elements */}
      <div className="absolute top-0 right-0 w-96 h-full bg-blue-600/5 blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-cyan-500/5 blur-3xl pointer-events-none" />

      {/* Left Text Content */}
      <div className="z-10 max-w-xl">
        <div className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Welcome to</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          Industrial Safety <span className="text-blue-500">AI</span>
        </h1>
        <h2 className="text-base sm:text-lg font-semibold text-[#38bdf8] mt-1 tracking-wide">
          Real-Time Safety Monitoring & Hazard Detection
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 font-normal leading-relaxed">
          Detecting violations. Preventing accidents. Building safer workplaces.
        </p>

        {/* BPUT Hackathon Badge */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
            BPUT Hackathon 2026 Core Project
          </span>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
            DETECT → UNDERSTAND → ALERT → ACT
          </span>
        </div>
      </div>

      {/* Right Visual Container with Worker + HUD Image & Capability Chips */}
      <div className="z-10 flex items-center gap-5 w-full md:w-auto justify-end">
        {/* Capability Tags List */}
        <div className="hidden lg:flex flex-col gap-2 shrink-0">
          {capabilityTags.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <div
                key={i}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs font-medium backdrop-blur-md shadow-sm transition-all hover:scale-105 ${cap.color}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cap.label}</span>
              </div>
            );
          })}
        </div>

        {/* Worker Graphic with Holographic HUD Frame */}
        <div className="relative w-72 h-44 sm:w-80 sm:h-48 rounded-2xl overflow-hidden border border-[#1e3c75] shadow-2xl shrink-0 group">
          <img
            src="/assets/hero_worker.jpg"
            alt="Industrial Safety Worker"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#091329] via-transparent to-transparent opacity-80" />
          
          {/* Subtle AI HUD Target Overlay */}
          <div className="absolute top-3 left-3 p-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-cyan-400/30 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>AI SCAN ACTIVE</span>
          </div>

          <div className="absolute bottom-2.5 right-3 text-right">
            <div className="text-[10px] font-mono text-slate-300">CONFIDENCE</div>
            <div className="text-xs font-black text-emerald-400">98.4% PPE MATCH</div>
          </div>
        </div>
      </div>
    </div>
  );
}
