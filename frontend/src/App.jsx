import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import DashboardPage from './pages/DashboardPage';
import LiveMonitoringPage from './pages/LiveMonitoringPage';
import UploadImportPage from './pages/UploadImportPage';
import ViolationsPage from './pages/ViolationsPage';
import ReportsPage from './pages/ReportsPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import CameraDetailPage from './pages/CameraDetailPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedCameraForDetail, setSelectedCameraForDetail] = useState(null);

  const handleSelectCamera = (camera) => {
    setSelectedCameraForDetail(camera);
    setCurrentPage('camera-detail');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={(page) => setCurrentPage(page)}
            onSelectCamera={handleSelectCamera}
          />
        );
      case 'live-monitoring':
        return (
          <LiveMonitoringPage
            onSelectCamera={handleSelectCamera}
          />
        );
      case 'upload-import':
        return <UploadImportPage />;
      case 'violations':
        return <ViolationsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'history':
        return <HistoryPage />;
      case 'settings':
        return <SettingsPage />;
      case 'camera-detail':
        return (
          <CameraDetailPage
            camera={selectedCameraForDetail}
            onBack={() => setCurrentPage('live-monitoring')}
          />
        );
      default:
        return (
          <DashboardPage
            onNavigate={(page) => setCurrentPage(page)}
            onSelectCamera={handleSelectCamera}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#070c18] text-slate-100 font-sans">
      {/* 1. Left Fixed Sidebar */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <TopHeader
          onSearch={(query) => {
            if (query && currentPage !== 'violations' && currentPage !== 'history') {
              // Could filter or redirect
            }
          }}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 pb-10">
          {renderContent()}
        </main>

        {/* Global Footer (Exact match to Reference 1) */}
        <footer className="h-12 px-6 bg-[#070d1e] border-t border-[#142344] flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Industrial Safety AI</span>
            <span>|</span>
            <span>AI-Powered Workplace Safety Monitoring</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-400 font-medium">
            <span>Safer People</span>
            <span>|</span>
            <span>Safer Workplaces</span>
            <span>|</span>
            <span>A Smarter Tomorrow</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
