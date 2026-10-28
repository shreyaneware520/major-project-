import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Platform", href: "#features" },
    { label: "Solutions", href: "#features" },
    { label: "Resources", href: "#features" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#040F18]/90 backdrop-blur-md border-b border-[#1E2B38]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <Link
            to="/"
            className="flex items-center gap-2 text-[#53E97F] font-bold text-[18px] tracking-wide hover:text-[#79F29A] transition-colors shrink-0"
          >
            <img src={logo} alt="कृषीDristi Logo" className="h-9 w-auto object-contain" />
            कृषीDristi
          </Link>

          <div className="hidden md:flex items-center space-x-10 mt-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[14px] font-medium text-[#A1AEB7] hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/login"
              className={`text-[14px] font-medium transition-all pb-[6px] ${
                location.pathname === "/login"
                  ? "text-[#53E97F] border-b-[2px] border-[#53E97F]"
                  : "text-[#A1AEB7] hover:text-white"
              }`}
            >
              Login
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a
              href="#support"
              className="text-[14px] font-medium text-[#53E97F] hover:text-[#79F29A] transition-colors"
            >
              Support
            </a>
            <Link
              to="/login"
              className="text-[14px] font-bold px-5 py-2.5 rounded-lg bg-[#101B27] border border-[#1E2B38] text-[#53E97F] hover:bg-[#1E2B38] hover:text-[#79F29A] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#53E97F]/50 shadow-lg shadow-black/20"
            >
              Log In
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-[#A1AEB7] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#53E97F] rounded-md p-1.5"
            aria-label="Toggle mobile menu"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Toggle menu</span>
            {isOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#040F18] border-t border-[#1E2B38] px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-md text-[14px] font-medium text-[#A1AEB7] hover:text-white hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className={`block px-4 py-3 rounded-md text-[14px] font-medium ${
              location.pathname === "/login"
                ? "text-[#53E97F] bg-white/5"
                : "text-[#A1AEB7] hover:text-white hover:bg-white/5"
            }`}
          >
            Login
          </Link>
          <div className="px-4 pt-4 border-t border-[#1E2B38] mt-2">
            <a href="#support" className="text-[14px] font-medium text-[#53E97F]">Support</a>
          </div>
          <div className="px-4 pt-4">
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center text-[14px] font-bold px-4 py-3 rounded-lg bg-[#53E97F] text-[#040F18] hover:bg-[#79F29A] transition-all duration-200"
            >
              Log In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
