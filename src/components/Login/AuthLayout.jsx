import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function AuthLayout({ children, mode, setMode }) {
  const footerLinks = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Security Architecture", href: "#" },
    { label: "Contact Support", href: "#" },
  ];

  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: "#040F18" }}
    >
      {/* Texture overlay simulating the faint tech lines/circuit in the background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, #0B1C2E 0%, #040F18 100%)",
          opacity: 0.6
        }}
      />
      {/* Subtle vertical lines seen in the reference image */}
      <div className="fixed inset-y-0 left-[20%] w-px bg-[#53E97F]/[0.03] z-0 pointer-events-none hidden lg:block" />
      <div className="fixed inset-y-0 right-[20%] w-px bg-[#53E97F]/[0.03] z-0 pointer-events-none hidden lg:block" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 lg:px-16 h-24 bg-transparent">
        <Link to="/" className="flex items-center gap-2 text-[#53E97F] font-bold text-[18px] tracking-wide hover:text-[#79F29A] transition-colors">
          <img src={logo} alt="कृषीDristi Logo" className="h-9 w-auto object-contain" />
          कृषीDristi
        </Link>
        
        <div className="hidden md:flex items-center space-x-10 mt-1">
          {[
            { label: "Platform", href: "#" },
            { label: "Solutions", href: "#" },
            { label: "Resources", href: "#" },
          ].map((l) => (
            <a key={l.label} href={l.href} className="text-[14px] font-medium text-[#A1AEB7] hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
          <button
            onClick={() => setMode("login")}
            className={`text-[14px] font-medium transition-all pb-[6px] ${
              mode === "login" 
                ? "text-[#53E97F] border-b-[2px] border-[#53E97F]" 
                : "text-[#A1AEB7] hover:text-white"
            }`}
          >
            Login
          </button>
        </div>
        
        <a href="#" className="text-[14px] font-medium text-[#53E97F] hover:text-[#79F29A] transition-colors">
          Support
        </a>
      </nav>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px] transition-all duration-300 ease-in-out">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-8 lg:px-16 py-10">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-[15px] tracking-wide">
            <img src={logo} alt="कृषीDristi Logo" className="h-7 w-auto object-contain" />
            कृषीDristi
          </Link>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {footerLinks.map((l) => (
              <a key={l.label} href={l.href} className="font-mono text-[12px] text-[#A1AEB7] hover:text-white transition-colors tracking-wide">
                {l.label}
              </a>
            ))}
          </div>
          
          <p className="font-mono text-[12px] text-[#6E808D] tracking-wide">
            © 2024 कृषीDristi. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
