import React, { useMemo } from 'react';
import { FileText, Thermometer, Sprout, HardDrive } from 'lucide-react';

const ReportStats = ({ reports = [] }) => {
  const stats = useMemo(() => {
    const totalCount = reports.length;
    const envCount = reports.filter((r) => r.type === 'Environmental').length;
    const harvestCount = reports.filter((r) => r.type === 'Harvest').length;

    let totalSizeMB = 0;
    reports.forEach((r) => {
      if (r.size) {
        const val = parseFloat(r.size);
        if (!isNaN(val)) {
          totalSizeMB += r.size.includes('KB') ? val / 1024 : val;
        }
      }
    });

    return {
      total: totalCount,
      environmental: envCount,
      harvest: harvestCount,
      storageUsed: `${totalSizeMB.toFixed(1)} MB`,
    };
  }, [reports]);

  const cards = [
    {
      title: 'Total Reports',
      value: stats.total,
      subtext: `${reports.filter((r) => r.status === 'Available').length} Active, ${reports.filter((r) => r.status === 'Archived').length} Archived`,
      icon: FileText,
      color: 'text-[#00ff88]',
      bgColor: 'bg-[#00ff88]/10',
      borderColor: 'border-[#00ff88]/20',
    },
    {
      title: 'Environmental Reports',
      value: stats.environmental,
      subtext: 'Telemetry & Microclimate profiles',
      icon: Thermometer,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
      borderColor: 'border-sky-500/20',
    },
    {
      title: 'Harvest Reports',
      value: stats.harvest,
      subtext: 'Yield & Efficiency analytics',
      icon: Sprout,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
    {
      title: 'Storage Used',
      value: stats.storageUsed,
      subtext: 'Registry PDF storage capacity',
      icon: HardDrive,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-[#131c2e] border border-slate-800/80 p-5 rounded-2xl shadow-lg flex items-center justify-between transition-all duration-300 hover:border-slate-700/80"
          >
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {card.title}
              </p>
              <h3 className="text-2xl font-black text-white mt-1 tracking-tight">
                {card.value}
              </h3>
              <p className="text-[11px] text-gray-500 mt-1 font-medium">
                {card.subtext}
              </p>
            </div>
            <div className={`p-3.5 rounded-xl border ${card.bgColor} ${card.borderColor} ${card.color} shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportStats;
