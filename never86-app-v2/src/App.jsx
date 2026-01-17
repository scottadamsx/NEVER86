/**
 * MAIN APP COMPONENT
 * 
 * This is the root component that sets up the entire application structure.
 * It handles:
 * 1. Routing - defines all the pages and their URLs
 * 2. Context Providers - wraps the app with shared state (auth, data, theme, toasts)
 * 3. Error Handling - catches any crashes and shows a friendly error page
 * 
 * ARCHITECTURE:
 * The providers are nested in a specific order (outermost to innermost):
 * - ErrorBoundary: Catches any errors in the app
 * - BrowserRouter: Enables navigation between pages
 * - ThemeProvider: Manages dark/light mode
 * - ToastProvider: Shows success/error notifications
 * - AuthProvider: Manages user login/logout state
 * - DataProvider: Manages all restaurant data (tables, orders, menu, etc.)
 * 
 * ROUTING STRUCTURE:
 * - Public routes: Anyone can access (login, public menu)
 * - Protected routes: Require login and specific role (manager, server, kitchen)
 * - Each role has its own set of pages
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ScenarioProvider } from './context/ScenarioContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedPage from './components/ProtectedPage';
import ErrorBoundary from './components/ErrorBoundary';

// Manager Pages - Only accessible to users with 'manager' role
import ManagerDashboard from './pages/manager/Dashboard';
import ManagerFloor from './pages/manager/Floor';
import ManagerStaff from './pages/manager/Staff';
import ManagerInventory from './pages/manager/Inventory';
import ManagerMenu from './pages/manager/Menu';
import ManagerChat from './pages/manager/Chat';
import ManagerSettings from './pages/manager/Settings';
import ManagerAnalytics from './pages/manager/Analytics';
import ManagerSchedule from './pages/manager/Schedule';
import ManagerProfitability from './pages/manager/Profitability';
import ManagerScenarioManager from './pages/manager/ScenarioManager';

// Server Pages - Only accessible to users with 'server' role
import ServerDashboard from './pages/server/Dashboard';
import ServerFloor from './pages/server/Floor';
import ServerTables from './pages/server/Tables';
import ServerBillOut from './pages/server/BillOut';
import ServerStats from './pages/server/Stats';
import ServerCompetition from './pages/server/Competition';
import ServerChat from './pages/server/Chat';
import ServerSettings from './pages/server/Settings';

// Kitchen Pages - Only accessible to users with 'kitchen' role
import KitchenOrders from './pages/kitchen/Orders';
import KitchenInventory from './pages/kitchen/Inventory';
import KitchenChat from './pages/kitchen/Chat';
import KitchenSettings from './pages/kitchen/Settings';

// Public Pages - Anyone can access these
import Landing from './pages/Landing';
import Features from './pages/marketing/Features';
import Benefits from './pages/marketing/Benefits';
import About from './pages/marketing/About';
import ForManagers from './pages/marketing/ForManagers';
import ForServers from './pages/marketing/ForServers';
import ForKitchen from './pages/marketing/ForKitchen';
import PublicMenu from './pages/menu/PublicMenu';

function App() {
  return (
    // ErrorBoundary catches any JavaScript errors and shows a friendly error page
    <ErrorBoundary>
      {/* BrowserRouter enables client-side routing (changing URLs without page reload) */}
      <BrowserRouter>
        {/* ThemeProvider manages dark/light mode theme */}
        <ThemeProvider>
          {/* ToastProvider shows temporary notifications (success, error messages) */}
          <ToastProvider>
            {/* AuthProvider manages user authentication (login/logout, current user) */}
            <AuthProvider>
              {/* ScenarioProvider manages test scenarios and restaurant name */}
              <ScenarioProvider>
                {/* DataProvider manages all restaurant data (tables, orders, menu items, etc.) */}
                <DataProvider>
                  {/* Routes defines all the pages and their URLs */}
                  <Routes>
                  {/* ============================================
                      PUBLIC ROUTES - No login required
                      ============================================ */}
                  
                  {/* Landing page - marketing/home page (public) */}
                  <Route path="/" element={<Landing />} />
                  
                  {/* Marketing pages - public for demos */}
                  <Route path="/features" element={<Features />} />
                  <Route path="/benefits" element={<Benefits />} />
                  <Route path="/about" element={<About />} />
                  
                  {/* Role-specific pages - protected, only accessible after sign-in */}
                  <Route path="/manager" element={<ProtectedPage allowedRoles={['manager']}><ForManagers /></ProtectedPage>} />
                  <Route path="/server" element={<ProtectedPage allowedRoles={['server']}><ForServers /></ProtectedPage>} />
                  <Route path="/kitchen" element={<ProtectedPage allowedRoles={['kitchen']}><ForKitchen /></ProtectedPage>} />
                  
                  {/* Login page - where users sign in */}
                  <Route path="/login" element={<Login />} />
                  
                  {/* Public menu - customers can view menu without logging in
                      :restaurantId? means the restaurant ID is optional in the URL */}
                  <Route path="/menu/:restaurantId?" element={<PublicMenu />} />

                  {/* ============================================
                      MANAGER ROUTES - Requires 'manager' role
                      ============================================
                      ProtectedRoute checks if user is logged in and has 'manager' role
                      If not, redirects to login or appropriate role page */}
                  
                  <Route path="/manager" element={<ProtectedRoute allowedRoles={['manager']} />}>
                    {/* Index route: /manager redirects to /manager/dashboard */}
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<ManagerDashboard />} />
                    <Route path="floor" element={<ManagerFloor />} />
                    <Route path="staff" element={<ManagerStaff />} />
                    <Route path="inventory" element={<ManagerInventory />} />
                    <Route path="menu" element={<ManagerMenu />} />
                    <Route path="chat" element={<ManagerChat />} />
                    <Route path="settings" element={<ManagerSettings />} />
                    <Route path="scenario-manager" element={<ManagerScenarioManager />} />
                    <Route path="analytics" element={<ManagerAnalytics />} />
                    <Route path="schedule" element={<ManagerSchedule />} />
                    <Route path="profitability" element={<ManagerProfitability />} />
                  </Route>

                  {/* ============================================
                      SERVER ROUTES - Requires 'server' role
                      ============================================ */}
                  
                  <Route path="/server" element={<ProtectedRoute allowedRoles={['server']} />}>
                    {/* Index route: /server redirects to /server/dashboard */}
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<ServerDashboard />} />
                    <Route path="floor" element={<ServerFloor />} />
                    <Route path="tables" element={<ServerTables />} />
                    {/* :tableId is a URL parameter - e.g., /server/billout/5 */}
                    <Route path="billout/:tableId" element={<ServerBillOut />} />
                    <Route path="stats" element={<ServerStats />} />
                    <Route path="competition" element={<ServerCompetition />} />
                    <Route path="chat" element={<ServerChat />} />
                    <Route path="settings" element={<ServerSettings />} />
                  </Route>

                  {/* ============================================
                      KITCHEN ROUTES - Requires 'kitchen' role
                      ============================================ */}
                  
                  <Route path="/kitchen" element={<ProtectedRoute allowedRoles={['kitchen']} />}>
                    {/* Index route: /kitchen redirects to /kitchen/orders */}
                    <Route index element={<Navigate to="orders" replace />} />
                    <Route path="orders" element={<KitchenOrders />} />
                    <Route path="inventory" element={<KitchenInventory />} />
                    <Route path="chat" element={<KitchenChat />} />
                    <Route path="settings" element={<KitchenSettings />} />
                  </Route>

                  {/* ============================================
                      DEFAULT ROUTES - Catch-all redirects
                      ============================================ */}
                  
                  {/* Root path (/) redirects to login */}
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  
                  {/* Any other path (*) that doesn't match above routes redirects to login
                      This handles 404 errors by sending users to login */}
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
                </DataProvider>
              </ScenarioProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;