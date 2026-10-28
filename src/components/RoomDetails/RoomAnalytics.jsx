import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { BarChart3, Download } from 'lucide-react';
import { generateChartHistory } from './roomDetailData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a0f1a] border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1">
        <p className="font-semibold text-gray-300 border-b border-slate-800 pb-1 mb-1">{`Time: ${label}`}</p>
        <p className="text-[#00ff88] font-medium">{`Temperature: ${payload[0].value} °C`}</p>
        {payload[1] && <p className="text-blue-400 font-medium">{`Humidity Index: ${payload[1].value}%`}</p>}
      </div>
    );
  }
  return null;
};

const RoomAnalytics = ({ room }) => {
  const isOffline = room.status === 'offline';
  const [metricTab, setMetricTab] = useState('temp_hum'); // temp_hum, light, moisture

  // Generate historical data based on the room's metrics
  const chartData = React.useMemo(() => {
    const baseTemp = isOffline ? 22 : (room?.metrics?.temperature ?? 24);
    const baseHumidity = isOffline ? 60 : (room?.metrics?.humidity ?? 65);
    return generateChartHistory(baseTemp, baseHumidity);
  }, [room, isOffline]);

  if (isOffline) {
    return (
      <div className="bg-[#131c2e] border border-slate-800/80 p-6 rounded-2xl shadow-lg flex items-center justify-center min-h-[350px]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-slate-800/60 rounded-full flex items-center justify-center mx-auto text-gray-500">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-400">Analytics Unavailable</h3>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            This room's sensor is currently disconnected. Live data logging is paused.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#131c2e] border border-slate-800/80 p-6 rounded-2xl shadow-lg flex flex-col justify-between h-full">
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#00ff88]" />
            <h3 className="text-lg font-bold text-white tracking-wide">Environmental Analytics (24h)</h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Historical telemetry profile for {room.name}</p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          <div className="flex bg-[#0a0f1a] p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setMetricTab('temp_hum')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                metricTab === 'temp_hum' ? 'bg-[#00ff88]/10 text-[#00ff88]' : 'text-gray-400 hover:text-white'
              }`}
            >
              Temp & Hum
            </button>
            <button
              onClick={() => setMetricTab('light')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                metricTab === 'light' ? 'bg-[#00ff88]/10 text-[#00ff88]' : 'text-gray-400 hover:text-white'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => setMetricTab('moisture')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                metricTab === 'moisture' ? 'bg-[#00ff88]/10 text-[#00ff88]' : 'text-gray-400 hover:text-white'
              }`}
            >
              Moisture
            </button>
          </div>
          <button className="p-2 bg-[#0a0f1a] hover:bg-slate-800 text-gray-400 hover:text-white rounded-lg border border-slate-800 transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Area Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="neonGreenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00ff88" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#00ff88" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={{ stroke: '#334155' }} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
            
            {metricTab === 'temp_hum' && (
              <>
                <Area type="monotone" dataKey="temperature" name="Temperature" stroke="#00ff88" strokeWidth={2} fillOpacity={1} fill="url(#neonGreenGrad)" />
                <Area type="monotone" dataKey="humidity" name="Humidity" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#blueGrad)" />
              </>
            )}
            {metricTab === 'light' && (
              <Area type="monotone" dataKey="light" name="Light Intensity" stroke="#eab308" strokeWidth={2} fillOpacity={1} fill="url(#neonGreenGrad)" />
            )}
            {metricTab === 'moisture' && (
              <Area type="monotone" dataKey="moisture" name="Soil Moisture" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#blueGrad)" />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RoomAnalytics;
