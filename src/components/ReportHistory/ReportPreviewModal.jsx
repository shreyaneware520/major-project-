import React, { useEffect } from 'react';
import { X, Download, FileText, Calendar, User, Building2, Sprout, CheckCircle2 } from 'lucide-react';
import { generateReportPDF } from './ReportPDFGenerator';
import { useToast } from '../../context/ToastContext';

const ReportPreviewModal = ({ isOpen, onClose, report }) => {
  const toast = useToast();

  // Prevent underlying page scrolling while modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !report) return null;

  const handleDownload = () => {
    try {
      generateReportPDF(report);
      toast.success(
        'Report Downloaded',
        `Successfully generated and downloaded ${report.name || 'report'}.`
      );
    } catch (err) {
      console.error('PDF Generation Error:', err);
      toast.error('Download Failed', 'Unable to generate PDF report. Please try again.');
    }
  };

  const readings = report.readings || {
    temperature: '23.4 °C',
    humidity: '68.2 %',
    soilMoisture: '74.5 %',
    soilPh: '6.4 pH',
    lightIntensity: '14,200 Lux',
    waterFlow: '4.2 L/min',
    airQuality: 'Optimal (AQI 18)',
  };

  const cropAnalysis = report.cropAnalysis || {
    growthStage: 'Vegetative (Week 4 of 6)',
    cropHealth: '96% Optimal',
    diseaseStatus: 'No Pathogens Detected',
    yieldPrediction: '480 kg projected harvest',
    harvestReadiness: '12 Days Remaining',
  };

  const recommendations = report.recommendations || [
    'Maintain target automated irrigation schedule (4.2 L/min duty cycle).',
    'Slightly increase Red-spectrum LED lighting by 5% during peak photosynthetic hours.',
    'Monitor relative humidity thresholds every 2 hours to prevent tip-burn.',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-4 overflow-hidden">
      {/* Modal Dialog Container: Fixed height 84vh, max 85vh */}
      <div className="bg-[#0d1424] border border-slate-800 rounded-2xl w-full max-w-4xl h-full sm:h-[84vh] max-h-[85vh] shadow-[0_0_50px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Accent Line */}
        <div className="shrink-0 h-1 bg-gradient-to-r from-[#00ff88] via-emerald-400 to-sky-400" />

        {/* 1. FIXED HEADER (Never Scrolls) */}
        <div className="shrink-0 px-5 py-3.5 border-b border-slate-800/80 flex items-center justify-between gap-4 bg-[#0d1424]">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="p-2.5 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className="font-mono text-[11px] text-[#00ff88] font-bold bg-[#00ff88]/10 px-2 py-0.5 rounded border border-[#00ff88]/20">
                  {report.id}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-gray-300 border border-slate-700">
                  {report.type}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {report.status || 'Available'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight truncate">
                {report.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 bg-[#131c2e] hover:bg-slate-800 rounded-xl border border-slate-800 transition-all cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. SCROLLABLE BODY CONTENT */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 custom-scrollbar text-xs">
          
          {/* Compact Metadata Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#131c2e] p-3 rounded-xl border border-slate-800/80">
            <div>
              <span className="text-gray-500 text-[10px] uppercase font-semibold block mb-0.5">Grow Room</span>
              <span className="text-white font-bold flex items-center gap-1.5 truncate">
                <Building2 className="w-3.5 h-3.5 text-[#00ff88] shrink-0" />
                {report.room}
              </span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] uppercase font-semibold block mb-0.5">Target Crop</span>
              <span className="text-white font-bold flex items-center gap-1.5 truncate">
                <Sprout className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                {report.crop || 'Romaine Lettuce'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] uppercase font-semibold block mb-0.5">Date Generated</span>
              <span className="text-white font-bold flex items-center gap-1.5 truncate">
                <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                {report.date}
              </span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] uppercase font-semibold block mb-0.5">Author</span>
              <span className="text-white font-bold flex items-center gap-1.5 truncate">
                <User className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                {report.author}
              </span>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">
              Executive Summary
            </h4>
            <div className="bg-[#0a0f1a] p-3 rounded-xl border border-slate-800/80 text-gray-300 leading-relaxed font-medium">
              {report.summary}
            </div>
          </div>

          {/* Section 2: Environmental Telemetry Grid (2 rows x 4 columns) */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">
              Environmental Telemetry Readings
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {Object.entries(readings).map(([key, val]) => (
                <div key={key} className="bg-[#131c2e] p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold block capitalize truncate">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="text-xs font-bold text-[#00ff88] mt-0.5 block truncate">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Crop Analysis */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">
              Crop Condition & Yield Prediction
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="bg-[#131c2e] p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-gray-400">Growth Stage</span>
                <span className="font-bold text-white">{cropAnalysis.growthStage}</span>
              </div>
              <div className="bg-[#131c2e] p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-gray-400">Crop Health Index</span>
                <span className="font-bold text-[#00ff88]">{cropAnalysis.cropHealth}</span>
              </div>
              <div className="bg-[#131c2e] p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-gray-400">Pathogen Status</span>
                <span className="font-bold text-emerald-400">{cropAnalysis.diseaseStatus}</span>
              </div>
              <div className="bg-[#131c2e] p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-gray-400">Yield Prediction</span>
                <span className="font-bold text-sky-400">{cropAnalysis.yieldPrediction}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Recommendations */}
          <div>
            <h4 className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">
              Agronomist Action Recommendations
            </h4>
            <div className="bg-[#0a0f1a] p-3 rounded-xl border border-slate-800/80 space-y-2">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 text-gray-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff88] shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. FIXED FOOTER (Never Scrolls) */}
        <div className="shrink-0 px-5 py-3 border-t border-slate-800/80 bg-[#0d1424] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#131c2e] hover:bg-slate-800 border border-slate-800 text-gray-300 font-semibold text-xs transition-all cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#00ff88] hover:bg-[#00e67a] text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(0,255,136,0.2)] hover:shadow-[0_0_25px_rgba(0,255,136,0.4)] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPreviewModal;
