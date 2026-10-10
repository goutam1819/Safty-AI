import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Search, 
  Filter, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Flame, 
  X,
  Eye,
  Check,
  RotateCcw
} from 'lucide-react';
import WorkerAvatar from '../components/WorkerAvatar';
import { INITIAL_VIOLATIONS } from '../data/mockData';

export default function ViolationsPage() {
  const [violations, setViolations] = useState(INITIAL_VIOLATIONS);
  const [selectedZone, setSelectedZone] = useState('All Zones');
  const [selectedSeverity, setSelectedSeverity] = useState('All Severity');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalViolation, setActiveModalViolation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Toggle Open/Resolved
  const toggleStatus = (id) => {
    setViolations(violations.map(v => {
      if (v.id === id) {
        return { ...v, status: v.status === 'Open' ? 'Resolved' : 'Open' };
      }
      return v;
    }));
  };

  // Filter logic
  const filteredViolations = violations.filter(v => {
    if (selectedZone !== 'All Zones' && !v.zone.includes(selectedZone.replace('Zone ', ''))) return false;
    if (selectedSeverity !== 'All Severity' && v.severity.toLowerCase() !== selectedSeverity.toLowerCase()) return false;
    if (selectedStatus !== 'All Status' && v.status.toLowerCase() !== selectedStatus.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchWorker = v.worker.toLowerCase().includes(q) || (v.workerName && v.workerName.toLowerCase().includes(q));
      const matchViolation = v.violation.toLowerCase().includes(q);
      const matchId = v.id.toLowerCase().includes(q);
      if (!matchWorker && !matchViolation && !matchId) return false;
    }
    return true;
  });

  const getSeverityBadge = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low':
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-[1700px] mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-4 border-b border-[#142345]">
        <h1 className="text-xl font-bold text-white tracking-wide">Violations</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          View and manage safety violations detected by AI
        </p>
      </div>

      {/* Filter Row & Search Bar (Exact match to Reference 2) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#091226] border border-[#162a56] p-3 rounded-2xl shadow-xl">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Zone Filter */}
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="bg-[#0d1a38] border border-[#1e3b75] text-slate-200 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="All Zones">All Zones</option>
            <option value="Zone A">Zone A</option>
            <option value="Zone B">Zone B</option>
            <option value="Zone C">Zone C</option>
            <option value="Zone D">Zone D</option>
          </select>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-[#0d1a38] border border-[#1e3b75] text-slate-200 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="All Severity">All Severity</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#0d1a38] border border-[#1e3b75] text-slate-200 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="All Status">All Status</option>
            <option value="Open">Open</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Date Range Button */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0d1a38] border border-[#1e3b75] text-slate-300 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>Apr 3, 2025 - Apr 10, 2025</span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search worker, violation, ID..."
            className="w-full pl-9 pr-3 py-2 bg-[#0d1a38] border border-[#1e3b75] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* 4 Statistics Summary Cards (Exact match to Reference 2) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Critical Card */}
        <div className="rounded-2xl bg-[#091226] border border-[#162a56] p-4 flex items-center gap-3.5 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-xl font-black text-white">12</div>
            <div className="text-[11px] font-semibold text-slate-400">Critical</div>
          </div>
        </div>

        {/* Medium Card */}
        <div className="rounded-2xl bg-[#091226] border border-[#162a56] p-4 flex items-center gap-3.5 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-xl font-black text-white">18</div>
            <div className="text-[11px] font-semibold text-slate-400">Medium</div>
          </div>
        </div>

        {/* Low Card */}
        <div className="rounded-2xl bg-[#091226] border border-[#162a56] p-4 flex items-center gap-3.5 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-xl font-black text-white">7</div>
            <div className="text-[11px] font-semibold text-slate-400">Low</div>
          </div>
        </div>

        {/* Total Violations Card */}
        <div className="rounded-2xl bg-[#091226] border border-[#162a56] p-4 flex items-center gap-3.5 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-xl font-black text-white">37</div>
            <div className="text-[11px] font-semibold text-slate-400">Total Violations</div>
          </div>
        </div>
      </div>

      {/* Violations Table */}
      <div className="rounded-2xl bg-[#091226] border border-[#162a56] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#142345] text-slate-400 uppercase tracking-wider font-semibold text-[10px] bg-[#0b1633]">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Worker</th>
                <th className="py-3 px-4">Violation</th>
                <th className="py-3 px-4">Zone</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#132247] text-slate-300">
              {filteredViolations.map((v) => {
                const isOpen = v.status === 'Open';
                const isHazard = v.violation.toLowerCase().includes('smoke') || v.violation.toLowerCase().includes('fire');

                return (
                  <tr key={v.id} className="hover:bg-[#0c1836]/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-400">
                      {v.id}
                    </td>
                    <td className="py-3 px-4">
                      {isHazard ? (
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-red-500/40">
                          <img src="/assets/smoke_hazard.jpg" alt="Hazard" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <WorkerAvatar name={v.worker} violation={isOpen} size="sm" />
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{v.worker}</div>
                      {v.workerName && (
                        <div className="text-[10px] text-slate-400">{v.workerName}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      {v.violation}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {v.zone}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(v.severity)}`}>
                        {v.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {v.time}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleStatus(v.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                          isOpen 
                            ? 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25' 
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                        }`}
                        title="Click to toggle status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-red-500' : 'bg-emerald-400'}`}></span>
                        <span>{v.status}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setActiveModalViolation(v)}
                        className="text-blue-400 hover:text-blue-300 font-semibold text-xs transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination (Exact match to Reference 2) */}
        <div className="px-5 py-3 border-t border-[#142345] bg-[#091226] flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing 1-{filteredViolations.length} of 37
          </div>
          <div className="flex items-center gap-1.5">
            <button className="p-1 rounded bg-[#0d1a38] text-slate-400 hover:text-white border border-[#1e3b75]">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="w-6 h-6 rounded bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              1
            </button>
            <button className="w-6 h-6 rounded bg-[#0d1a38] text-slate-300 hover:text-white text-xs flex items-center justify-center border border-[#1e3b75]">
              2
            </button>
            <button className="w-6 h-6 rounded bg-[#0d1a38] text-slate-300 hover:text-white text-xs flex items-center justify-center border border-[#1e3b75]">
              3
            </button>
            <button className="w-6 h-6 rounded bg-[#0d1a38] text-slate-300 hover:text-white text-xs flex items-center justify-center border border-[#1e3b75]">
              4
            </button>
            <button className="w-6 h-6 rounded bg-[#0d1a38] text-slate-300 hover:text-white text-xs flex items-center justify-center border border-[#1e3b75]">
              5
            </button>
            <button className="p-1 rounded bg-[#0d1a38] text-slate-400 hover:text-white border border-[#1e3b75]">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Violation Detail Modal */}
      {activeModalViolation && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b1736] border border-[#1e3b75] rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#162c5b]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-blue-400">{activeModalViolation.id}</span>
                <span className="text-white font-bold text-sm">Violation Audit Details</span>
              </div>
              <button onClick={() => setActiveModalViolation(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="flex items-center gap-4">
                <WorkerAvatar name={activeModalViolation.worker} violation={activeModalViolation.status === 'Open'} size="xl" />
                <div>
                  <h3 className="text-sm font-bold text-white">{activeModalViolation.worker}</h3>
                  <p className="text-slate-400">{activeModalViolation.workerName || "Industrial Worker"}</p>
                  <p className="text-red-400 font-bold mt-1 text-xs">{activeModalViolation.violation}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#081024] border border-[#1d3870]">
                <div>
                  <span className="text-slate-400 text-[10px] block">Location Zone:</span>
                  <span className="text-white font-semibold">{activeModalViolation.zone}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Severity Tier:</span>
                  <span className="text-orange-400 font-bold">{activeModalViolation.severity}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Timestamp:</span>
                  <span className="text-white font-mono">{activeModalViolation.time}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">AI Confidence:</span>
                  <span className="text-emerald-400 font-mono font-bold">98.2%</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => {
                    toggleStatus(activeModalViolation.id);
                    setActiveModalViolation(prev => ({
                      ...prev,
                      status: prev.status === 'Open' ? 'Resolved' : 'Open'
                    }));
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${
                    activeModalViolation.status === 'Open'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-red-600 hover:bg-red-500 text-white'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{activeModalViolation.status === 'Open' ? 'Mark as Resolved' : 'Re-open Incident'}</span>
                </button>

                <button
                  onClick={() => setActiveModalViolation(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
