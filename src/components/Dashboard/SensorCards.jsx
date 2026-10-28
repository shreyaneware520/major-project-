import React, { useMemo } from 'react';
import { Thermometer, Droplets, FlaskConical, Activity, Sun, Droplet, Battery, Cloud } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

// Metric Configurations with precise brand colors, unique trends, and thresholds
const METRIC_CONFIG = {
  temperature: {
    color: '#f59e0b', // Amber
    title: 'Temperature',
    unit: '°C',
    icon: Thermometer,
    range: { min: 20, max: 28 },
    timeHorizon: 'Last Hour',
    defaultTrend: [23.5, 23.8, 24.0, 24.2, 24.5, 24.8, 25.1, 25.4, 25.2, 25.0, 24.8, 25.2],
  },
  humidity_pe: {
    color: '#10b981', // Emerald
    title: 'Humidity',
    unit: '%',
    icon: Droplets,
    range: { min: 50, max: 75 },
    timeHorizon: 'Last 30 min',
    defaultTrend: [72.0, 71.5, 71.0, 70.2, 69.8, 69.4, 68.9, 68.5, 68.2, 68.5],
  },
  moisture_pe: {
    color: '#3b82f6', // Blue
    title: 'Ambient Moisture',
    unit: '%',
    icon: Cloud,
    range: { min: 40, max: 80 },
    timeHorizon: 'Last Hour',
    defaultTrend: [70.1, 70.8, 71.4, 72.0, 72.5, 72.3, 72.4, 72.6, 72.4],
  },
  soil_moisture: {
    color: '#06b6d4', // Cyan
    title: 'Soil Moisture',
    unit: '%',
    icon: Droplet,
    range: { min: 50, max: 75 },
    timeHorizon: 'Last Hour',
    defaultTrend: [64.0, 64.5, 65.2, 66.0, 67.1, 67.8, 68.0, 68.1],
  },
  soil_ph: {
    color: '#a855f7', // Purple
    title: 'Soil pH',
    unit: 'pH',
    icon: FlaskConical,
    range: { min: 5.8, max: 6.8 },
    timeHorizon: 'Last Hour',
    defaultTrend: [6.42, 6.41, 6.40, 6.40, 6.39, 6.40, 6.41, 6.40],
  },
  light_intensity: {
    color: '#eab308', // Yellow
    title: 'Light Intensity',
    unit: 'Lux',
    icon: Sun,
    range: { min: 400, max: 1200 },
    timeHorizon: 'Last Hour',
    defaultTrend: [780, 800, 815, 830, 840, 855, 860, 850],
  },
  water_flow_l: {
    color: '#3b82f6', // Indigo Blue
    title: 'Water Flow Rate',
    unit: 'L/min',
    icon: Activity,
    range: { min: 2.0, max: 8.0 },
    timeHorizon: 'Last Hour',
    defaultTrend: [3.8, 4.0, 4.1, 4.2, 4.1, 4.3, 4.2, 4.2],
  },
  battery_status: {
    color: '#10b981', // Green
    title: 'Sensor Battery',
    unit: '%',
    icon: Battery,
    range: { min: 20, max: 100 },
    timeHorizon: 'Battery Level',
    defaultTrend: [92, 91, 90, 89, 89, 88, 88, 88],
  },
};

const DEFAULT_METRIC_KEYS = [
  'temperature',
  'humidity_pe',
  'moisture_pe',
  'soil_moisture',
  'soil_ph',
  'light_intensity',
  'water_flow_l',
  'battery_status',
];

