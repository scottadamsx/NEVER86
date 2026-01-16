import { useState, useMemo } from 'react';
import { Calendar, Clock, Users, Lightbulb, Plus, X, ChevronLeft, ChevronRight, Check, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { scheduledShifts as initialShifts, timePunches, dailySalesSummary } from '../../data/generatedHistoricalData';
import { mockStaff } from '../../data/mockDataExtended';
import { generateWeeklyStaffingRecommendations } from '../../lib/dataGeneration/schedulingGenerator';

const Schedule = () => {
  const { timeOffRequests, updateTimeOffRequest } = useData();
  const { success } = useToast();
  
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day;
    return new Date(today.setDate(diff));
  });

  const [shifts, setShifts] = useState(initialShifts);
  const [showAddShift, setShowAddShift] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedShiftType, setSelectedShiftType] = useState('lunch');
  const [selectedStaffId, setSelectedStaffId] = useState('');

  // Get shifts for current week
  const weekShifts = useMemo(() => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const startStr = weekStart.toISOString().split('T')[0];
    const endStr = weekEnd.toISOString().split('T')[0];

    return shifts.filter(s => 
      s.date >= startStr && s.date < endStr
    );
  }, [weekStart, shifts]);

  // Generate staffing recommendations
  const recommendations = useMemo(() => {
    return generateWeeklyStaffingRecommendations(weekStart, dailySalesSummary);
  }, [weekStart]);

  // Staff hours summary - calculated from scheduled shifts
  const staffHours = useMemo(() => {
    const hoursByStaff = {};
    
    // Calculate from scheduled shifts for this week
    for (const shift of weekShifts) {
      if (!hoursByStaff[shift.staffId]) {
        const staff = mockStaff.find(s => s.id === shift.staffId);
        hoursByStaff[shift.staffId] = {
          staffId: shift.staffId,
          name: staff?.displayName || shift.staffName || 'Unknown',
          hours: 0,
          shifts: 0
        };
      }
      hoursByStaff[shift.staffId].hours += shift.scheduledHours || (shift.shiftType === 'lunch' ? 4 : 5);
      hoursByStaff[shift.staffId].shifts++;
    }

    return Object.values(hoursByStaff).sort((a, b) => b.hours - a.hours);
  }, [weekShifts]);

  const servers = mockStaff.filter(s => s.role === 'server');
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    days.push(date);
  }

  const getShiftsForDay = (date, shiftType) => {
    const dateStr = date.toISOString().split('T')[0];
    return weekShifts.filter(s => s.date === dateStr && s.shiftType === shiftType);
  };

  const getRecommendation = (date, shift) => {
    const dateStr = date.toISOString().split('T')[0];
    return recommendations?.find(r => r.date === dateStr && r.shift === shift);
  };

  const handleAddShift = () => {
    if (!selectedDay || !selectedStaffId) return;
    
    const staff = servers.find(s => s.id === selectedStaffId);
    const dateStr = selectedDay.toISOString().split('T')[0];
    
    const newShift = {
      id: `shift-${Date.now()}`,
      staffId: selectedStaffId,
      staffName: staff?.displayName || 'Unknown',
      date: dateStr,
      shiftType: selectedShiftType,
      startTime: selectedShiftType === 'lunch' ? '11:00' : '17:00',
      endTime: selectedShiftType === 'lunch' ? '15:00' : '22:00',
      scheduledHours: selectedShiftType === 'lunch' ? 4 : 5
    };
    
    setShifts(prev => [...prev, newShift]);
    setShowAddShift(false);
    setSelectedStaffId('');
    success('Shift added successfully');
  };

  const handleRemoveShift = (shiftId) => {
    setShifts(prev => prev.filter(s => s.id !== shiftId));
    success('Shift removed');
  };

  const pendingRequests = timeOffRequests?.filter(r => r.status === 'pending') || [];

  const handleApproveRequest = (requestId) => {
    updateTimeOffRequest(requestId, 'approved');
    success('Request approved');
  };

  const handleDenyRequest = (requestId) => {
    updateTimeOffRequest(requestId, 'denied');
    success('Request denied');
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(weekStart);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setWeekStart(newDate);
  };

  return (
    <div className="space-y-4 max-w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Schedule</h1>
            <p className="text-sm text-slate-400">Manage staff schedules and time tracking</p>
          </div>
          <Button onClick={() => setShowAddShift(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Shift
          </Button>
        </div>

        {/* Time Off Requests */}
        {pendingRequests.length > 0 && (
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
                Pending Time Off Requests ({pendingRequests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingRequests.map(request => {
                  const staff = mockStaff.find(s => s.id === request.staffId);
                  return (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{staff?.displayName || 'Unknown'}</p>
                        <p className="text-sm text-slate-400">
                          {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-slate-500">{request.reason}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleDenyRequest(request.id)}>
                          Deny
                        </Button>
                        <Button size="sm" onClick={() => handleApproveRequest(request.id)}>
                          Approve
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Schedule Grid */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Weekly Schedule
              </CardTitle>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => navigateWeek(-1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium px-4 min-w-[200px] text-center">
                  {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {
                    new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  }
                </span>
                <Button variant="ghost" size="icon" onClick={() => navigateWeek(1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="w-20 p-3 text-left text-xs font-medium text-slate-400 uppercase border-b border-slate-700">Shift</th>
                    {days.map((day, i) => {
                      const isToday = day.toDateString() === new Date().toDateString();
                      return (
                        <th key={i} className={`p-3 text-center border-b border-slate-700 min-w-[120px] ${isToday ? 'bg-primary/10' : ''}`}>
                          <p className="text-xs text-slate-400">{day.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                          <p className={`text-lg font-semibold ${isToday ? 'text-primary' : 'text-white'}`}>{day.getDate()}</p>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {/* Lunch Row */}
                  <tr>
                    <td className="p-3 border-b border-slate-700/50">
                      <span className="text-sm font-medium text-amber-400">Lunch</span>
                      <p className="text-xs text-slate-500">11am-3pm</p>
                    </td>
                    {days.map((day, i) => {
                      const dayShifts = getShiftsForDay(day, 'lunch');
                      const rec = getRecommendation(day, 'lunch');
                      const isUnder = rec && dayShifts.length < rec.recommendedServers;
                      
                      return (
                        <td key={i} className="p-2 border-b border-slate-700/50 align-top">
                          <div className="space-y-1">
                            {rec && (
                              <div className={`text-xs px-2 py-0.5 rounded text-center mb-2 ${
                                isUnder ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                              }`}>
                                {dayShifts.length}/{rec.recommendedServers} staff
                              </div>
                            )}
                            {dayShifts.map(shift => (
                              <div 
                                key={shift.id}
                                className="group flex items-center justify-between text-xs px-2 py-1.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20"
                              >
                                <span className="truncate">{shift.staffName?.split(' ')[0]}</span>
                                <button 
                                  onClick={() => handleRemoveShift(shift.id)}
                                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 ml-1"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                setSelectedDay(day);
                                setSelectedShiftType('lunch');
                                setShowAddShift(true);
                              }}
                              className="w-full text-xs px-2 py-1 rounded border border-dashed border-slate-600 text-slate-500 hover:border-slate-500 hover:text-slate-400 transition-colors"
                            >
                              + Add
                            </button>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                  
                  {/* Dinner Row */}
                  <tr>
                    <td className="p-3">
                      <span className="text-sm font-medium text-blue-400">Dinner</span>
                      <p className="text-xs text-slate-500">5pm-10pm</p>
                    </td>
                    {days.map((day, i) => {
                      const dayShifts = getShiftsForDay(day, 'dinner');
                      const rec = getRecommendation(day, 'dinner');
                      const isUnder = rec && dayShifts.length < rec.recommendedServers;
                      
                      return (
                        <td key={i} className="p-2 align-top">
                          <div className="space-y-1">
                            {rec && (
                              <div className={`text-xs px-2 py-0.5 rounded text-center mb-2 ${
                                isUnder ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                              }`}>
                                {dayShifts.length}/{rec.recommendedServers} staff
                              </div>
                            )}
                            {dayShifts.map(shift => (
                              <div 
                                key={shift.id}
                                className="group flex items-center justify-between text-xs px-2 py-1.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20"
                              >
                                <span className="truncate">{shift.staffName?.split(' ')[0]}</span>
                                <button 
                                  onClick={() => handleRemoveShift(shift.id)}
                                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 ml-1"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                setSelectedDay(day);
                                setSelectedShiftType('dinner');
                                setShowAddShift(true);
                              }}
                              className="w-full text-xs px-2 py-1 rounded border border-dashed border-slate-600 text-slate-500 hover:border-slate-500 hover:text-slate-400 transition-colors"
                            >
                              + Add
                            </button>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Staff Hours */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Hours This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase">Staff</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase">Shifts</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase">Hours</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {staffHours.length > 0 ? staffHours.map(staff => (
                        <tr key={staff.staffId} className="hover:bg-slate-800/50">
                          <td className="px-4 py-3 text-white">{staff.name}</td>
                          <td className="px-4 py-3 text-slate-300">{staff.shifts}</td>
                          <td className="px-4 py-3 text-slate-300">{staff.hours.toFixed(1)}h</td>
                          <td className="px-4 py-3">
                            {staff.hours > 40 ? (
                              <Badge variant="warning">Overtime</Badge>
                            ) : (
                              <Badge variant="success">Normal</Badge>
                            )}
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                            No time punches for this week
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Week Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Week Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Total Shifts</span>
                  <span className="font-medium text-white">{weekShifts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Servers Scheduled</span>
                  <span className="font-medium text-white">
                    {new Set(weekShifts.map(s => s.staffId)).size}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Lunch Shifts</span>
                  <Badge variant="warning">{weekShifts.filter(s => s.shiftType === 'lunch').length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Dinner Shifts</span>
                  <Badge>{weekShifts.filter(s => s.shiftType === 'dinner').length}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  Smart Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-400">
                <p>• Friday dinner typically needs 6+ servers</p>
                <p>• Sundays are 20% busier than weekdays</p>
                <p>• Consider cross-training 2 more hosts</p>
              </CardContent>
            </Card>
          </div>
        </div>

      {/* Add Shift Modal */}
      {showAddShift && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add Shift</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowAddShift(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDay?.toISOString().split('T')[0] || ''}
                  onChange={(e) => setSelectedDay(new Date(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Shift Type</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedShiftType('lunch')}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                      selectedShiftType === 'lunch'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    Lunch (11am-3pm)
                  </button>
                  <button
                    onClick={() => setSelectedShiftType('dinner')}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                      selectedShiftType === 'dinner'
                        ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                        : 'border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    Dinner (5pm-10pm)
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Staff Member</label>
                <div className="space-y-2">
                  {servers.map(server => {
                    if (!selectedDay) return null;
                    const dateStr = selectedDay.toISOString().split('T')[0];
                    
                    // Check if already scheduled
                    const alreadyScheduled = shifts.some(
                      s => s.staffId === server.id && s.date === dateStr && s.shiftType === selectedShiftType
                    );
                    
                    // Check if has approved time off for this date
                    const hasApprovedTimeOff = timeOffRequests?.some(req => {
                      if (req.staffId !== server.id || req.status !== 'approved') return false;
                      const reqStart = new Date(req.startDate);
                      const reqEnd = new Date(req.endDate);
                      const checkDate = new Date(dateStr);
                      return checkDate >= reqStart && checkDate <= reqEnd;
                    });
                    
                    const isDisabled = alreadyScheduled || hasApprovedTimeOff;
                    const isSelected = selectedStaffId === server.id;
                    
                    if (alreadyScheduled) return null; // Hide already scheduled
                    
                    return (
                      <button
                        key={server.id}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => !isDisabled && setSelectedStaffId(server.id)}
                        className={`w-full px-4 py-3 rounded-lg border text-left transition-colors ${
                          isSelected
                            ? 'bg-primary/20 border-primary text-white'
                            : isDisabled
                              ? 'bg-slate-800/50 border-slate-700 text-slate-500 cursor-not-allowed'
                              : 'border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{server.displayName}</span>
                          {hasApprovedTimeOff && (
                            <Badge variant="warning" className="text-xs">Approved Time Off</Badge>
                          )}
                        </div>
                      </button>
                    );
                  })}
                  {selectedDay && servers.every(server => {
                    const dateStr = selectedDay.toISOString().split('T')[0];
                    return shifts.some(s => s.staffId === server.id && s.date === dateStr && s.shiftType === selectedShiftType);
                  }) && (
                    <p className="text-sm text-slate-400 text-center py-2">All servers already scheduled for this shift</p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowAddShift(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddShift} disabled={!selectedDay || !selectedStaffId} className="flex-1">
                  <Check className="w-4 h-4 mr-2" />
                  Add Shift
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Schedule;
