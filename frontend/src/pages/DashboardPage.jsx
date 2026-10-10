import React, { useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import KPICards from '../components/KPICards';
import LiveVideoAIPlayer from '../components/LiveVideoAIPlayer';
import RecentDetections from '../components/RecentDetections';
import AIAlerts from '../components/AIAlerts';
import QuickActions from '../components/QuickActions';
import AnalyticsRow from '../components/AnalyticsRow';
import { RECENT_DETECTIONS, AI_ALERTS, INITIAL_KPIS } from '../data/mockData';

export default function DashboardPage({ onNavigate, onSelectCamera }) {
  const [kpis, setKpis] = useState(INITIAL_KPIS);
  const [alerts, setAlerts] = useState(AI_ALERTS);
  const [detections, setDetections] = useState(RECENT_DETECTIONS);

  // Handle dynamic real-time violation dispatched from video player / Judge Demo
  const handleViolationAlert = (newAlert) => {
    // 1. Add to Alerts panel
    const formattedAlert = {
      id: `alt-${Date.now()}`,
      title: newAlert.violation || newAlert.title,
      zone: `${newAlert.worker} — ${newAlert.zone}`,
      time: newAlert.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      severity: "High",
      icon: newAlert.title.includes("FIRE") ? "Flame" : "AlertTriangle"
    };
    setAlerts(prev => [formattedAlert, ...prev.slice(0, 4)]);

    // 2. Add to Recent Detections list
    const formattedDetection = {
      id: `rd-${Date.now()}`,
      title: newAlert.violation || newAlert.title,
      worker: newAlert.worker,
      zone: newAlert.zone,
      time: newAlert.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: newAlert.title.includes("FIRE") ? "hazard" : "violation",
      severity: "High"
    };
    setDetections(prev => [formattedDetection, ...prev.slice(0, 4)]);

    // 3. Update Dashboard KPI statistics dynamically
    setKpis(prev => ({
      ...prev,
      unsafeWorkers: prev.unsafeWorkers + 1,
      safeWorkers: Math.max(0, prev.safeWorkers - 1),
      safetyCompliance: Math.max(70, Math.round(((prev.safeWorkers - 1) / prev.totalWorkers) * 100))
    }));
  };

  const handleCounterUpdate = (liveCounters) => {
    // Sync live counters with KPI state
    setKpis(prev => ({
      ...prev,
      safePercentage: Math.round((liveCounters.safeWorkers / (liveCounters.workersDetected || 1)) * 100),
      unsafePercentage: Math.round((liveCounters.violations / (liveCounters.workersDetected || 1)) * 100),
      safetyCompliance: Math.round((liveCounters.safeWorkers / (liveCounters.workersDetected || 1)) * 100)
    }));
  };

  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto animate-in fade-in duration-300">
      {/* 1. Top Hero Section */}
      <HeroBanner />

      {/* 2. 4 White Executive KPI Cards */}
      <KPICards data={kpis} />

      {/* 3. Middle CCTV Feed & Intelligence Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Main Live CCTV Video Player with Computer Vision Overlays */}
        <div className="lg:col-span-6 flex flex-col">
          <LiveVideoAIPlayer
            cameraZone="Zone A — Assembly Line"
            onViolationAlert={handleViolationAlert}
            onCounterUpdate={handleCounterUpdate}
          />
        </div>

        {/* Center: Recent Detections List */}
        <div className="lg:col-span-3 flex flex-col">
          <RecentDetections
            detections={detections}
            onViewAll={() => onNavigate('violations')}
          />
        </div>

        {/* Right: AI Alerts & Quick Actions */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-5">
          <AIAlerts
            alerts={alerts}
            onViewAll={() => onNavigate('violations')}
          />
          <QuickActions
            onAction={(page) => onNavigate(page)}
          />
        </div>
      </div>

      {/* 4. Bottom Analytics Row */}
      <AnalyticsRow
        onViewAllActivity={() => onNavigate('history')}
      />
    </div>
  );
}
