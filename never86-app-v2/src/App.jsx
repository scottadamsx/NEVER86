import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Manager Pages
import ManagerDashboard from './pages/manager/Dashboard';
import ManagerFloor from './pages/manager/Floor';
import ManagerStaff from './pages/manager/Staff';
import ManagerInventory from './pages/manager/Inventory';
import ManagerMenu from './pages/manager/Menu';
import ManagerSales from './pages/manager/Sales';
import ManagerChat from './pages/manager/Chat';
import ManagerSettings from './pages/manager/Settings';

// Server Pages
import ServerDashboard from './pages/server/Dashboard';
import ServerFloor from './pages/server/Floor';
import ServerTables from './pages/server/Tables';
import ServerBillOut from './pages/server/BillOut';
import ServerStats from './pages/server/Stats';
import ServerCompetition from './pages/server/Competition';
import ServerChat from './pages/server/Chat';
import ServerSettings from './pages/server/Settings';

// Kitchen Pages
import KitchenOrders from './pages/kitchen/Orders';
import KitchenInventory from './pages/kitchen/Inventory';
import KitchenChat from './pages/kitchen/Chat';
import KitchenSettings from './pages/kitchen/Settings';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <DataProvider>
                <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />

            {/* Manager Routes */}
            <Route path="/manager" element={<ProtectedRoute allowedRoles={['manager']} />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<ManagerDashboard />} />
              <Route path="floor" element={<ManagerFloor />} />
              <Route path="staff" element={<ManagerStaff />} />
              <Route path="inventory" element={<ManagerInventory />} />
              <Route path="menu" element={<ManagerMenu />} />
              <Route path="sales" element={<ManagerSales />} />
              <Route path="chat" element={<ManagerChat />} />
              <Route path="settings" element={<ManagerSettings />} />
            </Route>

            {/* Server Routes */}
            <Route path="/server" element={<ProtectedRoute allowedRoles={['server']} />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<ServerDashboard />} />
              <Route path="floor" element={<ServerFloor />} />
              <Route path="tables" element={<ServerTables />} />
            <Route path="billout/:tableId" element={<ServerBillOut />} />
            <Route path="stats" element={<ServerStats />} />
            <Route path="competition" element={<ServerCompetition />} />
            <Route path="chat" element={<ServerChat />} />
            <Route path="settings" element={<ServerSettings />} />
            </Route>

            {/* Kitchen Routes */}
            <Route path="/kitchen" element={<ProtectedRoute allowedRoles={['kitchen']} />}>
              <Route index element={<Navigate to="orders" replace />} />
              <Route path="orders" element={<KitchenOrders />} />
              <Route path="inventory" element={<KitchenInventory />} />
              <Route path="chat" element={<KitchenChat />} />
              <Route path="settings" element={<KitchenSettings />} />
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </DataProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;