import { X, FilePlus } from 'lucide-react';

export default function NewReportModal({
  isOpen,
  reportName,
  reportType,
  reportDate,
  onReportNameChange,
  onReportTypeChange,
  onReportDateChange,
  onClose,
  onSubmit,
}) {
  return (
    <div
      className={`modal-overlay${isOpen ? ' active' : ''}`}
      id="new-report-modal-overlay"
      onClick={(e) => {
        if (e.target.id === 'new-report-modal-overlay') onClose();
      }}
    >
      <div className="modal-card">
        <div className="modal-header">
          <h3 className="modal-title">
            <FilePlus size={20} strokeWidth={1.75} color="var(--accent-green)" style={{ verticalAlign: 'middle', marginRight: 8 }} />
            Create New Report
          </h3>
          <button className="modal-close-btn" id="btn-close-new-report" aria-label="Close modal" onClick={onClose}>
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <form id="new-report-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="report-name">Report Name</label>
            <input
              type="text"
              className="form-input"
              id="report-name"
              placeholder="e.g. Q4_Biomass_Prediction_V1"
              required
              value={reportName}
              onChange={(e) => onReportNameChange(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="report-type">Report Type</label>
            <select
              className="form-select"
              id="report-type"
              required
              value={reportType}
              onChange={(e) => onReportTypeChange(e.target.value)}
            >
              <option value="efficiency">Efficiency</option>
              <option value="projection">Projection</option>
              <option value="incident">Incident</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="report-date-input">Report Date</label>
            <input
              type="date"
              className="form-input"
              id="report-date-input"
              required
              value={reportDate}
              onChange={(e) => onReportDateChange(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-outline" id="btn-cancel-report" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" id="btn-submit-report">
              Generate Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
