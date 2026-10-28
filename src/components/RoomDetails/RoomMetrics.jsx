import React from 'react';
import { Thermometer, Droplets, Sun, FlaskConical, Activity, Cloud } from 'lucide-react';

const MetricCard = ({ icon: Icon, title, value, unit, status, range }) => {
  const isOptimal = status === 'Optimal';
  const isAttention = status === 'Attention' || status === 'Critical';
  const isOffline = value === '--';
  
  return (
    <div className="bg-[#131c2e] border border-slate-800/80 hover:border-slate-700/80 p-5 rounded-2xl shadow-lg transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
      {/* Top row with icon & status */}
      <div className="flex items-center justify-between mb-4 z-10">
        <div className="p-3 rounded-xl bg-[#0a0f1a] border border-slate-800 text-[#00ff88] group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5" />
        </div>
        {!isOffline && (
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
              isOptimal
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : isAttention
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            {status}
          </span>
        )}
        {isOffline && (
          <span className="text-xs px-2.5 py-1 rounded-full font-medium border bg-gray-500/10 text-gray-400 border-gray-500/30">
            Offline
          </span>
        )}
      </div>

      {/* Metric details */}
      <div className="z-10">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-1.5 mt-1">
          <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
          {!isOffline && <span className="text-sm text-gray-400 font-semibold">{unit}</span>}
        </div>
        {!isOffline && range && (
          <p className="text-[10px] text-gray-500 mt-2 font-medium">
            Optimal: {range.min}{unit} - {range.max}{unit}
          </p>
        )}
      </div>

      {/* Decorative gradient backing */}
      <div className="absolute right-0 bottom-0 translate-y-3 translate-x-3 w-16 h-16 bg-[#00ff88]/5 rounded-full blur-xl group-hover:bg-[#00ff88]/10 transition-all duration-300" />
    </div>
  );
};

const RoomMetrics = ({ room = {} }) => {
  const isOffline = room?.status === 'offline';

  const getMetricStatus = (val, range) => {
    if (isOffline) return 'Offline';
    if (!range || val == null) return 'Optimal';
    if (val < range.min || val > range.max) return 'Attention';
    return 'Optimal';
  };

  const metrics = [
    {
      id: 'temp',
      title: 'Temperature',
      value: isOffline ? '--' : room?.metrics?.temperature ?? '--',
      unit: '°C',
      icon: Thermometer,
      range: { min: 20, max: 28 },
      status: getMetricStatus(room?.metrics?.temperature, { min: 20, max: 28 }),
    },
    {
      id: 'humidity',
      title: 'Humidity',
      value: isOffline ? '--' : room?.metrics?.humidity ?? '--',
      unit: '%',
      icon: Droplets,
      range: { min: 50, max: 75 },
      status: getMetricStatus(room?.metrics?.humidity, { min: 50, max: 75 }),
    },
    {
      id: 'soil_moisture',
      title: 'Soil Moisture',
      value: isOffline ? '--' : room?.metrics?.moisture ?? '--',
      unit: '%',
      icon: Cloud,
      range: { min: 50, max: 80 },
      status: getMetricStatus(room?.metrics?.moisture, { min: 50, max: 80 }),
    },
    {
      id: 'soil_ph',
      title: 'Soil pH',
      value: isOffline ? '--' : room?.metrics?.soilPh ?? '--',
      unit: 'pH',
      icon: FlaskConical,
      range: { min: 5.8, max: 6.8 },
      status: getMetricStatus(room?.metrics?.soilPh, { min: 5.8, max: 6.8 }),
    },
    {
      id: 'light',
      title: 'Light Intensity',
      value: isOffline ? '--' : room?.metrics?.light ?? '--',
      unit: 'Lux',
      icon: Sun,
      range: { min: 400, max: 1200 },
      status: getMetricStatus(room?.metrics?.light, { min: 400, max: 1200 }),
    },
    {
      id: 'water_flow',
      title: 'Water Flow',
      value: isOffline ? '--' : room?.metrics?.waterFlow ?? '--',
      unit: 'L/min',
      icon: Activity,
      range: { min: 2.0, max: 5.0 },
      status: getMetricStatus(room?.metrics?.waterFlow, { min: 2.0, max: 5.0 }),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
      {metrics.map((m) => (
        <MetricCard key={m.id} {...m} />
      ))}
    </div>
  );
};

export default RoomMetrics;
