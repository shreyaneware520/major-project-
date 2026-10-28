import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden bg-[#040F18]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#53E97F]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-[#1E2B38] to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#53E97F]/30 bg-[#53E97F]/5 mb-10">
          <span className="w-2 h-2 bg-[#53E97F] rounded-full mr-2 animate-pulse" />
          <span className="font-mono text-[#53E97F] text-[11px] font-medium tracking-widest uppercase">
            Secure Enterprise Access
          </span>
        </div>

        <h2 className="text-[44px] md:text-[56px] font-bold text-white tracking-tight leading-tight mb-8">
          Ready to modernize <br className="hidden md:block" />
          <span className="text-[#53E97F]">your operations?</span>
        </h2>
        <p className="text-[#A1AEB7] text-[18px] max-w-2xl mx-auto mb-14 leading-relaxed">
          Join hundreds of greenhouse operators using कृषीDristi to automate, monitor, and scale their cultivation operations with confidence.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <Link
            to="/login?mode=signup"
            className="bg-[#53E97F] hover:bg-[#79F29A] text-[#040F18] font-bold px-8 h-[54px] rounded-lg transition-all duration-200 text-[15px] tracking-wide flex items-center justify-center shadow-lg shadow-[#53E97F]/20"
          >
            Create New Account
          </Link>
          <Link
            to="/login"
            className="border border-[#1E2B38] bg-[#101B27] hover:border-[#53E97F]/40 text-white hover:text-[#53E97F] font-bold px-8 h-[54px] rounded-lg transition-all duration-200 text-[15px] flex items-center justify-center shadow-lg shadow-black/20"
          >
            Existing User? Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}
