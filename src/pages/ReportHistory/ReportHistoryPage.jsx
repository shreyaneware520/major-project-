import { useState, useEffect, useMemo, useCallback } from 'react';
import AppLayout from '../../components/Dashboard/AppLayout';
import ToastContainer from '../../components/Dashboard/ToastContainer';
import PageHeader from '../../components/ReportHistory/PageHeader';
import YieldTrendCard from '../../components/ReportHistory/YieldTrendCard';
import ClimateDeviationCard from '../../components/ReportHistory/ClimateDeviationCard';
import ReportsTable from '../../components/ReportHistory/ReportsTable';
import SystemActivity from '../../components/ReportHistory/SystemActivity';
import AIRecommendations from '../../components/ReportHistory/AIRecommendations';
import FilterDrawer from '../../components/ReportHistory/FilterDrawer';
import NewReportModal from '../../components/ReportHistory/NewReportModal';
import { useToast } from '../../hooks/useToast';
import { initialReportsData, initialTimelineEvents } from '../../hooks/useReportHistoryData';

const viewToastMessages = {
  weekly: 'Switched View: Weekly Yield Metrics Loaded',
  monthly: 'Switched View: Monthly Yield Metrics Loaded',
  yearly: 'Switched View: Yearly Yield Metrics Loaded',
};

