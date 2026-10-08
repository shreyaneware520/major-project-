import { Activity, ClipboardList, Droplets, Wind, CloudCheck, Sun, Download } from 'lucide-react';

// Map event titles to relevant Lucide icons for the timeline
function getEventIcon(title = '') {
  const t = title.toLowerCase();
  if (t.includes('irrigat')) return <Droplets size={10} strokeWidth={2.5} color="var(--accent-green)" />;
  if (t.includes('co2') || t.includes('override') || t.includes('wind')) return <Wind size={10} strokeWidth={2.5} color="var(--accent-green)" />;
  if (t.includes('cloud') || t.includes('sync')) return <CloudCheck size={10} strokeWidth={2.5} color="var(--accent-green)" />;
  if (t.includes('spectrum') || t.includes('shift') || t.includes('light') || t.includes('sun')) return <Sun size={10} strokeWidth={2.5} color="var(--accent-green)" />;
  return <Activity size={10} strokeWidth={2.5} color="var(--accent-green)" />;
}

export default function SystemActivity({ events, onDownloadAudit }) {
  return (
    <article className="dashboard-card activity-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <h2 className="card-title">
            <ClipboardList size={18} strokeWidth={1.75} color="var(--accent-green)" />
            System Activity
          </h2>
          <span className="card-subtitle">Real-time smart farming event logging</span>
        </div>
      </div>

      <div className="timeline" id="system-timeline">
        {events.map((event) => (
          <div key={event.id} className="timeline-item">
            <span className={`timeline-node ${event.node}`}>
              {event.node === 'success' && (
                <span className="timeline-node-icon">
                  {getEventIcon(event.title)}
                </span>
              )}
            </span>
            <div className="timeline-content">
              <div className="timeline-header-line">
                <span className="timeline-title">{event.title}</span>
                {event.badge && (
                  <span className={`timeline-badge ${event.badge}`}>
                    {event.badge === 'automated' ? 'Automated' : 'Manual Action'}
                  </span>
                )}
              </div>
              <div className="timeline-meta">
                <span>{event.meta}</span>
                <span className="timeline-time">{event.time}</span>
              </div>
              <p className="timeline-desc">{event.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-card-action" id="btn-download-audit" onClick={onDownloadAudit}>
        <Download size={14} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
        Download Audit Log
      </button>
    </article>
  );
}
