import React, { useState } from 'react';
import { FileText, X, Loader2 } from 'lucide-react';
import { MOCK_GROW_ROOMS } from '../GrowRooms/growRoomData';
import { useToast } from '../../context/ToastContext';

const GenerateReportModal = ({ isOpen, onClose, onGenerate }) => {
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    room: MOCK_GROW_ROOMS[0]?.name || 'Hydroponics Alpha',
    type: 'Crop Health',
    dateRange: 'Today',
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      const formattedDate = new Date().toISOString().split('T')[0];
      const randomIdNumber = Math.floor(100 + Math.random() * 900);
      const generatedTitle = formData.name.trim() || `${formData.type} Report - ${formData.room}`;

      // Construct a full enterprise report object
      const newReport = {
        id: `REP-${new Date().getFullYear()}-${randomIdNumber}`,
        name: generatedTitle,
        type: formData.type,
        date: formattedDate,
        size: `${(1.5 + Math.random() * 4).toFixed(1)} MB`,
        format: 'PDF',
        room: formData.room,
        crop: formData.room.includes('Tomato') ? 'Cherry Tomatoes' : 'Romaine Lettuce',
        author: 'System Operator (You)',
        status: 'Available',
        summary: `Automated ${formData.type.toLowerCase()} telemetry report compiled for ${formData.room}. Data captured across ${formData.dateRange.toLowerCase()} interval with high sensor precision.`,
        readings: {
          temperature: `${(21 + Math.random() * 4).toFixed(1)} °C`,
          humidity: `${(60 + Math.random() * 10).toFixed(1)} %`,
          soilMoisture: `${(70 + Math.random() * 12).toFixed(1)} %`,
          soilPh: `${(6.0 + Math.random() * 0.6).toFixed(1)} pH`,
          lightIntensity: `${Math.floor(12000 + Math.random() * 5000).toLocaleString()} Lux`,
          waterFlow: `${(3.8 + Math.random() * 1.5).toFixed(1)} L/min`,
          airQuality: 'Optimal (AQI 16)',
        },
        cropAnalysis: {
          growthStage: 'Active Vegetative Phase',
          cropHealth: `${Math.floor(92 + Math.random() * 7)}% Optimal`,
          diseaseStatus: 'No Pathogens Detected',
          yieldPrediction: `${Math.floor(400 + Math.random() * 200)} kg Projected`,
          harvestReadiness: '14 Days Remaining',
        },
        recommendations: [
          `Maintain continuous telemetry polling across ${formData.room}.`,
          'Verify automated EC nutrient reservoir levels every 12 hours.',
          'Optimize light spectrum intensity to maintain peak photosynthetic active radiation.',
        ],
      };

      onGenerate(newReport);
      setIsGenerating(false);
      
      toast.success(
        'Report Generated Successfully',
        `Compiled "${generatedTitle}" for ${formData.room}.`
      );

      setFormData({
        name: '',
        room: MOCK_GROW_ROOMS[0]?.name || 'Hydroponics Alpha',
        type: 'Crop Health',
        dateRange: 'Today',
      });
      
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#0d1424] border border-slate-800 rounded-3xl w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.6)] overflow-hidden relative my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88]">
              <FileText className="w-5.5 h-5.5" />
            </div>
            <h3 className="text-xl font-bold text-white">Generate Farm Report</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="text-gray-400 hover:text-white p-2 bg-[#131c2e] hover:bg-slate-800 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Target Grow Room */}
          <div>
            <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
              Select Grow Room
            </label>
            <select
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              className="w-full bg-[#0a0f1a] text-sm text-white px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88] cursor-pointer"
            >
              {MOCK_GROW_ROOMS.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Report Type */}
          <div>
            <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
              Report Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-[#0a0f1a] text-sm text-white px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88] cursor-pointer"
            >
              <option value="Crop Health">Crop Health Report</option>
              <option value="Environmental">Environmental Monitoring Report</option>
              <option value="Harvest">Harvest Analysis Report</option>
              <option value="Irrigation">Irrigation Report</option>
              <option value="Hardware">Hardware Diagnostics Report</option>
              <option value="Monthly Summary">Monthly Farm Summary</option>
            </select>
          </div>

          {/* Date Range Selection */}
          <div>
            <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
              Date Range Interval
            </label>
            <select
              value={formData.dateRange}
              onChange={(e) => setFormData({ ...formData, dateRange: e.target.value })}
              className="w-full bg-[#0a0f1a] text-sm text-white px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88] cursor-pointer"
            >
              <option value="Today">Today (Live telemetry)</option>
              <option value="Last 7 Days">Last 7 Days (Average log)</option>
              <option value="Last 30 Days">Last 30 Days (Trend profile)</option>
              <option value="Custom Range">Custom Range (Full dataset)</option>
            </select>
          </div>

          {/* Optional Report Title */}
          <div>
            <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
              Report Title (Optional)
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Q3 Crop Yield & Microclimate Log"
              className="w-full bg-[#0a0f1a] text-sm text-white placeholder-gray-500 px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00ff88] transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="bg-[#131c2e] hover:bg-slate-800 border border-slate-800 text-gray-300 font-semibold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 bg-[#00ff88] hover:bg-[#00e67a] text-black font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] cursor-pointer disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Compiling Report...</span>
                </>
              ) : (
                <span>Generate Report</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateReportModal;
