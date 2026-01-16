/**
 * THEME CONTEXT
 * 
 * Manages dark/light mode theme throughout the application.
 * 
 * WHAT IT DOES:
 * - Stores whether dark mode is enabled
 * - Applies 'dark' class to <html> element (which Tailwind CSS uses for dark mode)
 * - Persists theme preference to localStorage
 * - Detects system preference on first load
 * - Provides toggle function to switch between themes
 * 
 * HOW IT WORKS:
 * - Tailwind CSS uses the 'dark' class on <html> to apply dark mode styles
 * - When darkMode is true, we add 'dark' class
 * - When darkMode is false, we remove 'dark' class
 * - Components use Tailwind's dark: prefix (e.g., dark:bg-slate-800)
 * 
 * HOW TO USE:
 * In any component:
 *   const { darkMode, toggleDarkMode } = useTheme();
 *   <button onClick={toggleDarkMode}>
 *     {darkMode ? 'Switch to Light' : 'Switch to Dark'}
 *   </button>
 */

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

/**
 * ThemeProvider Component
 * 
 * Wraps the app and provides theme state to all child components.
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - All child components
 */
export function ThemeProvider({ children }) {
  // Initialize darkMode from localStorage or system preference
  // The function in useState() only runs once when component first mounts
  const [darkMode, setDarkMode] = useState(() => {
    // First, check if user has saved a preference in localStorage
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      // Convert string 'true'/'false' to boolean
      return saved === 'true';
    }
    
    // No saved preference - check system preference
    // matchMedia checks if user's OS/browser prefers dark mode
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to document whenever darkMode changes
  // This is what actually enables/disables dark mode styling
  useEffect(() => {
    if (darkMode) {
      // Add 'dark' class to <html> element
      // Tailwind CSS uses this class to apply dark mode styles
      document.documentElement.classList.add('dark');
    } else {
      // Remove 'dark' class from <html> element
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference to localStorage so it persists across page refreshes
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);  // Run this effect whenever darkMode changes

  /**
   * toggleDarkMode Function
   * 
   * Switches between dark and light mode.
   * Uses functional update to toggle the previous value.
   */
  const toggleDarkMode = () => {
    // Toggle: if darkMode is true, set to false; if false, set to true
    setDarkMode(prev => !prev);
  };

  // Provide theme state and toggle function to all child components
  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme Hook
 * 
 * Custom hook to access theme state and functions.
 * 
 * USAGE:
 *   const { darkMode, toggleDarkMode } = useTheme();
 * 
 * @returns {Object} { darkMode: boolean, toggleDarkMode: function }
 * @throws {Error} If used outside of ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  
  // Safety check: Make sure this hook is used inside ThemeProvider
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  
  return context;
}



