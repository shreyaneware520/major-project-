import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { getSparklineChartConfig } from '../../hooks/useReportHistoryData';
import { Thermometer, TrendingDown, Activity } from 'lucide-react';

export default function ClimateDeviationCard({ deviationAvg, onViewSensors }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current;
    if (!ctx) return;

    chartRef.current = new Chart(ctx, getSparklineChartConfig());

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  return (
    <article className="dashboard-card climate-deviation-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <h2 className="card-title">
            <Thermometer size={18} strokeWidth={1.75} color="var(--accent-green)" />
            Climate Deviation
          </h2>
          <span className="card-subtitle">Sensors reading average</span>
        </div>
      </div>

      <div className="metric-display">
        <span className="metric-value" id="deviation-avg">{deviationAvg} °C Avg</span>
        <div className="metric-trend negative" id="deviation-trend">
          <TrendingDown size={14} strokeWidth={2} />
          <span>12% reduction from last month</span>
        </div>
      </div>

      <div className="mini-chart-container">
        <canvas id="climateSparkline" ref={canvasRef}></canvas>
      </div>

      <button className="btn-card-action" id="btn-view-sensors" onClick={onViewSensors}>
        <Activity size={14} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
        View Detail Sensors
      </button>
    </article>
  );
}
