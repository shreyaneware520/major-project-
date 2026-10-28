import React, { useMemo } from 'react';
import { Layers, Activity, AlertTriangle, Thermometer } from 'lucide-react';
import { MOCK_GROW_ROOMS } from './growRoomData';

const StatCard = ({ icon: Icon, value, label, colorClass, glowColor }) => (
  <div className="bg-[#131c2e] border border-slate-800/80 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300">
    <div className={`p-3 ${colorClass} rounded-xl group-hover:scale-110 transition-transform`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="text-2xl font-bold text-white leading-none">{value}</h3>
      <p className="text-xs text-gray-400 mt-2 font-medium">{label}</p>
    </div>
    <div className={`absolute right-0 bottom-0 translate-y-3 translate-x-3 w-16 h-16 ${glowColor} rounded-full blur-xl`} />
  </div>
);

const GrowRoomStatsStrip = () => {
  const stats = useMemo(() => {
    const total = MOCK_GROW_ROOMS.length;
    const active = MOCK_GROW_ROOMS.filter(r => r.status === 'online').length;
    const alerts = MOCK_GROW_ROOMS.filter(
      r => r.status === 'alert' || r.health === 'Critical' || r.health === 'Needs Attention'
    ).length;
    const onlineRooms = MOCK_GROW_ROOMS.filter(r => r.status !== 'offline');
    const avgTemp = onlineRooms.reduce((sum, r) => sum + r.metrics.temperature, 0) / Math.max(1, onlineRooms.length);
    return { total, active, alerts, avgTemp: avgTemp.toFixed(1) };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard
        icon={Layers}
        value={stats.total}
        label="Total Grow Rooms"
        colorClass="bg-[#00ff88]/10 text-[#00ff88]"
        glowColor="bg-[#00ff88]/5"
      />
      <StatCard
        icon={Activity}
        value={stats.active}
        label="Active & Online"
        colorClass="bg-emerald-500/10 text-emerald-400"
        glowColor="bg-emerald-500/5"
      />
      <StatCard
        icon={AlertTriangle}
        value={stats.alerts}
        label="Needs Attention"
        colorClass="bg-amber-500/10 text-amber-400"
        glowColor="bg-amber-500/5"
      />
      <StatCard
        icon={Thermometer}
        value={`${stats.avgTemp}°C`}
        label="Avg. Temperature"
        colorClass="bg-blue-500/10 text-blue-400"
        glowColor="bg-blue-500/5"
      />
    </div>
  );
};

export default GrowRoomStatsStrip;
