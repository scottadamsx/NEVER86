/**
 * MAIN ENTRY POINT
 * 
 * This is the first file that runs when the application starts.
 * It renders the React app into the HTML page.
 * 
 * What happens here:
 * 1. Imports React and the root CSS styles
 * 2. Imports the main App component (which contains all routing)
 * 3. Finds the HTML element with id="root" in index.html
 * 4. Renders the App component into that element
 * 
 * StrictMode is a React development tool that helps catch bugs by:
 * - Detecting components with unsafe lifecycles
 * - Warning about legacy string ref API usage
 * - Warning about deprecated findDOMNode usage
 * - Detecting unexpected side effects
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'  // Global CSS styles for the entire application
import App from './App.jsx'  // Main App component with all routes and providers

// Find the root HTML element and render the app
// The 'root' element is defined in index.html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
