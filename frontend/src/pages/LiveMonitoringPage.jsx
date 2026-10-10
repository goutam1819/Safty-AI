import React, { useState } from 'react';
import { Video, Grid, Filter, AlertCircle, ShieldCheck, Flame, Eye, EyeOff, Maximize2 } from 'lucide-react';
import { INITIAL_CAMERAS } from '../data/mockData';

export default function LiveMonitoringPage({ onSelectCamera }) {
  const [cameras, setCameras] = useState(INITIAL_CAMERAS);
  const [filterZone, setFilterZone] = useState('All Cameras');
  const [gridMode, setGridMode] = useState('2x2');
  const [showOverlays, setShowOverlays] = useState(true);

  const filteredCameras = filterZone === 'All Cameras'
    ? cameras
    : cameras.filter(c => c.name.toLowerCase().includes(filterZone.toLowerCase()) || c.zone.toLowerCase().includes(filterZone.toLowerCase()));

  return (
    <div className="p-6 space-y-5 max-w-[1700px] mx-auto animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#142345]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-wide">Live Monitoring</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              4 Active Streams
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time AI detection from live CCTV feeds
          </p>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-3">
          {/* AI Overlay toggle */}
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0d1a38] border border-[#1e3b75] text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            {showOverlays ? <Eye className="w-3.5 h-3.5 text-blue-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            <span>{showOverlays ? 'Hide AI HUD' : 'Show AI HUD'}</span>
          </button>

          {/* Camera Filter Dropdown */}
          <div className="relative">
            <select
              value={filterZone}
              onChange={(e) => setFilterZone(e.target.value)}
              className="bg-[#0d1a38] border border-[#1e3b75] text-slate-200 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All Cameras">All Cameras</option>
              <option value="Production Floor">Camera 01 - Production Floor</option>
              <option value="Warehouse">Camera 02 - Warehouse</option>
              <option value="Loading Bay">Camera 03 - Loading Bay</option>
              <option value="Assembly Line">Camera 04 - Assembly Line</option>
            </select>
          </div>

          {/* Grid Layout Toggle */}
          <div className="flex items-center bg-[#0d1a38] border border-[#1e3b75] rounded-xl p-0.5">
            <button
              onClick={() => setGridMode('2x2')}
              className={`p-1.5 rounded-lg text-xs font-semibold ${gridMode === '2x2' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="2x2 Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2x2 CCTV Grid Container */}
      <div className={`grid ${gridMode === '2x2' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-5`}>
        {filteredCameras.map((cam) => (
          <div
            key={cam.id}
            onClick={() => onSelectCamera && onSelectCamera(cam)}
            className="group rounded-2xl bg-[#091226] border border-[#162a56] hover:border-blue-500/70 overflow-hidden shadow-2xl transition-all duration-200 cursor-pointer flex flex-col"
          >
            {/* Camera Card Top Header */}
            <div className="px-4 py-2.5 bg-[#0b1733] border-b border-[#162a56] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                  {cam.code} — {cam.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {cam.resolution}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{cam.status}</span>
              </div>
            </div>

            {/* Video Feed Frame with Computer Vision Overlays */}
            <div className="relative aspect-[16/9] w-full bg-black overflow-hidden">
              <img
                src={cam.imageUrl}
                alt={cam.name}
                className="w-full h-full object-cover filter contrast-105 group-hover:scale-102 transition-transform duration-300"
              />

              {/* Scanline */}
              <div className="cctv-scanline" />

              {/* AI Bounding Boxes */}
              {showOverlays && (
                <div className="absolute inset-0 pointer-events-none">
                  {cam.detections.map((det) => {
                    const isViolation = det.status === 'violation';
                    const isHazard = det.status === 'hazard';
                    const isSafe = det.status === 'compliant';

                    return (
                      <div
                        key={det.id}
                        className={`absolute border-2 rounded-sm ${
                          isHazard
                            ? 'border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse'
                            : isViolation
                            ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)] animate-pulse'
                            : 'border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                        }`}
                        style={{
                          left: `${det.x}%`,
                          top: `${det.y}%`,
                          width: `${det.w}%`,
                          height: `${det.h}%`
                        }}
                      >
                        {/* Upper Badge */}
                        <div
                          className={`absolute -top-5 left-0 font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow-md whitespace-nowrap ${
                            isHazard
                              ? 'bg-red-600 text-white'
                              : isViolation
                              ? 'bg-red-600 text-white'
                              : 'bg-emerald-500 text-slate-950'
                          }`}
                        >
                          {det.label}
                        </div>

                        {/* Lower Sub-badge */}
                        {det.sub && (
                          <div
                            className={`absolute -bottom-4 left-0 font-bold text-[8px] px-1 py-0.5 rounded shadow ${
                              isViolation ? 'bg-red-700 text-white' : 'bg-emerald-600 text-white'
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

              {/* Click to inspect overlay hint */}
              <div className="absolute inset-0 bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="px-3 py-1.5 rounded-xl bg-[#070e22]/90 border border-blue-500/50 text-white text-xs font-semibold flex items-center gap-2 backdrop-blur-sm shadow-xl">
                  <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Click for Deep Inspection Stream</span>
                </div>
              </div>
            </div>

            {/* Camera Card Footer */}
            <div className="px-4 py-2 bg-[#0b1733] border-t border-[#162a56] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {cam.alertsCount > 0 ? (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-[11px]">
                    <AlertCircle className="w-3 h-3" />
                    <span>{cam.alertsCount} Alert</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>0 Alerts</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400 font-mono">
                  FPS: {cam.fps}
                </span>
                <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {cam.aiAccuracy} AI Accuracy
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
