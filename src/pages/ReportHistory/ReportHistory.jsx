import React, { useState, useMemo } from 'react';
import {
  ReportHeader,
  ReportStats,
  ReportFilters,
  ReportList,
  GenerateReportModal,
  ReportPreviewModal,
  DeleteReportModal,
  generateReportPDF,
  MOCK_REPORTS,
} from '../../components/ReportHistory';
import { useToast } from '../../context/ToastContext';

const ReportHistory = () => {
  const toast = useToast();
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  // Modal States
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [previewReport, setPreviewReport] = useState(null);
  const [reportToDelete, setReportToDelete] = useState(null);

  // Filtered and Sorted Reports
  const filteredReports = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    const filtered = reports.filter((report) => {
      const matchesSearch =
        !query ||
        report.name.toLowerCase().includes(query) ||
        report.room.toLowerCase().includes(query) ||
        (report.crop && report.crop.toLowerCase().includes(query)) ||
        report.author.toLowerCase().includes(query) ||
        report.id.toLowerCase().includes(query);

      const matchesType = typeFilter === 'all' || report.type === typeFilter;

      return matchesSearch && matchesType;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [reports, searchQuery, typeFilter, sortOrder]);

  // Download Handler (vector PDF generation)
  const handleDownload = (report) => {
    try {
      generateReportPDF(report);
      toast.success(
        'Report Downloaded',
        `Successfully downloaded "${report.name}".`
      );
    } catch (err) {
      console.error('PDF generation error:', err);
      toast.error('Download Failed', 'Unable to download report. Please try again.');
    }
  };

  // Delete Handler Confirm Execution
  const handleConfirmDelete = () => {
    if (!reportToDelete) return;
    const targetName = reportToDelete.name;

    setReports((prev) => prev.filter((r) => r.id !== reportToDelete.id));
    setReportToDelete(null);

    toast.success(
      'Report Deleted',
      `"${targetName}" has been removed from the registry.`
    );
  };

  // Generate Report Handler
  const handleGenerateReport = (newReport) => {
    setReports((prev) => [newReport, ...prev]);
  };

  return (
    <>
      <main className="p-6 md:p-8 space-y-8 flex-1">
        {/* Page Header */}
        <ReportHeader onGenerateClick={() => setShowGenerateModal(true)} />

        {/* Dynamic Summary Stats Strip */}
        <ReportStats reports={reports} />

        {/* Search, Filter, & Sort Controls */}
        <ReportFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          totalCount={reports.length}
          filteredCount={filteredReports.length}
        />

        {/* Reports Grid List / Empty State */}
        <ReportList
          reports={filteredReports}
          onPreview={(rep) => setPreviewReport(rep)}
          onDownload={handleDownload}
          onDelete={(rep) => setReportToDelete(rep)}
          onGenerateClick={() => setShowGenerateModal(true)}
        />
      </main>

      {/* 1. Generate Report Modal */}
      <GenerateReportModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onGenerate={handleGenerateReport}
      />

      {/* 2. Full Report Preview Modal */}
      <ReportPreviewModal
        isOpen={!!previewReport}
        onClose={() => setPreviewReport(null)}
        report={previewReport}
      />

      {/* 3. Delete Confirmation Modal */}
      <DeleteReportModal
        isOpen={!!reportToDelete}
        onClose={() => setReportToDelete(null)}
        onConfirm={handleConfirmDelete}
        reportName={reportToDelete?.name}
      />
    </>
  );
};

export default ReportHistory;
