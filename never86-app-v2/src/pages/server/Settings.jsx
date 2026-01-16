import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Bell, Moon, User, Save, MapPin, RefreshCw, AlertTriangle, Calendar, Clock, Plus, X, Check } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

function ServerSettings() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { currentUser } = useAuth();
  const { success } = useToast();
  const { 
    reloadMockData, 
    getStaffAvailability, 
    updateStaffAvailability,
    addTimeOffRequest,
    getTimeOffRequestsByStaff
  } = useData();
  
  const [notifications, setNotifications] = useState(true);
  const [showReloadConfirm, setShowReloadConfirm] = useState(false);
  const [showTimeOffModal, setShowTimeOffModal] = useState(false);
  
  // Time off request form
  const [timeOffForm, setTimeOffForm] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  // Get current user's availability
  const availability = getStaffAvailability(currentUser?.id);
  const [localAvailability, setLocalAvailability] = useState(availability);
  
  // Get user's time off requests
  const myRequests = getTimeOffRequestsByStaff(currentUser?.id);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const handleAvailabilityChange = (day, field, value) => {
    setLocalAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleSaveAvailability = () => {
    updateStaffAvailability(currentUser?.id, localAvailability);
    success('Availability updated successfully');
  };

  const handleSubmitTimeOff = () => {
    if (!timeOffForm.startDate || !timeOffForm.endDate || !timeOffForm.reason) {
      return;
    }
    
    addTimeOffRequest({
      staffId: currentUser?.id,
      startDate: timeOffForm.startDate,
      endDate: timeOffForm.endDate,
      reason: timeOffForm.reason
    }, currentUser?.displayName);
    
    setTimeOffForm({ startDate: '', endDate: '', reason: '' });
    setShowTimeOffModal(false);
    success('Time off request submitted');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'denied':
        return <Badge variant="destructive">Denied</Badge>;
      default:
        return <Badge variant="warning">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      
      {/* Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-server-primary" />
            My Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Set your weekly availability to help managers schedule shifts.
          </p>
          <div className="space-y-3">
            {days.map(day => (
              <div key={day} className="flex items-center gap-4 py-2 border-b border-gray-100 dark:border-slate-700 last:border-0">
                <div className="w-28">
                  <span className="font-medium text-gray-900 dark:text-white capitalize">{day}</span>
                </div>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localAvailability[day]?.available !== false}
                    onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-server-primary focus:ring-server-primary"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Available</span>
                </label>
                
                {localAvailability[day]?.available !== false && (
                  <select
                    value={localAvailability[day]?.preferredShift || 'any'}
                    onChange={(e) => handleAvailabilityChange(day, 'preferredShift', e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="any">Any Shift</option>
                    <option value="lunch">Lunch Only</option>
                    <option value="dinner">Dinner Only</option>
                  </select>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
            <Button onClick={handleSaveAvailability}>
              <Save className="w-4 h-4 mr-2" />
              Save Availability
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Time Off Requests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-server-primary" />
              Time Off Requests
            </CardTitle>
            <Button size="sm" onClick={() => setShowTimeOffModal(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Request Time Off
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {myRequests.length > 0 ? (
            <div className="space-y-3">
              {myRequests.map(request => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{request.reason}</p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No time off requests yet
            </p>
          )}
        </CardContent>
      </Card>

      {/* Section Assignment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-server-primary" />
            Section Assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Section</label>
            <select className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white">
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-server-primary" />
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
                darkMode ? 'bg-server-primary' : 'bg-gray-300'
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
            <Bell className="w-5 h-5 text-server-primary" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Order Notifications</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when orders are ready</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications ? 'bg-server-primary' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  notifications ? 'translate-x-6' : ''
                }`}
              />
            </button>
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
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Reset all data to initial mock data. This will clear all current data.
          </p>
          <Button variant="destructive" onClick={() => setShowReloadConfirm(true)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload Mock Data
          </Button>
        </CardContent>
      </Card>

      {/* Reload Confirmation Modal */}
      {showReloadConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Confirm Reset
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to reload all mock data? This will permanently delete all current data.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowReloadConfirm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    reloadMockData();
                    setShowReloadConfirm(false);
                    window.location.reload();
                  }}
                  className="flex-1"
                >
                  Confirm Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Time Off Request Modal */}
      {showTimeOffModal && createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 99999 }}>
          <Card className="w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Request Time Off</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowTimeOffModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                <input
                  type="date"
                  value={timeOffForm.startDate}
                  onChange={(e) => setTimeOffForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                <input
                  type="date"
                  value={timeOffForm.endDate}
                  onChange={(e) => setTimeOffForm(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason</label>
                <textarea
                  value={timeOffForm.reason}
                  onChange={(e) => setTimeOffForm(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Enter reason for time off..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowTimeOffModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitTimeOff} 
                  disabled={!timeOffForm.startDate || !timeOffForm.endDate || !timeOffForm.reason}
                  className="flex-1"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Submit Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>,
        document.body
      )}
    </div>
  );
}

export default ServerSettings;
