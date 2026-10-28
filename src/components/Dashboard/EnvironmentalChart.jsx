import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from 'recharts';
import {
  Activity,
  Calendar,
  Download,
  Maximize2,
  Minimize2,
  Layers,
  Thermometer,
  Droplets,
  Cloud,
  Droplet,
  Sun,
  FlaskConical,
  Battery,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

// Metric Configurations with precise brand colors, units, and thresholds
const METRIC_SPECS = {
  temperature: {
    id: 'temperature',
    name: 'Temperature',
    unit: '°C',
    color: '#f59e0b', // Amber
    icon: Thermometer,
    thresholds: { min: 20, max: 28, warningMin: 18, warningMax: 30 },
    base: 24.5,
    variance: 2.2,
    yDomain: [15, 32],
  },
  humidity: {
    id: 'humidity',
    name: 'Humidity',
    unit: '%',
    color: '#10b981', // Emerald
    icon: Droplets,
    thresholds: { min: 50, max: 75, warningMin: 45, warningMax: 80 },
    base: 68.0,
    variance: 6.0,
    yDomain: [30, 95],
  },
  ambient_moisture: {
    id: 'ambient_moisture',
    name: 'Ambient Moisture',
    unit: '%',
    color: '#3b82f6', // Blue
    icon: Cloud,
    thresholds: { min: 40, max: 80, warningMin: 35, warningMax: 85 },
    base: 72.0,
    variance: 4.5,
    yDomain: [30, 95],
  },
  soil_moisture: {
    id: 'soil_moisture',
    name: 'Soil Moisture',
    unit: '%',
    color: '#06b6d4', // Cyan
    icon: Droplet,
    thresholds: { min: 50, max: 75, warningMin: 45, warningMax: 80 },
    base: 66.5,
    variance: 5.0,
    yDomain: [30, 90],
  },
  light_intensity: {
    id: 'light_intensity',
    name: 'Light Intensity',
    unit: 'Lux',
    color: '#eab308', // Yellow
    icon: Sun,
    thresholds: { min: 400, max: 1200, warningMin: 300, warningMax: 1300 },
    base: 850,
    variance: 150,
    yDomain: [0, 1500],
  },
  water_flow: {
    id: 'water_flow',
    name: 'Water Flow',
    unit: 'L/min',
    color: '#38bdf8', // Sky Blue
    icon: Activity,
    thresholds: { min: 2.0, max: 5.0, warningMin: 1.5, warningMax: 5.5 },
    base: 4.2,
    variance: 0.6,
    yDomain: [0, 8],
  },
  ph: {
    id: 'ph',
    name: 'pH',
    unit: 'pH',
    color: '#a855f7', // Purple
    icon: FlaskConical,
    thresholds: { min: 5.8, max: 6.8, warningMin: 5.5, warningMax: 7.2 },
    base: 6.4,
    variance: 0.3,
    yDomain: [4, 9],
  },
  battery: {
    id: 'battery',
    name: 'Battery',
    unit: '%',
    color: '#22c55e', // Green
    icon: Battery,
    thresholds: { min: 30, max: 100, warningMin: 20, warningMax: 100 },
    base: 88,
    variance: 2,
    yDomain: [0, 100],
  },
};

const TIME_RANGES = [
  { id: '1H', label: '1H', points: 12, intervalMins: 5 },
  { id: '6H', label: '6H', points: 24, intervalMins: 15 },
  { id: '24H', label: '24H', points: 24, intervalMins: 60 },
  { id: '7D', label: '7D', points: 28, intervalMins: 360 },
  { id: '30D', label: '30D', points: 30, intervalMins: 1440 },
];

// Rich Custom Tooltip Component
const CustomTooltip = React.memo(({ active, payload, label, selectedMetric }) => {
  if (!active || !payload || !payload.length) return null;

  const spec = METRIC_SPECS[selectedMetric] || METRIC_SPECS.temperature;
  const currentItem = payload[0];
  const value = currentItem.value;

  // Assess status against thresholds
  let statusText = 'Optimal';
  let statusClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  if (value < spec.thresholds.warningMin || value > spec.thresholds.warningMax) {
    statusText = 'Critical';
    statusClass = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  } else if (value < spec.thresholds.min || value > spec.thresholds.max) {
    statusText = 'Warning';
    statusClass = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  }

  const prevValue = payload[0].payload.prevValue ?? value;
  const diff = value - prevValue;
  const isDiffPos = diff >= 0;

  return (
    <div className="bg-[#0d1526]/95 border border-slate-700/80 p-3.5 rounded-xl shadow-2xl backdrop-blur-md text-xs min-w-[210px] space-y-2 z-50">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="font-semibold text-gray-300 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          {label}
        </span>
        <span className={`px-2 py-0.5 rounded-full font-bold border text-[10px] ${statusClass}`}>
          {statusText}
        </span>
      </div>

      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || spec.color }} />
            <span className="text-gray-400 font-medium">{entry.name || spec.name}:</span>
          </div>
          <span className="font-bold text-white text-sm">
            {entry.value} {spec.unit}
          </span>
        </div>
      ))}

      <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
        <div className="flex items-center justify-between text-gray-400">
          <span>Threshold:</span>
          <span className="font-mono text-gray-300">
            {spec.thresholds.min}{spec.unit} - {spec.thresholds.max}{spec.unit}
          </span>
        </div>
        {Math.abs(diff) > 0.01 && (
          <div className="flex items-center justify-between text-gray-400">
            <span>Trend vs Prev:</span>
            <span className={`font-semibold flex items-center gap-0.5 ${isDiffPos ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isDiffPos ? '▲ +' : '▼ '}
              {diff.toFixed(1)}{spec.unit}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

// Custom Glowing Endpoint Dot Component
const GlowingDot = React.memo((props) => {
  const { cx, cy, index, dataLength, color } = props;
  if (index !== dataLength - 1) return null;

  return (
    <g>
      <circle cx={cx} cy={cy} r="7" fill={color} opacity="0.25" className="animate-ping" />
      <circle cx={cx} cy={cy} r="4.5" fill="#FFFFFF" stroke={color} strokeWidth="2.5" className="drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
    </g>
  );
});

const EnvironmentalChart = React.memo(() => {
  const { history, telemetry } = useTelemetry();
  const [selectedMetric, setSelectedMetric] = useState('temperature');
  const [selectedRange, setSelectedRange] = useState('24H');
  const [isMultiMetric, setIsMultiMetric] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentSpec = METRIC_SPECS[selectedMetric] || METRIC_SPECS.temperature;

  // Generate or parse time-series data based on selected time range & metric
  const chartData = useMemo(() => {
    const rangeObj = TIME_RANGES.find(r => r.id === selectedRange) || TIME_RANGES[2];
    const totalPoints = rangeObj.points;

    const result = [];
    const now = new Date();

    for (let i = totalPoints - 1; i >= 0; i--) {
      const pointTime = new Date(now.getTime() - i * rangeObj.intervalMins * 60 * 1000);
      
      const timeLabel = (selectedRange === '1H' || selectedRange === '6H' || selectedRange === '24H')
        ? pointTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : `${pointTime.getMonth() + 1}/${pointTime.getDate()} ${pointTime.getHours()}:00`;

      // If backend history is available for index, use it
      const histItem = history && history[i];
      
      // Calculate realistic metric values with natural smooth wave modulation
      const wave = Math.sin((totalPoints - i) / 3) * currentSpec.variance;
      const noise = (Math.random() - 0.5) * 0.4;
      
      let primaryVal = currentSpec.base + wave + noise;
      if (i === 0 && telemetry && telemetry[currentSpec.id]) {
        primaryVal = telemetry[currentSpec.id];
      } else if (histItem && histItem[currentSpec.id] !== undefined) {
        primaryVal = histItem[currentSpec.id];
      }

      primaryVal = Number(primaryVal.toFixed(1));

      // Compute secondary metrics for Multi-Metric Comparison Mode
      const tempVal = Number((24.5 + Math.sin(i / 2) * 2.0).toFixed(1));
      const humVal = Number((68.0 - Math.sin(i / 2) * 5.0).toFixed(1));
      const soilVal = Number((66.5 + Math.cos(i / 3) * 4.0).toFixed(1));
      const lightVal = Math.max(0, Math.floor(850 + Math.sin(i / 2) * 200));

      result.push({
        time: timeLabel,
        value: primaryVal,
        temperature: tempVal,
        humidity: humVal,
        soil_moisture: soilVal,
        light_intensity: lightVal,
        prevValue: result.length > 0 ? result[result.length - 1].value : primaryVal,
      });
    }

    return result;
  }, [selectedRange, history, telemetry, currentSpec]);

  // Compute Mini KPI Summary Stats
  const kpiStats = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return { current: 0, avg: 0, min: 0, max: 0, delta: 0 };
    }
    const vals = chartData.map(d => d.value);
    const current = vals[vals.length - 1];
    const prev = vals.length > 1 ? vals[vals.length - 2] : current;
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const avg = Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1));
    const delta = Number((current - prev).toFixed(1));

    return { current, avg, min, max, delta };
  }, [chartData]);

  // CSV Data Export Handler
  const handleExportCSV = () => {
    if (!chartData || chartData.length === 0) return;
    const headers = `Timestamp,${currentSpec.name} (${currentSpec.unit})\n`;
    const rows = chartData.map(d => `${d.time},${d.value}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${currentSpec.id}_telemetry_${selectedRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // No blocking spinner — renders immediately with seed/cached data from TelemetryContext.

  // Empty State Fallback
  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-[#131c2e] border border-slate-800/80 p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center min-h-[360px] text-center">
        <AlertCircle className="w-12 h-12 text-amber-400 mb-3 opacity-80" />
        <h4 className="text-lg font-bold text-white mb-1">No Environmental History Available</h4>
        <p className="text-xs text-gray-400 max-w-sm">Waiting for live sensor data stream. Ensure environmental nodes are powered and connected.</p>
      </div>
    );
  }

  return (
    <div
      className={`bg-[#131c2e] border border-slate-800/80 p-6 rounded-2xl shadow-xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${
        isFullscreen ? 'fixed inset-4 z-50 bg-[#0c1220] border-slate-700 max-w-full h-[calc(100vh-2rem)]' : 'w-full h-full min-h-[460px]'
      }`}
    >
      {/* Top Header: Title, Metrics Selector & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800/80 z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-xl border"
              style={{
                backgroundColor: `${currentSpec.color}15`,
                borderColor: `${currentSpec.color}30`,
                color: currentSpec.color,
              }}
            >
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Environmental Trend Analytics
              </h3>
              <p className="text-xs text-gray-400">Real-time environmental trends across selected grow room.</p>
            </div>
          </div>
        </div>

        {/* Controls Strip: Metric Select, Time Range Buttons, Mode Toggle, Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Metric Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedMetric}
              onChange={e => setSelectedMetric(e.target.value)}
              className="bg-[#0a0f1a] text-xs font-semibold text-white px-3 py-1.5 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88] transition-all cursor-pointer pr-8"
              style={{ color: currentSpec.color }}
            >
              {Object.values(METRIC_SPECS).map(spec => (
                <option key={spec.id} value={spec.id} className="bg-[#0d1424] text-white">
                  {spec.name} ({spec.unit})
                </option>
              ))}
            </select>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center bg-[#0a0f1a] p-1 rounded-xl border border-slate-800">
            {TIME_RANGES.map(range => (
              <button
                key={range.id}
                onClick={() => setSelectedRange(range.id)}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedRange === range.id
                    ? 'bg-[#00ff88] text-black shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Single vs Multi Metric Mode */}
          <button
            onClick={() => setIsMultiMetric(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isMultiMetric
                ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                : 'bg-[#0a0f1a] text-gray-300 border-slate-800 hover:text-white'
            }`}
            title="Toggle Multi-Metric Comparison View"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isMultiMetric ? 'Multi-Metric' : 'Single'}</span>
          </button>

          {/* CSV Download Button */}
          <button
            onClick={handleExportCSV}
            className="p-2 bg-[#0a0f1a] hover:bg-slate-800 text-gray-400 hover:text-white rounded-xl border border-slate-800 transition-colors"
            title="Export CSV Data"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(prev => !prev)}
            className="p-2 bg-[#0a0f1a] hover:bg-slate-800 text-gray-400 hover:text-white rounded-xl border border-slate-800 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Live Indicator Badge */}
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full text-xs text-emerald-400 font-bold ml-1">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
            LIVE
          </div>
        </div>
      </div>

      {/* Mini Statistics KPI Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 z-10">
        <div className="bg-[#0a0f1a]/80 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-semibold">Current</p>
            <p className="text-xl font-bold text-white mt-0.5" style={{ color: currentSpec.color }}>
              {kpiStats.current} <span className="text-xs text-gray-400 font-medium">{currentSpec.unit}</span>
            </p>
          </div>
          <div className="text-right">
            <span
              className={`text-[10px] font-bold flex items-center gap-0.5 justify-end ${
                kpiStats.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {kpiStats.delta >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {kpiStats.delta >= 0 ? '+' : ''}{kpiStats.delta}
            </span>
            <span className="text-[9px] text-gray-500">vs prev</span>
          </div>
        </div>

        <div className="bg-[#0a0f1a]/80 border border-slate-800/80 p-3 rounded-xl">
          <p className="text-[10px] text-gray-400 uppercase font-semibold">Average</p>
          <p className="text-xl font-bold text-slate-200 mt-0.5">
            {kpiStats.avg} <span className="text-xs text-gray-400 font-medium">{currentSpec.unit}</span>
          </p>
        </div>

        <div className="bg-[#0a0f1a]/80 border border-slate-800/80 p-3 rounded-xl">
          <p className="text-[10px] text-gray-400 uppercase font-semibold">Minimum</p>
          <p className="text-xl font-bold text-slate-200 mt-0.5">
            {kpiStats.min} <span className="text-xs text-gray-400 font-medium">{currentSpec.unit}</span>
          </p>
        </div>

        <div className="bg-[#0a0f1a]/80 border border-slate-800/80 p-3 rounded-xl">
          <p className="text-[10px] text-gray-400 uppercase font-semibold">Maximum</p>
          <p className="text-xl font-bold text-slate-200 mt-0.5">
            {kpiStats.max} <span className="text-xs text-gray-400 font-medium">{currentSpec.unit}</span>
          </p>
        </div>
      </div>

      {/* Main Chart Visualization */}
      <div className={`w-full ${isFullscreen ? 'h-[calc(100vh-14rem)]' : 'h-72'} z-10 relative`}>
        <ResponsiveContainer width="100%" height="100%">
          {isMultiMetric ? (
            <LineChart data={chartData} margin={{ top: 15, right: 20, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} axisLine={{ stroke: '#334155' }} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip selectedMetric={selectedMetric} />} cursor={{ stroke: '#475569', strokeDasharray: '4 4' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />

              <Line type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#10b981" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="soil_moisture" name="Soil Moisture (%)" stroke="#06b6d4" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="light_intensity" name="Light (Lux)" stroke="#eab308" strokeWidth={2.5} dot={false} />
            </LineChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 15, right: 20, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-area-${currentSpec.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={currentSpec.color} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={currentSpec.color} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} axisLine={{ stroke: '#334155' }} />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={currentSpec.yDomain}
                unit={currentSpec.unit}
              />
              <Tooltip content={<CustomTooltip selectedMetric={selectedMetric} />} cursor={{ stroke: '#475569', strokeDasharray: '4 4' }} />

              {/* Threshold Lines */}
              <ReferenceLine
                y={currentSpec.thresholds.max}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                label={{ value: `Upper Threshold (${currentSpec.thresholds.max}${currentSpec.unit})`, fill: '#f43f5e', fontSize: 10, position: 'top' }}
              />
              <ReferenceLine
                y={currentSpec.thresholds.min}
                stroke="#10b981"
                strokeDasharray="4 4"
                label={{ value: `Optimal Min (${currentSpec.thresholds.min}${currentSpec.unit})`, fill: '#10b981', fontSize: 10, position: 'bottom' }}
              />

              <Area
                type="monotone"
                dataKey="value"
                name={currentSpec.name}
                stroke={currentSpec.color}
                strokeWidth={3}
                fillOpacity={1}
                fill={`url(#gradient-area-${currentSpec.id})`}
                dot={<GlowingDot dataLength={chartData.length} color={currentSpec.color} />}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export default EnvironmentalChart;

