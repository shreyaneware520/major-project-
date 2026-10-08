import { File, Eye, Download, Edit3, Share2, FolderOpen } from 'lucide-react';

function ReportIcon() {
  return <File size={16} strokeWidth={1.75} />;
}

function formatDate(dateStr) {
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', dateOptions);
}

export default function ReportsTable({ reports, onView, onDownload, onEdit, onViewAll }) {
  return (
    <article className="dashboard-card reports-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <h2 className="card-title">
            <FolderOpen size={18} strokeWidth={1.75} color="var(--accent-green)" />
            Generated Reports
          </h2>
          <span className="card-subtitle">Overview of agricultural metrics and audits</span>
        </div>
        <span className="badge-count" id="report-total-count">{reports.length} Total</span>
      </div>

      <div className="table-wrapper">
        <table className="reports-table" id="reports-table">
          <thead>
            <tr>
              <th>
                <span className="th-icon-label">
                  <File size={11} strokeWidth={2} style={{ opacity: 0.7 }} />
                  Report Name
                </span>
              </th>
              <th>
                <span className="th-icon-label">
                  <span style={{ fontSize: '11px', opacity: 0.7 }}>📅</span>
                  Date
                </span>
              </th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="reports-table-body">
            {reports.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: 'var(--muted-text)', padding: '32px 16px' }}>
                  No reports found matching current filters.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id} data-type={report.type} data-name={report.name}>
                  <td>
                    <div className="report-name-cell">
                      <div className="report-icon">
                        <ReportIcon />
                      </div>
                      <span>{report.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="report-date">
                      {formatDate(report.date)}
                      <span>{report.time}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${report.type}`}>{report.type}</span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="action-icon-btn action-view"
                        title="View Report"
                        aria-label="View Report"
                        data-id={report.id}
                        onClick={() => onView(report)}
                      >
                        <Eye size={14} strokeWidth={2} />
                      </button>
                      <button
                        className="action-icon-btn action-download"
                        title="Download Report"
                        aria-label="Download Report"
                        data-id={report.id}
                        onClick={() => onDownload(report)}
                      >
                        <Download size={14} strokeWidth={2} />
                      </button>
                      <button
                        className="action-icon-btn action-share"
                        title="Share Report"
                        aria-label="Share Report"
                        data-id={report.id}
                        onClick={() => {}}
                      >
                        <Share2 size={14} strokeWidth={2} />
                      </button>
                      <button
                        className="action-icon-btn action-edit"
                        title="Edit Report"
                        aria-label="Edit Report"
                        data-id={report.id}
                        onClick={() => onEdit(report)}
                      >
                        <Edit3 size={14} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <a
        href="#"
        className="card-footer-link"
        id="view-all-reports-link"
        onClick={(e) => {
          e.preventDefault();
          onViewAll();
        }}
      >
        View All Historical Reports
      </a>
    </article>
  );
}
