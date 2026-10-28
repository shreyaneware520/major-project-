export default function BenefitsSection() {
  const benefits = [
    {
      title: "Improved Productivity",
      description: "Automate routine tasks and optimize resource usage, allowing your team to focus on high-value crop management.",
      icon: (
        <svg className="w-6 h-6 text-[#53E97F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      title: "Reduced Manual Effort",
      description: "Smart scheduling and remote controls eliminate the need for constant physical monitoring and manual adjustments.",
      icon: (
        <svg className="w-6 h-6 text-[#53E97F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Better Visibility",
      description: "Gain comprehensive insights into your farming operations with real-time data, historical trends, and centralized reporting.",
      icon: (
        <svg className="w-6 h-6 text-[#53E97F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    }
  ];

  return (
    <section id="benefits" className="relative py-32 bg-[#040F18] border-t border-[#1E2B38]">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="font-mono text-[#53E97F] text-[11px] font-medium tracking-[0.2em] uppercase">Core Benefits</span>
          <h2 className="mt-4 text-[36px] md:text-[44px] font-bold text-white tracking-tight">
            Why choose our system?
          </h2>
          <p className="mt-6 text-[#A1AEB7] text-[18px] max-w-2xl mx-auto leading-relaxed">
            Deliver measurable impact to your cultivation processes and bottom line.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((b, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-8 rounded-xl bg-[#101B27] border border-[#1E2B38] shadow-lg shadow-black/20">
              <div className="w-14 h-14 bg-[#070F16] rounded-full flex items-center justify-center border border-[#1E2B38] mb-6 shadow-inner">
                {b.icon}
              </div>
              <h3 className="text-[20px] font-bold text-white mb-4">{b.title}</h3>
              <p className="text-[15px] text-[#8697A6] leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
