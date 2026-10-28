import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Footer() {
  const year = new Date().getFullYear();

  const links = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Security Architecture", href: "#" },
    { label: "Contact Support", href: "#" },
  ];

  return (
    <footer className="relative z-10 px-8 lg:px-16 py-10 border-t border-[#1E2B38]" style={{ backgroundColor: "#040F18" }}>
      <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-[15px] tracking-wide hover:text-[#53E97F] transition-colors">
          <img src={logo} alt="कृषीDristi Logo" className="h-7 w-auto object-contain" />
          कृषीDristi
        </Link>
        
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="font-mono text-[12px] text-[#A1AEB7] hover:text-white transition-colors tracking-wide">
              {l.label}
            </a>
          ))}
        </div>
        
        <p className="font-mono text-[12px] text-[#6E808D] tracking-wide text-center lg:text-right">
          &copy; {year} कृषीDristi. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
