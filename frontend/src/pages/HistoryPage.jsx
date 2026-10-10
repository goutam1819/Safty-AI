import React, { useState } from 'react';
import { Search, Calendar, ChevronLeft, ChevronRight, X, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { INITIAL_VIOLATIONS } from '../data/mockData';

export default function HistoryPage() {
  const [selectedZone, setSelectedZone] = useState('All Zones');
  const [selectedWorker, setSelectedWorker] = useState('All Workers');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuditLog, setSelectedAuditLog] = useState(null);

  const historyLogs = [
    { id: 'H-101', dateTime: 'Apr 10, 2025 10:24 AM', worker: 'Worker 24', zone: 'Zone A', violation: 'Helmet Missing', severity: 'High', status: 'Open' },
    { id: 'H-102', dateTime: 'Apr 10, 2025 09:52 AM', worker: 'Worker 18', zone: 'Zone B', violation: 'Vest Missing', severity: 'Medium', status: 'Open' },
    { id: 'H-103', dateTime: 'Apr 10, 2025 09:30 AM', worker: 'Worker 07', zone: 'Zone C', violation: 'No Safety Shoes', severity: 'Medium', status: 'Resolved' },
    { id: 'H-104', dateTime: 'Apr 10, 2025 08:45 AM', worker: 'Worker 12', zone: 'Zone A', violation: 'No Goggles', severity: 'Low', status: 'Resolved' },
    { id: 'H-105', dateTime: 'Apr 10, 2025 07:12 AM', worker: 'Worker 30', zone: 'Zone D', violation: 'Smoke Detected', severity: 'Critical', status: 'Open' },
    { id: 'H-106', dateTime: 'Apr 09, 2025 04:30 PM', worker: 'Worker 15', zone: 'Zone B', violation: 'Gloves Missing', severity: 'Medium', status: 'Resolved' },
    { id: 'H-107', dateTime: 'Apr 09, 2025 02:15 PM', worker: 'Worker 09', zone: 'Zone C', violation: 'Helmet Missing', severity: 'High', status: 'Resolved' },
  ];

  const filteredLogs = historyLogs.filter(item => {
    if (selectedZone !== 'All Zones' && item.zone !== selectedZone) return false;
    if (selectedWorker !== 'All Workers' && item.worker !== selectedWorker) return false;
    if (selectedStatus !== 'All Status' && item.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!item.worker.toLowerCase().includes(q) && !item.violation.toLowerCase().includes(q) && !item.zone.toLowerCase().includes(q)) {
        return false;
      }
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
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-[1700px] mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-4 border-b border-[#142345]">
        <h1 className="text-xl font-bold text-white tracking-wide">Violation History</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Complete history of detected violations
        </p>
      </div>

      {/* Filter Row (Exact match to Reference 2) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#091226] border border-[#162a56] p-3 rounded-2xl shadow-xl">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date range picker button */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0d1a38] border border-[#1e3b75] text-slate-300 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>Apr 3, 2025 - Apr 10, 2025</span>
          </div>

          {/* Zones */}
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="bg-[#0d1a38] border border-[#1e3b75] text-slate-200 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="All Zones">All Zones</option>
            <option value="Zone A">Zone A</option>
            <option value="Zone B">Zone B</option>
            <option value="Zone C">Zone C</option>
            <option value="Zone D">Zone D</option>
          </select>

          {/* Workers */}
          <select
            value={selectedWorker}
            onChange={(e) => setSelectedWorker(e.target.value)}
            className="bg-[#0d1a38] border border-[#1e3b75] text-slate-200 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="All Workers">All Workers</option>
            <option value="Worker 24">Worker 24</option>
            <option value="Worker 18">Worker 18</option>
            <option value="Worker 07">Worker 07</option>
            <option value="Worker 12">Worker 12</option>
            <option value="Worker 30">Worker 30</option>
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#0d1a38] border border-[#1e3b75] text-slate-200 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="All Status">All Status</option>
            <option value="Open">Open</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by worker name, violation..."
            className="w-full pl-9 pr-3 py-2 bg-[#0d1a38] border border-[#1e3b75] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-2xl bg-[#091226] border border-[#162a56] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#142345] text-slate-400 uppercase tracking-wider font-semibold text-[10px] bg-[#0b1633]">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Worker</th>
                <th className="py-3 px-4">Zone</th>
                <th className="py-3 px-4">Violation</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#132247] text-slate-300">
              {filteredLogs.map((log) => {
                const isOpen = log.status === 'Open';
                return (
                  <tr key={log.id} className="hover:bg-[#0c1836]/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {log.dateTime}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {log.worker}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {log.zone}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      {log.violation}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(log.severity)}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isOpen 
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30' 
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-red-500' : 'bg-emerald-400'}`}></span>
                        <span>{log.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedAuditLog(log)}
                        className="text-blue-400 hover:text-blue-300 font-semibold text-xs"
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

        {/* Footer & Pagination */}
        <div className="px-5 py-3 border-t border-[#142345] bg-[#091226] flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing 1-{filteredLogs.length} of 45
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

      {/* Audit Detail Modal */}
      {selectedAuditLog && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b1736] border border-[#1e3b75] rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#162c5b]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-white font-bold text-sm">Audit Log Record</span>
              </div>
              <button onClick={() => setSelectedAuditLog(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 bg-[#081024] rounded-xl border border-[#1d3870] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Timestamp:</span>
                  <span className="text-white font-mono">{selectedAuditLog.dateTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Worker Identifier:</span>
                  <span className="text-white font-bold">{selectedAuditLog.worker}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-white">{selectedAuditLog.zone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Detected Event:</span>
                  <span className="text-red-400 font-bold">{selectedAuditLog.violation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-emerald-400 font-bold">{selectedAuditLog.status}</span>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedAuditLog(null)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
