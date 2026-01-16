/**
 * AUTH CONTEXT
 * 
 * Manages user authentication state throughout the application.
 * 
 * WHAT IT DOES:
 * - Stores the currently logged-in user
 * - Provides login/logout functions
 * - Persists user data to localStorage (so user stays logged in after page refresh)
 * - Makes user data available to any component via useAuth() hook
 * 
 * HOW TO USE:
 * In any component, import and use:
 *   const { currentUser, login, logout } = useAuth();
 * 
 * USER OBJECT STRUCTURE:
 * {
 *   id: string,           // Unique user ID
 *   username: string,     // Login username
 *   role: string,         // 'manager', 'server', or 'kitchen'
 *   displayName: string,   // Full name to display
 *   section?: string      // For servers: 'A', 'B', or 'C' (which section they serve)
 * }
 */

import { createContext, useContext, useState, useEffect } from 'react';

// Create the context - this is like a "box" that holds shared data
const AuthContext = createContext();

/**
 * AuthProvider Component
 * 
 * Wraps the app and provides authentication state to all child components.
 * This is used in App.jsx to wrap the entire application.
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - All child components that need access to auth
 */
export function AuthProvider({ children }) {
  // Initialize currentUser from localStorage if available
  // This means if user refreshes the page, they stay logged in
  // The function in useState() only runs once when component first mounts
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    // If we have a saved user, parse it from JSON string back to object
    // If no saved user, return null (user is not logged in)
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Save to localStorage whenever currentUser changes
  // This keeps localStorage in sync with the current user state
  useEffect(() => {
    if (currentUser) {
      // User is logged in - save to localStorage as JSON string
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      // User logged out - remove from localStorage
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]); // Run this effect whenever currentUser changes

  /**
   * Login Function
   * 
   * Logs a user into the application.
   * 
   * @param {string} username - The username to log in with
   * @param {string} role - The user's role ('manager', 'server', or 'kitchen')
   * @param {Object|null} userData - Optional: Full user object from staff list
   *                                 If provided, uses this instead of creating basic user
   * 
   * @returns {Object} The user object that was set
   */
  const login = (username, role, userData = null) => {
    // If userData is provided (from staff list), use it
    // Otherwise, create a basic user object
    const user = userData || {
      id: `user-${Date.now()}`,  // Unique ID based on current timestamp
      username,
      role,
      // Capitalize first letter of username for display name
      displayName: username.charAt(0).toUpperCase() + username.slice(1),
    };
    
    // Update state - this triggers the useEffect above to save to localStorage
    setCurrentUser(user);
    return user;
  };

  /**
   * Logout Function
   * 
   * Logs the current user out by clearing the user state.
   * The useEffect above will automatically remove from localStorage.
   */
  const logout = () => {
    setCurrentUser(null);  // Clear user - triggers localStorage cleanup
    localStorage.removeItem('currentUser');  // Also remove directly (redundant but safe)
  };

  // Provide the auth state and functions to all child components
  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth Hook
 * 
 * Custom hook to access authentication state and functions.
 * 
 * USAGE:
 *   const { currentUser, login, logout } = useAuth();
 * 
 * @returns {Object} { currentUser, login, logout }
 * @throws {Error} If used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  // Safety check: Make sure this hook is used inside AuthProvider
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
}