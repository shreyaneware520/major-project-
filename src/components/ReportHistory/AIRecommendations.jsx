import { Lightbulb, Sparkles } from 'lucide-react';

export default function AIRecommendations({
  recommendationText,
  strategyApplied,
  onApplyStrategy,
  onDeepInsights,
}) {
  return (
    <article className="dashboard-card ai-recommendation-card">
      <h2 className="ai-title">
        <Lightbulb size={22} strokeWidth={1.75} />
        Optimize Harvest Predictions
      </h2>
      <p className="ai-description" id="ai-recommendation-text" dangerouslySetInnerHTML={{ __html: recommendationText }} />
      <div className="ai-btn-group">
        <button
          className="btn-primary"
          id="btn-apply-strategy"
          onClick={onApplyStrategy}
          disabled={strategyApplied}
          style={strategyApplied ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
        >
          <Sparkles size={14} strokeWidth={2} />
          Apply Strategy
        </button>
        <button
          className="btn-outline"
          id="btn-deep-insights"
          style={{ color: 'var(--accent-green)', borderColor: 'rgba(82, 255, 123, 0.4)' }}
          onClick={onDeepInsights}
        >
          Deep Insights
        </button>
      </div>
    </article>
  );
}
