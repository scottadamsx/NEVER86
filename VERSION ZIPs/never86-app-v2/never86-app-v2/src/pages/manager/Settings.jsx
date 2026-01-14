import { useState } from 'react';
import { Settings as SettingsIcon, Bell, Moon, User, Save, RefreshCw, Download, Upload } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import ConfirmationDialog from '../../components/ConfirmationDialog';

function ManagerSettings() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { success, error: showError } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [showReloadConfirm, setShowReloadConfirm] = useState(false);
  const { reloadMockData, tables, menuItems, inventory, staff, orders, chits, messages } = useData();

  const handleExportData = () => {
    try {
      const dataToExport = {
        tables,
        menuItems,
        inventory,
        staff,
        orders,
        chits,
        messages,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };
      
      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `never86-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      success('Data exported successfully');
    } catch (err) {
      showError('Failed to export data');
      console.error(err);
    }
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        // Validate data structure
        if (!importedData.tables || !importedData.menuItems) {
          showError('Invalid backup file format');
          return;
        }

        // Save to localStorage
        localStorage.setItem('never86_tables', JSON.stringify(importedData.tables));
        localStorage.setItem('never86_menuItems', JSON.stringify(importedData.menuItems));
        localStorage.setItem('never86_inventory', JSON.stringify(importedData.inventory || []));
        localStorage.setItem('never86_staff', JSON.stringify(importedData.staff || []));
        localStorage.setItem('never86_orders', JSON.stringify(importedData.orders || []));
        localStorage.setItem('never86_chits', JSON.stringify(importedData.chits || []));
        localStorage.setItem('never86_messages', JSON.stringify(importedData.messages || []));
        
        success('Data imported successfully. Page will reload.');
        setTimeout(() => window.location.reload(), 1000);
      } catch (err) {
        showError('Failed to import data. Invalid file format.');
        console.error(err);
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
      
      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Moon className="text-brand-navy dark:text-blue-400" size={24} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-slate-700">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark theme</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                darkMode ? 'bg-brand-navy' : 'bg-gray-300'
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
            <Bell className="text-brand-navy dark:text-blue-400" size={24} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-slate-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive in-app notifications</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications ? 'bg-brand-navy' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notifications ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive email updates</p>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  emailNotifications ? 'bg-brand-navy' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    emailNotifications ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <User className="text-brand-navy dark:text-blue-400" size={24} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Account</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
              <input
                type="text"
                defaultValue="Manager"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                defaultValue="manager@restaurant.com"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
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
                Export all current data as a backup file.
              </p>
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mb-4"
              >
                <Download size={18} />
                Export Data
              </button>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Import data from a backup file.
              </p>
              <label className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer inline-block">
                <Upload size={18} />
                Import Data
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                  aria-label="Import data file"
                />
              </label>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
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
          <button className="flex items-center gap-2 bg-brand-navy text-white px-6 py-3 rounded-xl hover:bg-brand-navy/90 transition-colors">
            <Save size={20} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Reload Confirmation Modal */}
      <ConfirmationDialog
        isOpen={showReloadConfirm}
        onClose={() => setShowReloadConfirm(false)}
        onConfirm={() => {
          reloadMockData();
          success('Data reset successfully');
          setTimeout(() => window.location.reload(), 1000);
        }}
        title="Confirm Reset"
        message="Are you sure you want to reload all mock data? This will permanently delete all current data including tables, orders, inventory, staff modifications, and chat messages."
        confirmText="Confirm Reset"
        variant="danger"
      />
    </div>
  );
}

export default ManagerSettings;