import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback 
        error={this.state.error} 
        errorInfo={this.state.errorInfo}
        onReset={() => this.setState({ hasError: false, error: null, errorInfo: null })}
      />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error, errorInfo, onReset }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 max-w-2xl w-full">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-red-500" size={32} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Something went wrong
          </h1>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We're sorry, but something unexpected happened. Please try refreshing the page or returning to the dashboard.
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <summary className="cursor-pointer text-sm font-medium text-red-800 dark:text-red-200 mb-2">
              Error Details (Development Only)
            </summary>
            <pre className="text-xs text-red-700 dark:text-red-300 overflow-auto mt-2">
              {error.toString()}
              {errorInfo && errorInfo.componentStack}
            </pre>
          </details>
        )}

        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
          <button
            onClick={() => navigate('/login')}
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

