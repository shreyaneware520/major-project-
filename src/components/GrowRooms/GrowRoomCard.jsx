import React from 'react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import {
  Thermometer,
  Droplets,
  Sun,
  FlaskConical,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Leaf,
  WifiOff,
} from 'lucide-react';
import { formatTimeAgo } from './growRoomData';

// ─── Sub-Components ─────────────────────────────────────────────────────

const GrowthStageBadge = ({ stage }) => {
  const config = {
    'Seedling': { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30', icon: '🌱' },
    'Vegetative': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: '🌿' },
    'Flowering': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', icon: '🌸' },
    'Harvest-Ready': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', icon: '🌾' },
  };
  const c = config[stage] || config['Vegetative'];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border} uppercase tracking-wider`}>
      <span>{c.icon}</span> {stage}
    </span>
  );
};

const StatusDot = ({ status }) => {
  const colors = {
    online: 'bg-[#00ff88]',
    alert: 'bg-amber-400',
    offline: 'bg-gray-500',
  };
  return (
    <div className="relative flex h-2.5 w-2.5">
      {status === 'online' && (
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors[status]} opacity-75`} />
      )}
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${colors[status]}`} />
    </div>
  );
};

const HealthBar = ({ health }) => {
  const config = {
    'Healthy': { width: 'w-full', color: 'bg-gradient-to-r from-[#00ff88] to-emerald-500', textColor: 'text-[#00ff88]' },
    'Needs Attention': { width: 'w-3/5', color: 'bg-gradient-to-r from-amber-400 to-amber-500', textColor: 'text-amber-400' },
    'Critical': { width: 'w-1/4', color: 'bg-gradient-to-r from-rose-400 to-rose-500', textColor: 'text-rose-400' },
  };
  const c = config[health] || config['Healthy'];
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Health Score</span>
        <span className={`text-[10px] font-bold ${c.textColor}`}>{health}</span>
      </div>
      <div className="w-full h-1.5 bg-[#0a0f1a] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${c.color} ${c.width} transition-all duration-700`} />
      </div>
    </div>
  );
};

const MetricPill = ({ icon: Icon, label, value, unit }) => (
  <div className="flex items-center gap-2 bg-[#0a0f1a] border border-slate-800/60 px-2.5 py-1.5 rounded-lg">
    <Icon className="w-3.5 h-3.5 text-[#00ff88] flex-shrink-0" />
    <div className="flex flex-col min-w-0">
      <span className="text-[9px] text-gray-500 uppercase tracking-wider font-medium leading-none">{label}</span>
      <span className="text-xs font-bold text-white leading-tight">
        {value}<span className="text-[10px] text-gray-400 font-normal ml-0.5">{unit}</span>
      </span>
    </div>
  </div>
);

// ─── Main GrowRoomCard Component ────────────────────────────────────────

const GrowRoomCard = ({ room }) => {
  const isOffline = room.status === 'offline';
  const isAlert = room.status === 'alert' || room.health === 'Critical';
  const cardBorderColor = isAlert
    ? 'border-amber-500/30 hover:border-amber-500/50'
    : isOffline
      ? 'border-slate-700/60 hover:border-slate-600/60'
      : 'border-slate-800/80 hover:border-[#00ff88]/30';
  const glowShadow = isAlert
    ? 'hover:shadow-[0_0_30px_rgba(245,158,11,0.08)]'
    : isOffline
      ? ''
      : 'hover:shadow-[0_0_30px_rgba(0,255,136,0.08)]';

  return (
    <div
      className={`bg-[#131c2e] border ${cardBorderColor} rounded-2xl shadow-lg transition-all duration-300 ${glowShadow} group relative overflow-hidden flex flex-col ${isOffline ? 'opacity-60' : ''}`}
    >
      {/* Card Header */}
      <div className="p-5 pb-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00ff88]/15 to-emerald-600/15 border border-[#00ff88]/20 flex items-center justify-center text-lg flex-shrink-0">
              {room.cropIcon}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate leading-tight">{room.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-gray-500 font-mono">{room.id}</span>
                <span className="text-gray-700">•</span>
                <span className="text-[10px] text-gray-500">{room.zone}</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <StatusDot status={room.status} />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              room.status === 'online' ? 'text-[#00ff88]' :
              room.status === 'alert' ? 'text-amber-400' : 'text-gray-500'
            }`}>
              {room.status}
            </span>
          </div>
        </div>

        {/* Crop & Growth Stage */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-300 font-medium">{room.crop}</span>
          </div>
          <GrowthStageBadge stage={room.growthStage} />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="px-5 pb-4">
        <div className="grid grid-cols-2 gap-2">
          <MetricPill icon={Thermometer} label="Temp" value={isOffline ? '--' : room.metrics.temperature} unit={isOffline ? '' : '°C'} />
          <MetricPill icon={Droplets} label="Humidity" value={isOffline ? '--' : room.metrics.humidity} unit={isOffline ? '' : '%'} />
          <MetricPill icon={FlaskConical} label="Soil pH" value={isOffline ? '--' : room.metrics.soilPh} unit={isOffline ? '' : 'pH'} />
          <MetricPill icon={Sun} label="Light" value={isOffline ? '--' : room.metrics.light} unit={isOffline ? '' : 'Lux'} />
        </div>
      </div>

      {/* Sparkline Chart */}
      {!isOffline && (
        <div className="px-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Temperature Trend (12h)</span>
            <span className={`text-[10px] font-bold flex items-center gap-0.5 ${room.tempChange >= 0 ? 'text-[#00ff88]' : 'text-rose-400'}`}>
              {room.tempChange >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {room.tempChange >= 0 ? '+' : ''}{room.tempChange}%
            </span>
          </div>
          <div className="h-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={room.sparkTemp}>
                <defs>
                  <linearGradient id={`grad-${room.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isAlert ? '#f59e0b' : '#00ff88'} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={isAlert ? '#f59e0b' : '#00ff88'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={isAlert ? '#f59e0b' : '#00ff88'}
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill={`url(#grad-${room.id})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Offline Overlay */}
      {isOffline && (
        <div className="px-5 py-4 flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-500">
            <WifiOff className="w-4 h-4" />
            <span className="text-xs font-medium">Sensor Disconnected</span>
          </div>
        </div>
      )}

      {/* Health Bar */}
      <div className="px-5 pt-3 pb-4">
        <HealthBar health={room.health} />
      </div>

      {/* Card Footer */}
      <div className="mt-auto border-t border-slate-800/60 px-5 py-3 flex items-center justify-between bg-[#0a0f1a]/30">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-500">
            <span className="text-gray-400 font-medium">{room.daysActive}</span> days active
          </span>
          <span className="text-gray-700">•</span>
          <span className="text-[10px] text-gray-500">
            Synced <span className="text-gray-400 font-medium">{formatTimeAgo(room.lastSync)}</span>
          </span>
        </div>
        <Link
          to={`/room/${room.id}`}
          className="flex items-center gap-1.5 text-[11px] font-bold text-[#00ff88] hover:text-white bg-[#00ff88]/5 hover:bg-[#00ff88]/15 border border-[#00ff88]/20 hover:border-[#00ff88]/40 px-3 py-1.5 rounded-lg transition-all duration-200"
        >
          <Eye className="w-3 h-3" />
          Details
        </Link>
      </div>
    </div>
  );
};

export default GrowRoomCard;
