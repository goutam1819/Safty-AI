import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Video, 
  ShieldCheck, 
  AlertTriangle, 
  Users, 
  Flame, 
  Maximize2, 
  Camera, 
  Radio, 
  CheckCircle2, 
  Clock, 
  HardHat, 
  Eye, 
  RefreshCw 
} from 'lucide-react';
import LiveVideoAIPlayer from '../components/LiveVideoAIPlayer';
import { INITIAL_CAMERAS } from '../data/mockData';

export default function CameraDetailPage({ camera: propCamera, onBack }) {
  const [selectedCam, setSelectedCam] = useState(propCamera || INITIAL_CAMERAS[0]);
  const [streamMode, setStreamMode] = useState('live-video'); // 'live-video' or 'forensic-snapshot'

  const detectedObjectsList = [
    { name: 'Helmet', count: 22, color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' },
    { name: 'Vest', count: 21, color: 'border-blue-500/40 bg-blue-500/10 text-blue-400' },
    { name: 'Worker', count: 24, color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400' },
    { name: 'Smoke', count: 0, color: 'border-amber-500/40 bg-amber-500/10 text-amber-400' },
    { name: 'Fire', count: 0, color: 'border-red-500/40 bg-red-500/10 text-red-400' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto animate-in fade-in duration-300">
      {/* Top Header with Back button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#142345]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-[#0d1a38] border border-[#1e3b75] text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-wide">
                {selectedCam.code} — {selectedCam.name}
              </h1>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{selectedCam.status}</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedCam.zone} • RTSP H.264 High Profile • 1080p @ 30 FPS
            </p>
          </div>
        </div>

        {/* Camera Selector & Stream Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#0d1a38] border border-[#1e3b75] rounded-xl p-0.5 text-xs font-semibold">
            <button
              onClick={() => setStreamMode('live-video')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                streamMode === 'live-video' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Video Stream
            </button>
            <button
              onClick={() => setStreamMode('forensic-snapshot')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                streamMode === 'forensic-snapshot' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Forensic Still
            </button>
          </div>

          <select
            value={selectedCam.id}
            onChange={(e) => {
              const found = INITIAL_CAMERAS.find(c => c.id === e.target.value);
              if (found) setSelectedCam(found);
            }}
            className="bg-[#0d1a38] border border-[#1e3b75] text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none"
          >
            {INITIAL_CAMERAS.map(c => (
              <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3 Metric Summary Cards (Requested in Prompt) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Workers Detected */}
        <div className="rounded-2xl bg-[#091226] border border-[#162a56] p-4 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <Users className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Workers Detected</div>
              <div className="text-2xl font-black text-white">{selectedCam.workersDetected || 24}</div>
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Real-Time
          </span>
        </div>

        {/* Current Alerts */}
        <div className="rounded-2xl bg-[#091226] border border-[#162a56] p-4 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Current Alerts</div>
              <div className="text-2xl font-black text-white">{selectedCam.alertsCount || 1}</div>
            </div>
          </div>
          <span className="text-[10px] text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
            Action Req.
          </span>
        </div>

        {/* Safety Compliance */}
        <div className="rounded-2xl bg-[#091226] border border-[#162a56] p-4 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Safety Compliance</div>
              <div className="text-2xl font-black text-white">{selectedCam.safetyCompliance || 91}%</div>
            </div>
          </div>
          <div className="w-20 bg-[#0d1a38] rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${selectedCam.safetyCompliance || 91}%` }} />
          </div>
        </div>
      </div>

      {/* Main CCTV Feed Viewport (Live Video Player vs Still) */}
      {streamMode === 'live-video' ? (
        <LiveVideoAIPlayer
          cameraZone={selectedCam.zone}
        />
      ) : (
        <div className="rounded-2xl bg-[#091226] border border-[#162a56] overflow-hidden shadow-2xl">
          <div className="px-5 py-3 bg-[#0b1733] border-b border-[#162a56] flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs">
              <span className="font-bold text-white">Forensic Snapshot Analysis</span>
              <span className="font-mono text-cyan-400 text-[11px]">Resolution: 1920x1080 FHD</span>
            </div>
          </div>
          <div className="relative aspect-[16/9] w-full bg-black overflow-hidden">
            <img
              src={selectedCam.imageUrl}
              alt={selectedCam.name}
              className="w-full h-full object-cover filter contrast-105"
            />
            <div className="cctv-scanline" />
          </div>
        </div>
      )}

      {/* Detected Objects Chips Bar (Requested in Prompt) */}
      <div className="rounded-2xl bg-[#091226] border border-[#162a56] p-5 shadow-xl">
        <div className="pb-3 border-b border-[#142345] mb-4">
          <h2 className="text-xs font-bold text-white tracking-wide uppercase">
            Detected Objects
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {detectedObjectsList.map((obj) => (
            <div
              key={obj.name}
              className={`px-4 py-2.5 rounded-xl border flex items-center gap-3 ${obj.color} shadow-sm`}
            >
              <span className="font-bold text-xs">{obj.name}</span>
              <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-white/10">
                {obj.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
