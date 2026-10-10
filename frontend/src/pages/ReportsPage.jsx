import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  FileSpreadsheet, 
  Sliders, 
  CheckCircle2, 
  TrendingUp, 
  ArrowUpRight,
  ShieldCheck,
  HardHat,
  Glasses
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('Safety Overview');
  const [downloadNotice, setDownloadNotice] = useState(null);

  const tabs = [
    'Safety Overview',
    'Violation Trends',
    'PPE Compliance',
    'Zone-wise',
    'Worker-wise'
  ];

  const trendData = [
    { day: 'Apr 03', rate: 76 },
    { day: 'Apr 04', rate: 78 },
    { day: 'Apr 05', rate: 82 },
    { day: 'Apr 06', rate: 80 },
    { day: 'Apr 07', rate: 81 },
    { day: 'Apr 08', rate: 79 },
    { day: 'Apr 09', rate: 83 },
    { day: 'Apr 10', rate: 81 },
  ];

  const violationsByTypeData = [
    { name: 'Helmet Missing', value: 12, pct: '32%', color: '#ef4444' },
    { name: 'Vest Missing', value: 10, pct: '27%', color: '#f59e0b' },
    { name: 'Safety Shoes', value: 7, pct: '19%', color: '#06b6d4' },
    { name: 'Gloves', value: 5, pct: '14%', color: '#3b82f6' },
    { name: 'Goggles', value: 3, pct: '8%', color: '#a855f7' },
  ];

  const ppeComplianceRates = [
    { name: 'Helmet', rate: 92, color: 'bg-cyan-400' },
    { name: 'Vest', rate: 87, color: 'bg-teal-400' },
    { name: 'Shoes', rate: 76, color: 'bg-emerald-400' },
    { name: 'Gloves', rate: 68, color: 'bg-amber-400' },
    { name: 'Goggles', rate: 58, color: 'bg-rose-500' },
  ];

  const triggerDownload = (type) => {
    setDownloadNotice(`Generating and downloading ${type}...`);
    setTimeout(() => {
      setDownloadNotice(null);
    }, 2500);
  };

  return (
    <div className="p-6 space-y-5 max-w-[1700px] mx-auto animate-in fade-in duration-300">
      {/* Header with Export & Date Range */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#142345]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Reports</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Generate and download safety compliance reports
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0d1a38] border border-[#1e3b75] text-slate-300 text-xs">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>Apr 03, 2025 - Apr 10, 2025</span>
          </div>

          <button
            onClick={() => triggerDownload('Comprehensive Safety Audit PDF')}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation (Exact match to Reference 2) */}
      <div className="flex items-center gap-2 border-b border-[#162a56] pb-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'text-slate-400 hover:text-white hover:bg-[#0c1836]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Download Alert Toast */}
      {downloadNotice && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Top-Left / Left: Safety Compliance Trend Chart */}
        <div className="lg:col-span-8 rounded-2xl bg-[#091226] border border-[#162a56] p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#142345]">
              <div className="text-xs font-bold text-white tracking-wide">
                Safety Compliance Trend
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-slate-400 text-xs">Safety Compliance</span>
                <span className="text-lg font-black text-white">81%</span>
                <span className="text-xs font-bold text-emerald-400">↑ 4.6%</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={[50, 100]} ticks={[50, 60, 70, 80, 90, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1a38', borderColor: '#1e3c75', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#trendGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top-Right / Right: Violations by Type Donut Chart */}
        <div className="lg:col-span-4 rounded-2xl bg-[#091226] border border-[#162a56] p-5 shadow-xl flex flex-col justify-between">
          <div className="pb-3 border-b border-[#142345]">
            <div className="text-xs font-bold text-white tracking-wide">
              Violations by Type
            </div>
          </div>

          <div className="flex flex-col items-center justify-center my-3">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={violationsByTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={44}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {violationsByTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-xl font-black text-white">37</span>
                <span className="text-[9px] font-medium text-slate-400">Total</span>
              </div>
            </div>

            {/* Legend List */}
            <div className="w-full space-y-1.5 mt-3 text-xs">
              {violationsByTypeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span>{item.name}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{item.value} ({item.pct})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom-Left: PPE Compliance Rate Progress Bars */}
        <div className="lg:col-span-8 rounded-2xl bg-[#091226] border border-[#162a56] p-5 shadow-xl">
          <div className="pb-3 border-b border-[#142345] mb-4">
            <div className="text-xs font-bold text-white tracking-wide">
              PPE Compliance Rate
            </div>
          </div>

          <div className="space-y-3.5">
            {ppeComplianceRates.map((ppe) => (
              <div key={ppe.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">{ppe.name}</span>
                  <span className="font-mono text-cyan-400 font-bold">{ppe.rate}%</span>
                </div>
                <div className="w-full bg-[#0d1a38] rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`${ppe.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${ppe.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom-Right: Download Report 3 Action Cards */}
        <div className="lg:col-span-4 rounded-2xl bg-[#091226] border border-[#162a56] p-5 shadow-xl flex flex-col justify-between">
          <div className="pb-3 border-b border-[#142345]">
            <div className="text-xs font-bold text-white tracking-wide">
              Download Report
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 my-3">
            {/* PDF Button */}
            <button
              onClick={() => triggerDownload('PDF Detailed Report')}
              className="p-3 rounded-xl bg-[#0d1836] border border-[#1b3466] hover:border-red-500/50 hover:bg-[#122245] transition-all flex flex-col items-center justify-center text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">PDF</span>
              <span className="text-[9px] text-slate-400">Detailed Report</span>
            </button>

            {/* Excel Button */}
            <button
              onClick={() => triggerDownload('Excel Data Export')}
              className="p-3 rounded-xl bg-[#0d1836] border border-[#1b3466] hover:border-emerald-500/50 hover:bg-[#122245] transition-all flex flex-col items-center justify-center text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">Excel</span>
              <span className="text-[9px] text-slate-400">Data Export</span>
            </button>

            {/* Custom Report */}
            <button
              onClick={() => triggerDownload('Custom Parametric Report')}
              className="p-3 rounded-xl bg-[#0d1836] border border-[#1b3466] hover:border-blue-500/50 hover:bg-[#122245] transition-all flex flex-col items-center justify-center text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <Sliders className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">Custom</span>
              <span className="text-[9px] text-slate-400">Generate Report</span>
            </button>
          </div>

          <div className="text-[10px] text-slate-400 text-center border-t border-[#142345] pt-2">
            Automated OSHA / ISO-45001 Compliance Metrics
          </div>
        </div>
      </div>
    </div>
  );
}
