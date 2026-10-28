export default function FeatureHighlights() {
  const features = [
    {
      tag: "MONITORING",
      title: "Real-Time Sensor Intelligence",
      description:
        "Live dashboards for temperature, humidity, CO₂, and soil moisture across all grow rooms. Configurable threshold alerts with millisecond latency.",
      icon: (
        <svg className="w-6 h-6 text-[#53E97F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      tag: "AUTOMATION",
      title: "Smart Equipment Control",
      description:
        "Remote management of irrigation, lighting, ventilation, and nutrient dosing. Schedule automations or trigger via sensor conditions.",
      icon: (
        <svg className="w-6 h-6 text-[#53E97F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      tag: "SECURITY",
      title: "Enterprise Alerts & Safety",
      description:
        "Multi-channel notifications via in-app, email, and SMS when critical thresholds are breached. Full audit trails for compliance.",
      icon: (
        <svg className="w-6 h-6 text-[#53E97F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      tag: "ANALYTICS",
      title: "Historical Reports & Insights",
      description:
        "Export crop cycle reports, water usage analytics, and yield optimizations. Configurable date ranges with CSV/PDF output.",
      icon: (
        <svg className="w-6 h-6 text-[#53E97F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="features" className="relative py-32 scroll-mt-16 bg-[#040F18]">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="font-mono text-[#53E97F] text-[11px] font-medium tracking-[0.2em] uppercase">Platform Capabilities</span>
          <h2 className="mt-4 text-[36px] md:text-[44px] font-bold text-white tracking-tight">
            Enterprise-grade tools for modern agriculture
          </h2>
          <p className="mt-6 text-[#A1AEB7] text-[18px] max-w-2xl mx-auto leading-relaxed">
            Built for scale — from single greenhouse operations to multi-site agri-enterprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="group bg-[#101B27] border border-[#1E2B38] hover:border-[#53E97F]/40 rounded-xl p-[34px] transition-all duration-300 shadow-xl shadow-black/20"
            >
              <div className="flex items-start gap-6">
                <div className="shrink-0 w-14 h-14 bg-[#070F16] rounded-lg flex items-center justify-center border border-[#1E2B38] group-hover:border-[#53E97F]/30 transition-colors">
                  {f.icon}
                </div>
                <div>
                  <span className="font-mono text-[10px] font-medium tracking-[0.15em] text-[#A1AEB7] uppercase">{f.tag}</span>
                  <h3 className="mt-2 text-[20px] font-bold text-white">{f.title}</h3>
                  <p className="mt-3 text-[15px] text-[#8697A6] leading-relaxed">{f.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
