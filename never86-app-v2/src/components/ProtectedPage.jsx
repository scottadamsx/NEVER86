/**
 * PROTECTED PAGE COMPONENT
 * 
 * Simple wrapper for protecting standalone pages (not nested routes).
 * Checks authentication and role before rendering the page.
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedPage Component
 * 
 * Wraps a standalone page component to ensure only authenticated users
 * with the correct role can access it.
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - The page component to render if authenticated
 * @param {string[]} props.allowedRoles - Array of roles that can access this page
 */
function ProtectedPage({ children, allowedRoles }) {
  const { currentUser } = useAuth();

  // If no user, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If user doesn't have the correct role, redirect to their dashboard
  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to={`/${currentUser.role}/dashboard`} replace />;
  }

  // User is authenticated and has correct role, render the page
  return children;
}

export default ProtectedPage;
