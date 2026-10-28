/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const LayoutContext = createContext(null);

export const LayoutProvider = ({ children }) => {
  // Screen width state
  const [windowWidth, setWindowWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1280));

  // Collapse state for Desktop/Laptop (laptop defaults to collapsed: true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024 && window.innerWidth < 1280;
    }
    return false;
  });

  // Drawer state for Tablet & Mobile (<1024px)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fullscreen search modal state for Mobile (<640px)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Handle window resize with rAF debouncing to prevent thrashing on every pixel
  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const w = window.innerWidth;
        setWindowWidth(prev => {
          // Only update state if breakpoint boundary or width changed significantly (> 20px)
          if (Math.abs(prev - w) > 20) {
            if (w < 1024) setIsDrawerOpen(false);
            return w;
          }
          return prev;
        });
      }, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Keyboard shortcut listener (ESC key)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
        setIsSearchModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSidebarCollapse = useCallback(() => setIsSidebarCollapsed(prev => !prev), []);
  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen(prev => !prev), []);

  const openSearchModal = useCallback(() => setIsSearchModalOpen(true), []);
  const closeSearchModal = useCallback(() => setIsSearchModalOpen(false), []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const isLaptop = windowWidth >= 1024 && windowWidth < 1280;
  const isDesktop = windowWidth >= 1280;

  const value = useMemo(() => ({
    windowWidth,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    toggleSidebarCollapse,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    isSearchModalOpen,
    openSearchModal,
    closeSearchModal,
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
  }), [
    windowWidth,
    isSidebarCollapsed,
    toggleSidebarCollapse,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    isSearchModalOpen,
    openSearchModal,
    closeSearchModal,
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
  ]);

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

