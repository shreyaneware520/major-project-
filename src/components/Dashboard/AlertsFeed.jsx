import React from 'react';
import { AlertTriangle, ShieldCheck, AlertCircle, Clock, ChevronRight } from 'lucide-react';

const alerts = [
  {
    id: 1,
    title: 'Nutrient Tank B Low Level',
    message: 'EC solution below threshold (1.2 mS/cm). Refill recommended.',
    status: 'CRITICAL',
    timestamp: '10 mins ago',
    icon: AlertTriangle,
  },
  {
    id: 2,
    title: 'CO2 Injection Regulator Warning',
    message: 'Slight pressure fluctuation detected in Grow Bay 3.',
    status: 'WARNING',
    timestamp: '28 mins ago',
    icon: AlertCircle,
  },
  {
    id: 3,
    title: 'HVAC Cycle Complete',
    message: 'Temperature & airflow recalibrated across all zones.',
    status: 'STABLE',
    timestamp: '1 hour ago',
    icon: ShieldCheck,
  },
  {
    id: 4,
    title: 'UV Sterilization Cycle',
    message: 'Water treatment schedule running nominally at 99.8% filtration.',
    status: 'STABLE',
    timestamp: '2 hours ago',
    icon: ShieldCheck,
  },
  {
    id: 5,
    title: 'Humidity Spike Detected',
    message: 'Relative humidity reached 74% in Sector A-4 temporarily.',
    status: 'WARNING',
    timestamp: '3 hours ago',
    icon: AlertCircle,
  },
];

const getBadgeStyle = (status) => {
  switch (status) {
    case 'CRITICAL':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]';
    case 'WARNING':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
    case 'STABLE':
    default:
      return 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30 shadow-[0_0_10px_rgba(0,255,136,0.15)]';
  }
};

const AlertsFeed = React.memo(() => {
  return (
    <div className="bg-[#131c2e] border border-slate-800/80 p-6 rounded-2xl shadow-lg flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00ff88] animate-pulse"></div>
          <h3 className="text-lg font-bold text-white tracking-wide">Alerts Feed</h3>
        </div>
        <button className="text-xs font-semibold text-[#00ff88] hover:underline flex items-center gap-1">
          View All <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* List of Alerts */}
      <div className="space-y-4 my-4 overflow-y-auto max-h-[340px] pr-1 custom-scrollbar">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <div
              key={alert.id}
              className="p-4 rounded-xl bg-[#0a0f1a] border border-slate-800/80 hover:border-slate-700 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${alert.status === 'CRITICAL' ? 'text-rose-400' : alert.status === 'WARNING' ? 'text-amber-400' : 'text-[#00ff88]'
                    }`} />
                  <h4 className="text-sm font-semibold text-white">{alert.title}</h4>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getBadgeStyle(alert.status)}`}>
                  {alert.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-2 leading-relaxed">{alert.message}</p>
              <div className="flex items-center gap-1 text-[11px] text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{alert.timestamp}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer info */}
      <div className="pt-3 border-t border-slate-800 text-center text-xs text-gray-500">
        Auto-monitoring active • 24/7 Telemetry Feed
      </div>
    </div>
  );
});

export default AlertsFeed;
