import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import RestaurantBadge from '../RestaurantBadge';
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts';

function DashboardLayout({ children }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
      // On mobile, sidebar should be closed by default
      if (window.innerWidth < 768) {
        setSidebarExpanded(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Global keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'Escape',
      action: () => {
        // Close sidebar on mobile when pressing Escape
        if (isMobile && sidebarExpanded) {
          setSidebarExpanded(false);
          return;
        }
        // Close any open modals
        const modals = document.querySelectorAll('[role="dialog"]');
        modals.forEach(modal => {
          const closeBtn = modal.querySelector('button[aria-label="Close dialog"], button[aria-label="Close"]');
          if (closeBtn) closeBtn.click();
        });
      },
      description: 'Close modals'
    },
    {
      key: 'b',
      ctrl: true,
      action: () => {
        // Toggle sidebar (desktop only)
        if (!isMobile) {
          setSidebarExpanded(prev => !prev);
        }
      },
      description: 'Toggle sidebar'
    }
  ]);

  const handleSidebarToggle = () => {
    setSidebarExpanded(prev => !prev);
  };

  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarExpanded(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      {/* Mobile overlay when sidebar is open */}
      {isMobile && sidebarExpanded && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={handleSidebarClose}
          aria-hidden="true"
        />
      )}
      
      <Sidebar 
        expanded={sidebarExpanded} 
        isMobile={isMobile}
        onMouseEnter={() => !isMobile && setSidebarExpanded(true)}
        onMouseLeave={() => !isMobile && setSidebarExpanded(false)}
        onClose={handleSidebarClose}
      />
      
      {/* Main content area - responsive margin */}
      <div className={`
        transition-all duration-300 min-w-0
        ${isMobile 
          ? 'ml-0' 
          : sidebarExpanded 
            ? 'ml-56' 
            : 'ml-16'
        }
      `}>
        <Header onMenuClick={handleSidebarToggle} isMobile={isMobile} />
        <main className="p-3 sm:p-4 md:p-6 overflow-x-auto">
          {children}
        </main>
        <RestaurantBadge />
      </div>
    </div>
  );
}

export default DashboardLayout;