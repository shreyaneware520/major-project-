import { CalendarRange, Filter, Plus, FileText } from 'lucide-react';

export default function PageHeader({
  currentView,
  onViewChange,
  onOpenFilter,
  onOpenNewReport,
}) {
  return (
    <section className="page-header">
      <div className="page-title-group">
        <h1 className="page-title">
          <FileText size={26} strokeWidth={1.75} color="var(--accent-green)" style={{ verticalAlign: 'middle', marginRight: 10 }} />
          Reports &amp; History
        </h1>
        <p className="page-subtitle">Analyze crop performance and system efficiency over time.</p>
      </div>

      <div className="page-header-controls">
        <div className="btn-group">
          <button
            className={`btn-tab${currentView === 'weekly' ? ' active' : ''}`}
            id="btn-weekly"
            onClick={() => onViewChange('weekly')}
          >
            <CalendarRange size={12} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            Weekly
          </button>
          <button
            className={`btn-tab${currentView === 'monthly' ? ' active' : ''}`}
            id="btn-monthly"
            onClick={() => onViewChange('monthly')}
          >
            <CalendarRange size={12} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            Monthly
          </button>
          <button
            className={`btn-tab${currentView === 'yearly' ? ' active' : ''}`}
            id="btn-yearly"
            onClick={() => onViewChange('yearly')}
          >
            <CalendarRange size={12} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            Yearly
          </button>
        </div>
        <button className="btn-outline" id="btn-filter-system" onClick={onOpenFilter}>
          <Filter size={14} strokeWidth={2} />
          Filter System
        </button>
        <button className="btn-primary" id="btn-new-report" onClick={onOpenNewReport}>
          <Plus size={14} strokeWidth={3} />
          New Report
        </button>
      </div>
    </section>
  );
}
