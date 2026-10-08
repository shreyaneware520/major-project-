import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { getYieldChartConfig } from '../../hooks/useReportHistoryData';
import { TrendingUp } from 'lucide-react';

export default function YieldTrendCard({ currentView }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current;
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, getYieldChartConfig(currentView));

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [currentView]);

  return (
    <article className="dashboard-card yield-analysis-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <h2 className="card-title">
            <TrendingUp size={18} strokeWidth={1.75} color="var(--accent-green)" />
            Yield Trend Analysis
          </h2>
          <span className="card-subtitle">Total biomass production (kg) vs. Energy input</span>
        </div>
        <div className="card-legend">
          <div className="legend-item">
            <span className="legend-color yield"></span>
            <span>Yield</span>
          </div>
          <div className="legend-item">
            <span className="legend-color power"></span>
            <span>Power</span>
          </div>
        </div>
      </div>
      <div className="chart-watermark">
        <TrendingUp size={48} strokeWidth={1} />
      </div>
      <div className="chart-container">
        <canvas id="yieldBarChart" ref={canvasRef}></canvas>
      </div>
    </article>
  );
}