export default function ReportHistoryPage() {
  const { toasts, showToast } = useToast();

  const [reportsData, setReportsData] = useState(initialReportsData);
  const [currentView, setCurrentView] = useState('monthly');
  const [activeFilters, setActiveFilters] = useState({ search: '', type: 'all', sort: 'newest' });
  const [drawerFilterType, setDrawerFilterType] = useState('all');
  const [drawerFilterSort, setDrawerFilterSort] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('efficiency');
  const [reportDate, setReportDate] = useState('');
  const [timelineEvents, setTimelineEvents] = useState(initialTimelineEvents);
  const [syncMinutes, setSyncMinutes] = useState(2);
  const [deviationAvg, setDeviationAvg] = useState('0.4');
  const [hasNotification, setHasNotification] = useState(true);
  const [strategyApplied, setStrategyApplied] = useState(false);
  const [recommendationText, setRecommendationText] = useState(
    "Our proprietary ML model has analyzed your last 12 reports. Switch to nutrient protocol 'Delta-9' to potentially increase yield by 4.2%."
  );

  const filteredReports = useMemo(() => {
    let filtered = reportsData.filter((report) => {
      const matchesSearch = report.name.toLowerCase().includes(activeFilters.search.toLowerCase());
      const matchesType = activeFilters.type === 'all' || report.type === activeFilters.type;
      return matchesSearch && matchesType;
    });

    if (activeFilters.sort === 'newest') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (activeFilters.sort === 'oldest') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (activeFilters.sort === 'alphabetical') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [reportsData, activeFilters]);

  const prependTimelineEvent = useCallback((title, detail, meta, isAutomated = true) => {
    const newEvent = {
      id: Date.now(),
      title,
      badge: isAutomated ? 'automated' : 'manual',
      meta,
      time: 'Just Now',
      desc: detail,
      node: isAutomated ? 'success' : 'neutral',
      isAutomated,
    };
    setTimelineEvents((prev) => [newEvent, ...prev].slice(0, 5));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSyncMinutes((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDeviationAvg((0.35 + Math.random() * 0.1).toFixed(1));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleViewChange = (view) => {
    setCurrentView(view);
    showToast(viewToastMessages[view], 'success');
  };

  const handleSearchChange = (value) => {
    setActiveFilters((prev) => ({ ...prev, search: value.trim() }));
  };

  const handleOpenFilter = () => {
    setDrawerFilterType(activeFilters.type);
    setDrawerFilterSort(activeFilters.sort);
    setIsFilterOpen(true);
  };

  const handleApplyFilters = () => {
    setActiveFilters((prev) => ({ ...prev, type: drawerFilterType, sort: drawerFilterSort }));
    setIsFilterOpen(false);
    showToast('Filter settings applied successfully!', 'success');
  };

  const handleResetFilters = () => {
    setDrawerFilterType('all');
    setDrawerFilterSort('newest');
    setActiveFilters((prev) => ({ ...prev, type: 'all', sort: 'newest' }));
    setIsFilterOpen(false);
    showToast('Filters reset to default states.', 'info');
  };

  const handleOpenNewReport = () => {
    setReportDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();

    const name = reportName.trim().replace(/\s+/g, '_');
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const timeString = `${hours}:${minutes} ${ampm}`;

    const newReport = {
      id: Date.now(),
      name,
      date: reportDate,
      time: timeString,
      type: reportType,
    };

    setReportsData((prev) => [newReport, ...prev]);
    setIsModalOpen(false);
    setReportName('');
    showToast(`Generated Report: ${name} added to history`, 'success');
    prependTimelineEvent(
      'New Report Compiled',
      `Manual compilation of ${name} completed successfully.`,
      'System Compiler',
      false
    );
  };

  const handleViewReport = (report) => {
    showToast(`Opening read-only viewer for: ${report.name}`, 'info');
  };

  const handleDownloadReport = (report) => {
    showToast(`Starting download: ${report.name}.pdf ...`, 'info');
    setTimeout(() => {
      showToast(`Downloaded ${report.name}.pdf successfully!`, 'success');
    }, 1500);
  };

  const handleEditReport = () => {
    showToast('Report editing is restricted for current security level.', 'error');
  };

  const handleViewAllReports = () => {
    if (activeFilters.type !== 'all') {
      setActiveFilters((prev) => ({ ...prev, type: 'all' }));
      setDrawerFilterType('all');
      showToast('Clearing type filters to display all historical documents.', 'info');
    } else {
      showToast('Already displaying all historical records.', 'info');
    }
  };

  const handleApplyStrategy = () => {
    showToast('Applying Nutrient Strategy Delta-9 to core irrigation grids...', 'info');
    setTimeout(() => {
      showToast('Strategy Delta-9 deployed to Zone 4 grow rooms successfully!', 'success');
      prependTimelineEvent(
        'Nutrient Strategy Delta-9 Active',
        'System adjusted N-P-K concentration targets in Zone 4 greenhouses.',
        'AI Core Engine',
        true
      );
      setRecommendationText(
        '<strong>Strategy Delta-9 Active:</strong> Core irrigation grids calibrated. Yield estimation is updated. Switch to deep insight models to view ongoing telemetry adjustments.'
      );
      setStrategyApplied(true);
    }, 2000);
  };

  const handleDeepInsights = () => {
    showToast('Fetching neural prediction telemetry logs...', 'info');
    setTimeout(() => {
      setIsModalOpen(false);
      showToast('ML projection model predicts maximum yield surge by Aug 2026.', 'success');
    }, 1200);
  };

  return (
    <>
      <AppLayout
        syncTime={syncMinutes}
        searchValue={activeFilters.search}
        onSearchChange={handleSearchChange}
        hasNotification={hasNotification}
        onNotificationClick={() => {
          showToast('No new critical system notifications.', 'success');
          setHasNotification(false);
        }}
        onAvatarClick={() => showToast('Logged in as administrator: admin_j.doe', 'info')}
        onNavClick={(label) => showToast(`Navigated to ${label} module`, 'info')}
      >
        <main className="content-wrapper">
          <PageHeader
            currentView={currentView}
            onViewChange={handleViewChange}
            onOpenFilter={handleOpenFilter}
            onOpenNewReport={handleOpenNewReport}
          />

          <div className="grid-row-1">
            <YieldTrendCard currentView={currentView} />
            <ClimateDeviationCard
              deviationAvg={deviationAvg}
              onViewSensors={() => showToast('Opening IoT climate matrix sensors overview...', 'info')}
            />
          </div>

          <div className="grid-row-2">
            <ReportsTable
              reports={filteredReports}
              onView={handleViewReport}
              onDownload={handleDownloadReport}
              onEdit={handleEditReport}
              onViewAll={handleViewAllReports}
            />
            <SystemActivity
              events={timelineEvents}
              onDownloadAudit={() => {
                showToast('Compiling secure system audit logs (SHA-256)...', 'info');
                setTimeout(() => {
                  showToast('Audit log compiled. Downloaded audit_log_active.bin (142 KB)', 'success');
                }, 1500);
              }}
            />
          </div>

          <AIRecommendations
            recommendationText={recommendationText}
            strategyApplied={strategyApplied}
            onApplyStrategy={handleApplyStrategy}
            onDeepInsights={handleDeepInsights}
          />
        </main>
      </AppLayout>

      <FilterDrawer
        isOpen={isFilterOpen}
        filterType={drawerFilterType}
        filterSort={drawerFilterSort}
        onFilterTypeChange={setDrawerFilterType}
        onFilterSortChange={setDrawerFilterSort}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      <NewReportModal
        isOpen={isModalOpen}
        reportName={reportName}
        reportType={reportType}
        reportDate={reportDate}
        onReportNameChange={setReportName}
        onReportTypeChange={setReportType}
        onReportDateChange={setReportDate}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitReport}
      />

      <ToastContainer toasts={toasts} />
    </>
  );
}
