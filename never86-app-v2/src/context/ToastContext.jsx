/**
 * TOAST CONTEXT
 * 
 * Manages temporary notification messages (toasts) that appear in the top-right corner.
 * 
 * WHAT IT DOES:
 * - Shows success, error, warning, and info messages
 * - Automatically dismisses after a set duration
 * - Allows manual dismissal via X button
 * - Provides easy-to-use functions: success(), error(), warning(), info()
 * 
 * HOW TO USE:
 * In any component:
 *   const { success, error } = useToast();
 *   success('Order sent to kitchen!');
 *   error('Failed to save order');
 * 
 * TOAST TYPES:
 * - success: Green, checkmark icon (for successful actions)
 * - error: Red, X icon (for errors)
 * - warning: Yellow, alert icon (for warnings)
 * - info: Blue, info icon (for informational messages)
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

/**
 * ToastProvider Component
 * 
 * Wraps the app and provides toast notification functionality.
 * Also renders the ToastContainer component that displays the toasts.
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - All child components
 */
export function ToastProvider({ children }) {
  // Array of active toasts to display
  // Each toast has: { id, message, type, duration }
  const [toasts, setToasts] = useState([]);

  /**
   * showToast Function
   * 
   * Creates and displays a new toast notification.
   * 
   * @param {string} message - The message to display
   * @param {string} type - 'success', 'error', 'warning', or 'info' (default: 'info')
   * @param {number} duration - How long to show in milliseconds (default: 3000ms = 3 seconds)
   *                            Set to 0 to show indefinitely until manually closed
   * 
   * @returns {string} The toast ID (can be used to manually remove it)
   */
  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    // Generate unique ID for this toast
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = { id, message, type, duration };
    
    // Add new toast to the array
    setToasts(prev => [...prev, newToast]);

    // If duration > 0, automatically remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;  // Return ID in case caller wants to manually remove it
  }, []);  // Empty dependency array - function never changes

  /**
   * removeToast Function
   * 
   * Removes a toast from the display by its ID.
   * 
   * @param {string} id - The toast ID to remove
   */
  const removeToast = useCallback((id) => {
    // Filter out the toast with matching ID
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);  // Empty dependency array - function never changes

  // Convenience functions for each toast type
  // These are shortcuts so you can call success() instead of showToast(message, 'success')
  const success = useCallback((message, duration) => showToast(message, 'success', duration), [showToast]);
  const error = useCallback((message, duration) => showToast(message, 'error', duration), [showToast]);
  const warning = useCallback((message, duration) => showToast(message, 'warning', duration), [showToast]);
  const info = useCallback((message, duration) => showToast(message, 'info', duration), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info, removeToast }}>
      {children}
      {/* Render the toast container that displays all active toasts */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

/**
 * ToastContainer Component
 * 
 * Renders all active toast notifications in the top-right corner.
 * 
 * @param {Object} props
 * @param {Array} props.toasts - Array of toast objects to display
 * @param {Function} props.removeToast - Function to remove a toast by ID
 */
function ToastContainer({ toasts, removeToast }) {
  /**
   * getIcon Function
   * 
   * Returns the appropriate icon for each toast type.
   * 
   * @param {string} type - Toast type ('success', 'error', 'warning', 'info')
   * @returns {JSX.Element} Icon component
   */
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <XCircle className="text-red-500" size={20} />;
      case 'warning':
        return <AlertCircle className="text-yellow-500" size={20} />;
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };

  /**
   * getBgColor Function
   * 
   * Returns the appropriate background color classes for each toast type.
   * Includes both light and dark mode variants.
   * 
   * @param {string} type - Toast type
   * @returns {string} Tailwind CSS classes
   */
  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    // Fixed position in top-right corner, high z-index so it appears above everything
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {/* Map through all toasts and render each one */}
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`${getBgColor(toast.type)} border rounded-lg p-4 shadow-lg flex items-start gap-3 animate-in slide-in-from-right`}
          role="alert"  // Accessibility: tells screen readers this is an alert
          aria-live="polite"  // Accessibility: announces changes politely
        >
          {/* Icon on the left */}
          {getIcon(toast.type)}
          
          {/* Message text */}
          <p className="flex-1 text-sm text-gray-900 dark:text-white">{toast.message}</p>
          
          {/* Close button (X) */}
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Close notification"  // Accessibility: describes button purpose
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}

/**
 * useToast Hook
 * 
 * Custom hook to access toast functions.
 * 
 * USAGE:
 *   const { success, error, warning, info } = useToast();
 *   success('Order saved!');
 * 
 * @returns {Object} { showToast, success, error, warning, info, removeToast }
 * @throws {Error} If used outside of ToastProvider
 */
export function useToast() {
  const context = useContext(ToastContext);
  
  // Safety check: Make sure this hook is used inside ToastProvider
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  
  return context;
}