// Helper to determine status based on value relative to safe range
const getStatusBadge = (val, range) => {
  if (val === null || val === undefined || isNaN(val)) {
    return { label: 'Optimal', badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
  }
  if (val < range.min) {
    return { label: 'Below Min', badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
  }
  if (val > range.max) {
    return { label: 'Above Max', badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
  }
  return { label: 'Optimal', badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
};

// Helper for formatted time diff
const getTimeAgo = (timestamp) => {
  if (!timestamp) return 'Just now';
  try {
    const elapsedSeconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (elapsedSeconds < 5) return 'Just now';
    if (elapsedSeconds < 60) return `${elapsedSeconds}s ago`;
    const elapsedMins = Math.floor(elapsedSeconds / 60);
    if (elapsedMins < 60) return `${elapsedMins}m ago`;
    return `${Math.floor(elapsedMins / 60)}h ago`;
  } catch {
    return 'Recently';
  }
};

// High performance SVG Mini Sparkline component with smooth bezier curve path
const MiniSparkline = React.memo(({ data = [], color = '#00ff88', metricId }) => {
  if (!data || data.length < 2) {
    return <div className="h-10 w-full" />;
  }

  const width = 280;
  const height = 40;
  const padding = 4;

  const values = data.map((d) => (typeof d === 'number' ? d : parseFloat(d) || 0));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min === 0 ? 1 : max - min;

  const points = values.map((val, i) => {
    const x = padding + (i / (values.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return { x, y };
  });

  // Construct smooth cubic bezier SVG path
  let pathD = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const controlX = (current.x + next.x) / 2;
    pathD += ` C ${controlX},${current.y} ${controlX},${next.y} ${next.x},${next.y}`;
  }

  // Construct gradient area fill path under curve
  const areaD = `${pathD} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

  const gradientId = `sparkline-grad-${metricId}`;

  return (
    <div className="w-full h-10 overflow-hidden select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Gradient fill */}
        <path d={areaD} fill={`url(#${gradientId})`} />

        {/* Stroke Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Latest Data Point Pulsing Circle */}
        {points.length > 0 && (
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r="3"
            fill={color}
            className="animate-pulse"
          />
        )}
      </svg>
    </div>
  );
});

const SensorCards = React.memo(() => {
  const { telemetry, history } = useTelemetry();

  const cardsData = useMemo(() => {
    return DEFAULT_METRIC_KEYS.map((key) => {
      const config = METRIC_CONFIG[key] || {
        color: '#10b981',
        title: key,
        unit: '',
        icon: Activity,
        range: { min: 0, max: 100 },
        timeHorizon: 'Recent',
        defaultTrend: [10, 20, 30, 25, 35, 40],
      };

      const rawVal = telemetry?.[key];
      const numericVal = rawVal !== undefined && rawVal !== null ? parseFloat(rawVal) : null;
      const displayVal = numericVal !== null && !isNaN(numericVal) ? numericVal.toFixed(key === 'soil_ph' ? 2 : 1) : '--';

      // Build history trend series
      let historyReadings = [];
      if (history && history.length > 0) {
        historyReadings = history
          .slice()
          .reverse()
          .map((item) => (item[key] !== undefined ? parseFloat(item[key]) : null))
          .filter((v) => v !== null && !isNaN(v));
      }

      if (historyReadings.length < 2) {
        historyReadings = config.defaultTrend;
      }

      // Calculate percentage change compared to previous reading
      let pctChange = 0;
      if (historyReadings.length >= 2) {
        const prev = historyReadings[historyReadings.length - 2];
        const curr = historyReadings[historyReadings.length - 1];
        if (prev && prev !== 0) {
          pctChange = ((curr - prev) / prev) * 100;
        }
      }

      const status = getStatusBadge(numericVal, config.range);
      const updatedTimeAgo = getTimeAgo(telemetry?.values_updated_at);

      return {
        id: key,
        title: config.title,
        value: displayVal,
        unit: config.unit,
        color: config.color,
        Icon: config.icon,
        timeHorizon: config.timeHorizon,
        statusLabel: status.label,
        badgeClass: status.badgeClass,
        historyReadings,
        pctChange: pctChange.toFixed(1),
        updatedTimeAgo,
      };
    });
  }, [telemetry, history]);

  // TelemetryContext always initializes with cache or seed data, so telemetry is never null on render.

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {cardsData.map((sensor) => {
        const MetricIcon = sensor.Icon;
        const isPositivePct = parseFloat(sensor.pctChange) >= 0;

        return (
          <div
            key={sensor.id}
            className="group relative bg-[#0d1424]/90 backdrop-blur-md rounded-2xl p-4 md:p-5 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-200 shadow-lg hover:shadow-2xl overflow-hidden flex flex-col justify-between"
          >
            {/* Top Row: Metric Icon + Metric Title + Status Badge */}
            <div className="flex items-start justify-between gap-2 z-10">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/5 transition-transform duration-200 group-hover:scale-105"
                  style={{ backgroundColor: `${sensor.color}15`, color: sensor.color }}
                >
                  <MetricIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 tracking-wide uppercase font-sans">
                    {sensor.title}
                  </h3>
                  <span className="text-[10px] text-gray-500 font-medium">
                    {sensor.timeHorizon}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${sensor.badgeClass} uppercase tracking-wider shrink-0`}
              >
                {sensor.statusLabel}
              </span>
            </div>

            {/* Middle Row: Large Bold Value + Unit + Percentage Trend */}
            <div className="my-3 flex items-baseline justify-between z-10">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-mono">
                  {sensor.value}
                </span>
                <span className="text-xs md:text-sm font-semibold text-gray-400 font-sans">
                  {sensor.unit}
                </span>
              </div>

              {/* Trend Percentage Badge */}
              <div
                className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md flex items-center gap-0.5 ${isPositivePct
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-rose-500/10 text-rose-400'
                  }`}
              >
                <span>{isPositivePct ? '+' : ''}{sensor.pctChange}%</span>
              </div>
            </div>

            {/* Bottom Section: Sparkline Chart */}
            <div className="my-1 z-10">
              <MiniSparkline
                data={sensor.historyReadings}
                color={sensor.color}
                metricId={sensor.id}
              />
            </div>

            {/* Bottom Footer Row */}
            <div className="flex items-center justify-between text-[11px] font-medium text-gray-400 pt-3 border-t border-slate-800/60 z-10">
              <span className="text-gray-400 flex items-center gap-1.5 font-sans">
                {sensor.updatedTimeAgo}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse shadow-[0_0_8px_#00ff88]"></span>
                Live
              </span>
            </div>

            {/* Background Glow */}
            <div
              className="absolute right-0 bottom-0 translate-y-4 translate-x-4 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
              style={{ backgroundColor: sensor.color }}
            />
          </div>
        );
      })}
    </div>
  );
});

export default SensorCards;
