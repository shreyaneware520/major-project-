import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sprout,
  SlidersHorizontal,
  FileText,
  Settings2,
  ShieldCheck,
} from 'lucide-react';
import krishiLogo from '../../assets/logos/krishidristi_logo.png';

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={18} strokeWidth={1.75} />,
  },
  {
    to: '/grow-rooms',
    label: 'Grow Rooms',
    icon: <Sprout size={18} strokeWidth={1.75} />,
  },
  {
    to: '/controls',
    label: 'Controls',
    icon: <SlidersHorizontal size={18} strokeWidth={1.75} />,
  },
  {
    to: '/report-history',
    label: 'Reports',
    icon: <FileText size={18} strokeWidth={1.75} />,
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: <Settings2 size={18} strokeWidth={1.75} />,
  },
];

export default function Sidebar({ syncTime, onNavClick }) {
  return (
    <aside className="sidebar">
      <div className="logo-section">
        <a href="/" className="logo-title">
          <img src={krishiLogo} alt="कृषीDristi" className="logo-img" />
          <span>कृषी<span style={{ fontFamily: 'Outfit, sans-serif' }}>Dristi</span></span>
        </a>
        <span className="logo-subtitle">Enterprise Yield Management</span>
      </div>

      <nav className="nav-menu">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            onClick={() => onNavClick?.(item.label)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-status-card">
        <div className="status-header">
          <span className="status-indicator"></span>
          <ShieldCheck size={14} strokeWidth={2} color="var(--accent-green)" style={{ flexShrink: 0 }} />
          <span>System Stable</span>
        </div>
        <span className="status-time" id="status-sync-time">
          Last sync: {syncTime} mins ago
        </span>
      </div>
    </aside>
  );
}
