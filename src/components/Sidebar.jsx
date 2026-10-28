import React, { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Sprout,
  Sliders,
  FileText,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  X,
} from 'lucide-react';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { useLayout } from '../context/LayoutContext';
import LogoutConfirmModal from './common/LogoutConfirmModal';

const Tooltip = React.memo(({ children, text, show }) => {
  if (!show) return children;
  return (
    <div className="relative group/tooltip flex items-center justify-center">
      {children}
      <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#0d1526] text-white text-xs font-semibold rounded-lg shadow-xl border border-slate-700 whitespace-nowrap opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-50">
        {text}
      </div>
    </div>
  );
});

const Sidebar = React.memo(() => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const {
    isSidebarCollapsed,
    toggleSidebarCollapse,
    isDrawerOpen,
    closeDrawer,
  } = useLayout();

  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const isAdmin = user?.role === 'admin';

  const navItems = useMemo(() => (
    isAdmin
      ? [
          { name: 'User Management', path: '/user-management', icon: LayoutDashboard },
          { name: 'Settings', path: '/settings', icon: Settings },
        ]
      : [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Grow Rooms', path: '/grow-rooms', icon: Sprout },
          { name: 'Controls', path: '/controls', icon: Sliders },
          { name: 'Reports', path: '/reports', icon: FileText },
          { name: 'Settings', path: '/settings', icon: Settings },
        ]
  ), [isAdmin]);

  // Close drawer on route change
  useEffect(() => {
    closeDrawer();
  }, [location.pathname, closeDrawer]);

  const renderNavContent = (collapsed = false) => (
    <div className="flex flex-col justify-between h-full select-none">
      <div>
        {/* Logo Section */}
        <div className={`p-4 border-b border-slate-800/60 flex items-center justify-between ${collapsed ? 'px-3 justify-center' : 'px-5'}`}>
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00ff88]/5 border border-[#00ff88]/20 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,136,0.15)] shrink-0 overflow-hidden">
              <img src={logo} alt="कृषीDristi Logo" className="w-8 h-8 object-contain scale-110" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-base tracking-wide text-white flex items-center gap-1.5 leading-tight">
                  कृषीDristi
                </h1>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Smart Farm OS</p>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle Button */}
          {!collapsed && (
            <button
              onClick={toggleSidebarCollapse}
              className="hidden lg:flex p-1.5 rounded-lg bg-[#0a0f1a] hover:bg-slate-800 text-gray-400 hover:text-white border border-slate-800 transition-colors"
              title="Collapse Sidebar"
              aria-label="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Mobile/Tablet Close Button */}
          <button
            onClick={closeDrawer}
            className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collapsed Expand Toggle */}
        {collapsed && (
          <div className="hidden lg:flex justify-center py-3 border-b border-slate-800/40">
            <button
              onClick={toggleSidebarCollapse}
              className="p-2 rounded-xl bg-[#0a0f1a] hover:bg-slate-800 text-gray-400 hover:text-white border border-slate-800 transition-colors"
              title="Expand Sidebar"
              aria-label="Expand Sidebar"
            >
              <ChevronLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <nav className={`p-3 space-y-1.5 ${collapsed ? 'px-2' : 'px-3'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
            
            const linkContent = (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 min-h-[44px] ${
                  collapsed ? 'justify-center px-0' : ''
                } ${
                  isActive
                    ? 'bg-[#00ff88]/10 text-[#00ff88] border-l-4 border-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.15)] font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#00ff88]' : 'text-gray-400'}`} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );

            return (
              <Tooltip key={item.name} text={item.name} show={collapsed}>
                {linkContent}
              </Tooltip>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Section */}
      <div className="mt-auto p-3 space-y-3">
        {/* Sign Out Button */}
        <Tooltip text="Sign Out" show={collapsed}>
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 cursor-pointer min-h-[44px] ${
              collapsed ? 'justify-center px-0' : ''
            }`}
            aria-label="Sign Out"
          >
            <LogOut className="w-5 h-5 text-red-400 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </Tooltip>

        {/* System Status Card */}
        {collapsed ? (
          <Tooltip text="System Online • Live" show={true}>
            <div className="p-3 rounded-xl bg-[#131c2e] border border-slate-800 flex items-center justify-center">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00ff88]"></span>
              </span>
            </div>
          </Tooltip>
        ) : (
          <div className="p-3.5 rounded-xl bg-[#131c2e] border border-slate-800 flex items-center gap-3 shadow-inner">
            <div className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00ff88]"></span>
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-white flex items-center gap-1">
                System Online <ShieldCheck className="w-3.5 h-3.5 text-[#00ff88] shrink-0" />
              </div>
              <div className="text-[10px] text-gray-400 truncate">Telemetry v4.2 • Live</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop & Laptop Fixed Sidebar (lg:flex) */}
      <aside
        className={`hidden lg:flex flex-col bg-[#0d1424] border-r border-slate-800/80 h-screen sticky top-0 z-30 transition-all duration-250 ease-in-out ${
          isSidebarCollapsed ? 'w-[72px]' : 'w-[260px]'
        }`}
      >
        {renderNavContent(isSidebarCollapsed)}
      </aside>

      {/* 2. Tablet & Mobile Slide Drawer Overlay (<lg) */}
      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Dark Backdrop with Blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-250"
            onClick={closeDrawer}
            aria-hidden="true"
          />

          {/* Slide-out Drawer Panel */}
          <aside className="relative w-[280px] max-w-[85vw] bg-[#0d1424] border-r border-slate-800/80 h-full shadow-2xl z-50 transform transition-transform duration-250 ease-out">
            {renderNavContent(false)}
          </aside>
        </div>
      )}

      {/* Sign Out Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          logout();
        }}
      />
    </>
  );
});

export default Sidebar;



