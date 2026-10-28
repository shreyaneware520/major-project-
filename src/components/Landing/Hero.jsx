import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Background gradients */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(circle at center, #0B1C2E 0%, #040F18 100%)",
        }}
      />
      <div className="absolute inset-y-0 left-[20%] w-px bg-[#53E97F]/[0.03] z-0 pointer-events-none hidden lg:block" />
      <div className="absolute inset-y-0 right-[20%] w-px bg-[#53E97F]/[0.03] z-0 pointer-events-none hidden lg:block" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center mt-10">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#53E97F]/30 bg-[#53E97F]/5 mb-8">
          <span className="w-2 h-2 bg-[#53E97F] rounded-full mr-2 animate-pulse" />
          <span className="text-[#53E97F] font-mono text-[11px] font-semibold tracking-widest uppercase">
            Next-Gen Agricultural Intelligence
          </span>
        </div>

        <h1 className="text-[48px] md:text-[56px] lg:text-[72px] font-bold text-white tracking-tight leading-tight mb-6">
          <span className="flex items-center justify-center gap-4 mb-2">
            <img src={logo} alt="कृषीDristi Logo" className="h-16 w-auto md:h-20 object-contain" />
          </span>
          <span className="text-[#53E97F]">कृषीDristi</span>
        </h1>
        <p className="text-[18px] md:text-[20px] text-[#A1AEB7] max-w-2xl mx-auto leading-relaxed mb-12">
          Enterprise-grade IoT monitoring, precision control, and real-time intelligence for your greenhouse ecosystem. Reduce waste, maximize yield.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <Link
            to="/login?mode=signup"
            className="bg-[#53E97F] hover:bg-[#79F29A] text-[#040F18] font-bold px-8 h-[54px] rounded-lg transition-all duration-200 text-[15px] tracking-wide flex items-center justify-center shadow-lg shadow-[#53E97F]/20"
          >
            Request Enterprise Access
          </Link>
          <Link
            to="/login"
            className="border border-[#1E2B38] bg-[#101B27] hover:border-[#53E97F]/40 text-white hover:text-[#53E97F] font-bold px-8 h-[54px] rounded-lg transition-all duration-200 text-[15px] flex items-center justify-center shadow-lg shadow-black/20"
          >
            Login to Dashboard
          </Link>
        </div>

        {/* Stats Bar */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1E2B38] rounded-xl overflow-hidden border border-[#1E2B38] shadow-2xl shadow-black/40">
          {[
            { label: "Active Grow Rooms", value: "2,400+" },
            { label: "Uptime SLA", value: "99.97%" },
            { label: "Data Points / Day", value: "18M+" },
            { label: "Enterprise Clients", value: "340+" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#101B27] px-6 py-8 text-center">
              <div className="text-[32px] font-bold text-[#53E97F] mb-2">{stat.value}</div>
              <div className="font-mono text-[11px] text-[#A1AEB7] uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
