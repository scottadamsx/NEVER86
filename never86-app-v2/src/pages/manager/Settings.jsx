import { useState } from 'react';
import { Settings as SettingsIcon, Bell, Moon, User, Save, RefreshCw, Download, Upload, Clock, Store } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import MenuQRCode from '../../components/MenuQRCode';

function ManagerSettings() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { success, error: showError } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [showReloadConfirm, setShowReloadConfirm] = useState(false);
  const { 
    reloadMockData, 
    tables, 
    menuItems, 
    inventory, 
    staff, 
    orders, 
    chits, 
    messages,
    storeHours,
    updateStoreHours
  } = useData();

  const [localStoreHours, setLocalStoreHours] = useState(storeHours);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const handleStoreHoursChange = (day, field, value) => {
    setLocalStoreHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: field === 'closed' ? value : value
      }
    }));
  };

  const handleSaveStoreHours = () => {
    updateStoreHours(localStoreHours);
    success('Store hours updated successfully');
  };

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
        
        if (!importedData.tables || !importedData.menuItems) {
          showError('Invalid backup file format');
          return;
        }

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
    event.target.value = '';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

      {/* Menu QR Code */}
      <MenuQRCode restaurantId="never86" />

      {/* Store Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5 text-brand-navy dark:text-blue-400" />
            Store Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {days.map(day => (
              <div key={day} className="flex items-center gap-4 py-2 border-b border-gray-100 dark:border-slate-700 last:border-0">
                <div className="w-28">
                  <span className="font-medium text-gray-900 dark:text-white capitalize">{day}</span>
                </div>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localStoreHours[day]?.closed || false}
                    onChange={(e) => handleStoreHoursChange(day, 'closed', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-brand-navy focus:ring-brand-navy"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Closed</span>
                </label>
                
                {!localStoreHours[day]?.closed && (
                  <>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-500">Open:</label>
                      <input
                        type="time"
                        value={localStoreHours[day]?.open || '11:00'}
                        onChange={(e) => handleStoreHoursChange(day, 'open', e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-500">Close:</label>
                      <input
                        type="time"
                        value={localStoreHours[day]?.close || '22:00'}
                        onChange={(e) => handleStoreHoursChange(day, 'close', e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
            <Button onClick={handleSaveStoreHours}>
              <Save className="w-4 h-4 mr-2" />
              Save Store Hours
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-brand-navy dark:text-blue-400" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-3">
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
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand-navy dark:text-blue-400" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-brand-navy dark:text-blue-400" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-2 border-red-200 dark:border-red-900/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <RefreshCw className="w-5 h-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Export all current data as a backup file.
            </p>
            <Button onClick={handleExportData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Import data from a backup file.
            </p>
            <label className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
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
              Reset all data to initial mock data. This will clear all current data.
            </p>
            <Button variant="destructive" onClick={() => setShowReloadConfirm(true)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload Mock Data
            </Button>
          </div>
        </CardContent>
      </Card>

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
