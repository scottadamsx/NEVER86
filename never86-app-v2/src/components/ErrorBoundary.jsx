/**
 * ERROR BOUNDARY COMPONENT
 * 
 * Catches JavaScript errors anywhere in the component tree and displays
 * a friendly error page instead of crashing the entire app.
 * 
 * WHAT IT DOES:
 * - Wraps the entire app (in App.jsx)
 * - Catches errors in any child component
 * - Shows a user-friendly error message
 * - Provides options to refresh or go home
 * - In development, shows detailed error information
 * 
 * HOW IT WORKS:
 * - Uses React class component (required for error boundaries)
 * - getDerivedStateFromError: Updates state when error occurs
 * - componentDidCatch: Logs error and stores error details
 * - render: Shows error UI if hasError is true, otherwise shows children
 * 
 * IMPORTANT:
 * Error boundaries only catch errors in:
 * - Component rendering
 * - Lifecycle methods
 * - Constructors
 * 
 * They do NOT catch errors in:
 * - Event handlers (use try/catch instead)
 * - Async code (use try/catch instead)
 * - Server-side rendering
 */

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * ErrorBoundary Class Component
 * 
 * This is a React class component (not a function component) because
 * error boundaries can only be implemented as class components.
 * 
 * It wraps the app and catches any errors that occur in child components.
 */
class ErrorBoundary extends React.Component {
  /**
   * Constructor
   * 
   * Initializes the component state.
   * - hasError: Whether an error has occurred
   * - error: The error object (if any)
   * - errorInfo: Additional error information (component stack, etc.)
   */
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  /**
   * getDerivedStateFromError
   * 
   * This is a React lifecycle method that's called when an error is thrown.
   * It updates the state to indicate an error occurred.
   * 
   * @param {Error} error - The error that was thrown
   * @returns {Object} New state object
   */
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the error UI
    return { hasError: true };
  }

  /**
   * componentDidCatch
   * 
   * This is a React lifecycle method that's called after an error is caught.
   * It's used to log the error and store error details.
   * 
   * @param {Error} error - The error that was thrown
   * @param {Object} errorInfo - Additional error information (component stack, etc.)
   */
  componentDidCatch(error, errorInfo) {
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Store error details in state (for displaying in development)
    this.setState({
      error,
      errorInfo
    });
  }

  /**
   * render
   * 
   * Renders either the error UI or the normal children.
   */
  render() {
    // If an error occurred, show the error fallback UI
    if (this.state.hasError) {
      return <ErrorFallback 
        error={this.state.error} 
        errorInfo={this.state.errorInfo}
        // Reset function: clears error state so user can try again
        onReset={() => this.setState({ hasError: false, error: null, errorInfo: null })}
      />;
    }

    // No error - render children normally
    return this.props.children;
  }
}

/**
 * ErrorFallback Component
 * 
 * The UI that's displayed when an error occurs.
 * Shows a friendly message and provides recovery options.
 * 
 * @param {Object} props
 * @param {Error} props.error - The error object (if available)
 * @param {Object} props.errorInfo - Additional error information
 * @param {Function} props.onReset - Function to reset error state (not currently used)
 */
function ErrorFallback({ error, errorInfo, onReset }) {
  /**
   * handleGoHome Function
   * 
   * Navigates to the login page.
   * Uses window.location instead of React Router because
   * the error might have occurred outside the Router context.
   */
  const handleGoHome = () => {
    // Use window.location since we might be outside Router context
    window.location.href = '/login';
  };

  /**
   * handleRefresh Function
   * 
   * Reloads the entire page, which will reset the app state.
   */
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    // Full-screen centered error message
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 max-w-2xl w-full">
        {/* Header with error icon */}
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-red-500" size={32} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Something went wrong
          </h1>
        </div>
        
        {/* Friendly error message */}
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We're sorry, but something unexpected happened. Please try refreshing the page or returning to the dashboard.
        </p>

        {/* Error details - only shown in development mode */}
        {/* This helps developers debug issues */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <summary className="cursor-pointer text-sm font-medium text-red-800 dark:text-red-200 mb-2">
              Error Details (Development Only)
            </summary>
            {/* Show error message and component stack trace */}
            <pre className="text-xs text-red-700 dark:text-red-300 overflow-auto mt-2">
              {error.toString()}
              {errorInfo && errorInfo.componentStack}
            </pre>
          </details>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          {/* Refresh button - reloads the page */}
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={18} />
            Refresh Page
          </button>
          
          {/* Go home button - navigates to login */}
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
          >
            <Home size={18} />
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;
