/**
 * PROTECTED MARKETING ROUTE
 * 
 * Component that protects marketing pages - requires authentication.
 * If user is not logged in, redirects to login page.
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedMarketingRoute Component
 * 
 * Wraps marketing pages to ensure only authenticated users can access them.
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - The marketing page component to render if authenticated
 */
function ProtectedMarketingRoute({ children }) {
  const { currentUser } = useAuth();

  // If no user is logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the marketing page
  return children;
}

export default ProtectedMarketingRoute;
