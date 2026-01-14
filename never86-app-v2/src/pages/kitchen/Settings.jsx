import { useState } from 'react';
import { Bell, Moon, User, Save, ChefHat, RefreshCw, AlertTriangle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

function KitchenSettings() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [station, setStation] = useState('grill');
  const [showReloadConfirm, setShowReloadConfirm] = useState(false);
  const { reloadMockData } = useData();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
      
      <div className="space-y-6">
        {/* Station Assignment */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <ChefHat className="text-kitchen-primary" size={24} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Station Assignment</h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Station</label>
            <select 
              value={station}
              onChange={(e) => setStation(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="grill">Grill</option>
              <option value="saute">Saute</option>
              <option value="salad">Salad</option>
              <option value="pastry">Pastry</option>
            </select>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Moon className="text-kitchen-primary" size={24} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark theme</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                darkMode ? 'bg-kitchen-primary' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  darkMode ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="text-kitchen-primary" size={24} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">New Order Alerts</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when new orders arrive</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications ? 'bg-kitchen-primary' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  notifications ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border-2 border-red-200 dark:border-red-900/30">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCw className="text-red-600 dark:text-red-400" size={24} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Data Management</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Reset all data to initial mock data. This will clear all current tables, orders, inventory, and other data.
              </p>
              <button
                onClick={() => setShowReloadConfirm(true)}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <RefreshCw size={18} />
                Reload Mock Data
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="flex items-center gap-2 bg-kitchen-primary text-white px-6 py-3 rounded-xl hover:bg-kitchen-primary/90 transition-colors">
            <Save size={20} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Reload Confirmation Modal */}
      {showReloadConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Reset</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to reload all mock data? This will permanently delete all current data including:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-1">
              <li>All table states and orders</li>
              <li>All inventory changes</li>
              <li>All staff modifications</li>
              <li>All chat messages</li>
            </ul>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReloadConfirm(false)}
                className="flex-1 py-2 px-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  reloadMockData();
                  setShowReloadConfirm(false);
                  // Reload the page to reflect changes
                  window.location.reload();
                }}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default KitchenSettings;