/**
 * PROTECTED ROUTE COMPONENT
 * 
 * This component protects routes that require authentication.
 * It checks if:
 * 1. User is logged in (has a currentUser)
 * 2. User has the correct role (manager, server, or kitchen)
 * 
 * HOW IT WORKS:
 * - If user is not logged in → redirect to /login
 * - If user is logged in but wrong role → redirect to their role's dashboard
 * - If user is logged in and correct role → show the protected page
 * 
 * DashboardLayout wraps the page with the sidebar, header, and navigation
 * Outlet renders the actual page component (Dashboard, Tables, etc.)
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './Layout/DashboardLayout';  // Note: Capital L in Layout

/**
 * ProtectedRoute Component
 * 
 * @param {Object} props
 * @param {string[]} props.allowedRoles - Array of roles that can access this route
 *                                        Example: ['manager'] or ['server', 'kitchen']
 * 
 * @returns {JSX.Element} Either a redirect or the protected page wrapped in layout
 */
function ProtectedRoute({ allowedRoles }) {
  // Get the current logged-in user from AuthContext
  const { currentUser } = useAuth();

  // Check 1: Is user logged in?
  // If no user, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Check 2: Does user have the correct role?
  // allowedRoles is an array like ['manager'] or ['server']
  // If user's role is not in the allowed list, redirect them to their role's dashboard
  if (!allowedRoles.includes(currentUser.role)) {
    // Redirect to their role's dashboard (e.g., /server/dashboard)
    return <Navigate to={`/${currentUser.role}`} replace />;
  }

  // User passed both checks! Show the protected page
  // DashboardLayout provides the sidebar, header, and navigation
  // Outlet renders the actual page component (the child route)
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

export default ProtectedRoute;