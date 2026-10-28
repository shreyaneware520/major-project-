import React, { useState, useMemo } from 'react';
import { AlertTriangle, AlertCircle, ShieldCheck, Clock, CheckCircle2, Search, Bell } from 'lucide-react';

const MOCK_ALL_ALERTS = [
  {
    id: 'ALT-101',
    title: 'Nutrient Tank B Low Level',
    message: 'EC solution below threshold (1.2 mS/cm). Refill recommended immediately.',
    zone: 'Hydroponics Alpha - Zone A',
    status: 'CRITICAL',
    timestamp: '10 mins ago',
    resolved: false,
  },
  {
    id: 'ALT-102',
    title: 'CO2 Injection Regulator Warning',
    message: 'Slight pressure fluctuation detected in Grow Bay 3.',
    zone: 'Vertical Farm Beta - Zone B',
    status: 'WARNING',
    timestamp: '28 mins ago',
    resolved: false,
  },
  {
    id: 'ALT-103',
    title: 'Humidity Spike Detected',
    message: 'Relative humidity reached 74% in Sector A-4 temporarily.',
    zone: 'Hydroponics Alpha - Zone A',
    status: 'WARNING',
    timestamp: '3 hours ago',
    resolved: false,
  },
  {
    id: 'ALT-104',
    title: 'HVAC Cycle Completed',
    message: 'Temperature & airflow recalibrated across all facility zones.',
    zone: 'Facility-wide',
    status: 'STABLE',
    timestamp: '1 hour ago',
    resolved: true,
  },
  {
    id: 'ALT-105',
    title: 'UV Sterilization Cycle',
    message: 'Water treatment schedule running nominally at 99.8% filtration.',
    zone: 'Water Treatment Bay 1',
    status: 'STABLE',
    timestamp: '2 hours ago',
    resolved: true,
  },
  {
    id: 'ALT-106',
    title: 'Soil pH Sensor Drift',
    message: 'Soil pH sensor in Bed 4 reported 5.4 pH (outside 5.8 - 6.8 range).',
    zone: 'Aeroponics Gamma - Zone C',
    status: 'CRITICAL',
    timestamp: '5 hours ago',
    resolved: false,
  },
];

const Alerts = () => {
  const [alerts, setAlerts] = useState(MOCK_ALL_ALERTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const handleResolve = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true, status: 'STABLE' } : a))
    );
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterStatus === 'ALL' ||
        (filterStatus === 'UNRESOLVED' && !a.resolved) ||
        a.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [alerts, searchQuery, filterStatus]);

  const criticalCount = alerts.filter((a) => a.status === 'CRITICAL' && !a.resolved).length;
  const warningCount = alerts.filter((a) => a.status === 'WARNING' && !a.resolved).length;

  return (
    <main className="p-6 md:p-8 space-y-8 flex-1">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Facility Alerts Center</h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">Real-time telemetry threshold triggers, notifications, and fault logs</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs px-3 py-1.5 rounded-full font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            {criticalCount} Critical
          </span>
          <span className="text-xs px-3 py-1.5 rounded-full font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            {warningCount} Warnings
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search alerts by zone or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#131c2e] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'UNRESOLVED', 'CRITICAL', 'WARNING', 'STABLE'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === st
                  ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30'
                  : 'bg-[#131c2e] text-gray-400 border border-slate-800 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-[#131c2e] border border-slate-800/80 p-12 rounded-2xl text-center">
            <CheckCircle2 className="w-10 h-10 text-[#00ff88] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No active alerts found</h3>
            <p className="text-xs text-gray-400 mt-1">All telemetry systems are operating within nominal thresholds.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.status === 'CRITICAL';
            const isWarning = alert.status === 'WARNING';
            return (
              <div
                key={alert.id}
                className={`bg-[#131c2e] border p-5 rounded-2xl shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCritical
                    ? 'border-rose-500/40 bg-rose-500/5'
                    : isWarning
                    ? 'border-amber-500/40 bg-amber-500/5'
                    : 'border-slate-800/80'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl border flex-shrink-0 ${
                      isCritical
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : isWarning
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {isCritical ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : isWarning ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : (
                      <ShieldCheck className="w-5 h-5" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-gray-400 font-bold">{alert.id}</span>
                      <span className="text-gray-700">•</span>
                      <h3 className="text-sm font-bold text-white">{alert.title}</h3>
                      <span className="text-xs text-gray-500 font-medium">({alert.zone})</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{alert.message}</p>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-1">
                      <Clock className="w-3 h-3" />
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  {!alert.resolved && (
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#00ff88]/10 hover:bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/30 transition-all cursor-pointer"
                    >
                      Acknowledge & Resolve
                    </button>
                  )}
                  {alert.resolved && (
                    <span className="text-xs px-3 py-1 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
};

export default Alerts;