import React, { useState } from 'react';
import { Maximize2, ShieldCheck, AlertCircle, Eye, EyeOff, Camera, Flame } from 'lucide-react';

export default function CCTVPlayer({
  camera,
  title = "Live Camera Feed",
  zoneLabel = "Zone A — Assembly Line",
  onSelectZone,
  className = "",
  compact = false
}) {
  const [showBoxes, setShowBoxes] = useState(true);
  const [currentZone, setCurrentZone] = useState("Factory Zone 1");
  const [snapshotTaken, setSnapshotTaken] = useState(false);

  const handleSnapshot = () => {
    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 2000);
  };

  return (
    <div className={`relative rounded-2xl bg-[#091226] border border-[#162a56] overflow-hidden shadow-2xl flex flex-col ${className}`}>
      {/* Feed Header */}
      <div className="px-4 py-2.5 bg-[#0b1733] border-b border-[#162a56] flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-white font-semibold text-xs tracking-wide">
            <div className="p-1 rounded bg-blue-500/20 text-blue-400">
              <Camera className="w-3.5 h-3.5" />
            </div>
            <span>{title}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>LIVE</span>
          </div>
        </div>

        {/* Zone Selector & Action Buttons */}
        <div className="flex items-center gap-2">
          {!compact && (
            <select
              value={currentZone}
              onChange={(e) => setCurrentZone(e.target.value)}
              className="bg-[#0e1e42] border border-[#1d3870] text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="Factory Zone 1">Factory Zone 1</option>
              <option value="Factory Zone 2">Factory Zone 2</option>
              <option value="Warehouse Zone B">Warehouse Zone B</option>
              <option value="Loading Yard C">Loading Yard C</option>
            </select>
          )}

          <button
            onClick={() => setShowBoxes(!showBoxes)}
            className="p-1.5 rounded-lg bg-[#0e1e42] hover:bg-[#162d61] text-slate-300 hover:text-white transition-colors border border-[#1d3870]"
            title={showBoxes ? "Hide AI Bounding Boxes" : "Show AI Bounding Boxes"}
          >
            {showBoxes ? <Eye className="w-3.5 h-3.5 text-blue-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          <button
            onClick={handleSnapshot}
            className="p-1.5 rounded-lg bg-[#0e1e42] hover:bg-[#162d61] text-slate-300 hover:text-white transition-colors border border-[#1d3870]"
            title="Capture AI Evidence Snapshot"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Video Viewport Container */}
      <div className="relative aspect-[16/9] w-full bg-black overflow-hidden group">
        {/* Realistic CCTV Footage Background Image */}
        <img
          src={camera?.imageUrl || "/assets/cctv_factory.jpg"}
          alt="CCTV Feed"
          className="w-full h-full object-cover select-none filter contrast-105 brightness-95"
        />

        {/* Scanline overlay for authentic CCTV feeling */}
        <div className="cctv-scanline" />

        {/* Computer Vision HUD Bounding Boxes Overlay */}
        {/* Computer Vision HUD Bounding Boxes Overlay */}
        {showBoxes && (
          <div className="absolute inset-0 pointer-events-none">
            {(camera?.detections || [
              { id: "d1", label: "Helmet 98%", sub: "Vest 96%", status: "compliant", x: 44.5, y: 61.2, w: 7.5, h: 26 },
              { id: "d2", label: "No Helmet 0%", sub: "VIOLATION", status: "violation", x: 68.6, y: 68.4, w: 8.5, h: 28 },
            ]).map((det) => {
              const isViolation = det.status === 'violation';
              const isHazard = det.status === 'hazard';

              return (
                <div
                  key={det.id}
                  className={`absolute border-2 rounded-sm ${
                    isHazard
                      ? 'border-red-500 shadow-[0_0_14px_rgba(239,68,68,0.8)] animate-pulse'
                      : isViolation
                      ? 'border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.7)] animate-pulse'
                      : 'border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                  }`}
                  style={{
                    left: `${det.x}%`,
                    top: `${det.y}%`,
                    width: `${det.w}%`,
                    height: `${det.h}%`
                  }}
                >
                  <div
                    className={`absolute -top-6 left-0 font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow whitespace-nowrap ${
                      isViolation || isHazard ? 'bg-red-600 text-white' : 'bg-emerald-500 text-slate-950'
                    }`}
                  >
                    {det.label}
                  </div>
                  {det.sub && (
                    <div
                      className={`absolute -bottom-4 left-0 font-bold text-[8px] px-1 py-0.5 rounded shadow whitespace-nowrap ${
                        isViolation || isHazard ? 'bg-red-700 text-white' : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {det.sub}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Snapshot Notification Toast */}
        {snapshotTaken && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600/90 text-white text-xs px-3.5 py-1.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce">
            <Camera className="w-4 h-4" />
            <span>AI Snapshot Saved to /evidence/</span>
          </div>
        )}

        {/* Bottom Zone Badge Overlay (Exact match to Reference 1) */}
        <div className="absolute bottom-3 left-3 bg-[#0d1c3bee]/90 backdrop-blur-md border border-[#1e3e78] text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
          <span>{zoneLabel}</span>
        </div>

        {/* Camera HUD Diagnostics */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-[10px] font-mono text-emerald-400 px-2 py-1 rounded border border-white/10 flex items-center gap-2">
          <span>FPS: 30.0</span>
          <span>LATENCY: 32ms</span>
          <span>YOLOv8</span>
        </div>
      </div>
    </div>
  );
}
