import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts';

function DashboardLayout({ children }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Global keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'Escape',
      action: () => {
        // Close any open modals (this is a simple implementation)
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
        // Toggle sidebar (if needed)
        setSidebarExpanded(prev => !prev);
      },
      description: 'Toggle sidebar'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      <Sidebar 
        expanded={sidebarExpanded} 
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      />
      <div className={`transition-all duration-300 ${sidebarExpanded ? 'ml-56' : 'ml-16'}`}>
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;