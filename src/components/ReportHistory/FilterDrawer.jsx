import { Filter, X } from 'lucide-react';

export default function FilterDrawer({
  isOpen,
  filterType,
  filterSort,
  onFilterTypeChange,
  onFilterSortChange,
  onClose,
  onApply,
  onReset,
}) {
  return (
    <div
      className={`drawer-overlay${isOpen ? ' active' : ''}`}
      id="filter-drawer-overlay"
      onClick={(e) => {
        if (e.target.id === 'filter-drawer-overlay') onClose();
      }}
    >
      <div className="drawer-panel">
        <div className="drawer-header">
          <h3 className="drawer-title">
            <Filter size={18} strokeWidth={1.75} color="var(--accent-green)" style={{ verticalAlign: 'middle', marginRight: 8 }} />
            Filter System
          </h3>
          <button className="modal-close-btn" id="btn-close-filter" aria-label="Close panel" onClick={onClose}>
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="filter-report-type">Report Type</label>
          <select
            className="form-select"
            id="filter-report-type"
            value={filterType}
            onChange={(e) => onFilterTypeChange(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="efficiency">Efficiency</option>
            <option value="projection">Projection</option>
            <option value="incident">Incident</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="filter-report-sort">Sort By</label>
          <select
            className="form-select"
            id="filter-report-sort"
            value={filterSort}
            onChange={(e) => onFilterSortChange(e.target.value)}
          >
            <option value="newest">Date: Newest First</option>
            <option value="oldest">Date: Oldest First</option>
            <option value="alphabetical">Name: A-Z</option>
          </select>
        </div>

        <button
          className="btn-primary"
          id="btn-apply-filters"
          style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
          onClick={onApply}
        >
          Apply Filter Settings
        </button>
        <button
          className="btn-outline"
          id="btn-reset-filters"
          style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--border)' }}
          onClick={onReset}
        >
          Reset Filter Settings
        </button>
      </div>
    </div>
  );
}
