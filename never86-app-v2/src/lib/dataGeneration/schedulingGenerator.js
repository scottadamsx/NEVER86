// Scheduling Generator
// Generates schedules and recommends staffing levels

import { restaurantConfig, isWeekend, isHoliday } from './config.js';

// Shift definitions
export const shiftTypes = {
  breakfast: { start: '06:00', end: '11:00', label: 'Breakfast' },
  lunch: { start: '11:00', end: '16:00', label: 'Lunch' },
  dinner: { start: '16:00', end: '23:00', label: 'Dinner' },
  all_day: { start: '11:00', end: '23:00', label: 'All Day' }
};

// Generate staffing recommendation based on historical data
export const generateStaffingRecommendation = (date, shift, historicalSales) => {
  const { staffingRatios } = restaurantConfig;
  
  // Get similar historical shifts (same day of week, same shift)
  const dayOfWeek = date.getDay();
  const similarShifts = historicalSales.filter(s => {
    const sDate = new Date(s.date);
    return sDate.getDay() === dayOfWeek;
  });
  
  if (similarShifts.length === 0) {
    return {
      date: date.toISOString().split('T')[0],
      shift,
      recommendedServers: 3,
      recommendedHosts: 1,
      recommendedCooks: 2,
      confidence: 0.3,
      reasoning: 'No historical data available. Using default staffing.'
    };
  }
  
  // Calculate average and peak tables
  const tableCounts = similarShifts.map(s => s.totalTables || s.tableCount || 0);
  const avgTables = tableCounts.reduce((a, b) => a + b, 0) / tableCounts.length;
  const peakTables = Math.max(...tableCounts);
  
  // Apply multipliers
  let adjustedPeak = peakTables;
  if (isWeekend(date)) adjustedPeak *= 1.2;
  if (isHoliday(date)) adjustedPeak *= 1.5;
  
  // Calculate staffing needs
  const recommendedServers = Math.ceil(adjustedPeak / staffingRatios.tablesPerServer);
  const recommendedHosts = Math.max(1, Math.ceil(avgTables / staffingRatios.tablesPerHost));
  const recommendedCooks = Math.max(2, Math.ceil((adjustedPeak * 2.5) / staffingRatios.coversPerCook));
  
  // Calculate confidence based on data quality
  const confidence = Math.min(0.95, 0.3 + (similarShifts.length * 0.05));
  
  return {
    date: date.toISOString().split('T')[0],
    shift,
    recommendedServers,
    recommendedHosts,
    recommendedCooks,
    expectedTables: Math.round(avgTables),
    peakTables: Math.round(adjustedPeak),
    confidence: Math.round(confidence * 100) / 100,
    reasoning: `Based on ${similarShifts.length} similar ${shift} shifts, ` +
      `expecting ~${Math.round(avgTables)} tables with peaks of ${Math.round(adjustedPeak)}.`
  };
};

// Generate a week of staffing recommendations
export const generateWeeklyStaffingRecommendations = (weekStartDate, historicalSales) => {
  const recommendations = [];
  const current = new Date(weekStartDate);
  
  for (let day = 0; day < 7; day++) {
    for (const shift of ['lunch', 'dinner']) {
      recommendations.push(
        generateStaffingRecommendation(new Date(current), shift, historicalSales)
      );
    }
    current.setDate(current.getDate() + 1);
  }
  
  return recommendations;
};

// Generate scheduled shifts
export const generateScheduledShifts = (staffList, weekStartDate, recommendations) => {
  const shifts = [];
  const servers = staffList.filter(s => s.role === 'server');
  
  let shiftIdCounter = 1;
  
  for (const rec of recommendations) {
    // Assign servers to this shift
    const serversNeeded = rec.recommendedServers;
    const availableServers = [...servers];
    
    for (let i = 0; i < Math.min(serversNeeded, availableServers.length); i++) {
      const serverIndex = i % availableServers.length;
      const server = availableServers[serverIndex];
      const shiftDef = shiftTypes[rec.shift];
      
      shifts.push({
        id: `shift-${shiftIdCounter++}`,
        staffId: server.id,
        staffName: server.displayName,
        date: rec.date,
        shiftType: rec.shift,
        startTime: shiftDef.start,
        endTime: shiftDef.end,
        role: 'server',
        status: 'scheduled',
        createdAt: new Date().toISOString()
      });
    }
  }
  
  return shifts;
};

// Generate time punch records
export const generateTimePunches = (scheduledShifts) => {
  const punches = [];
  let punchIdCounter = 1;
  
  for (const shift of scheduledShifts) {
    const shiftDate = new Date(shift.date);
    const [startHour, startMin] = shift.startTime.split(':').map(Number);
    const [endHour, endMin] = shift.endTime.split(':').map(Number);
    
    // Add some variance to clock times (±5 minutes)
    const clockInVariance = Math.floor(Math.random() * 10) - 5;
    const clockOutVariance = Math.floor(Math.random() * 10) - 5;
    
    const clockIn = new Date(shiftDate);
    clockIn.setHours(startHour, startMin + clockInVariance, 0);
    
    const clockOut = new Date(shiftDate);
    clockOut.setHours(endHour, endMin + clockOutVariance, 0);
    
    // Break duration (0 for short shifts, 30 for long shifts)
    const shiftHours = endHour - startHour;
    const breakMinutes = shiftHours > 6 ? 30 : 0;
    
    punches.push({
      id: `punch-${punchIdCounter++}`,
      staffId: shift.staffId,
      scheduledShiftId: shift.id,
      clockInTime: clockIn.toISOString(),
      clockOutTime: clockOut.toISOString(),
      breakMinutes,
      hoursWorked: Math.round(((clockOut - clockIn) / 3600000 - breakMinutes / 60) * 100) / 100,
      notes: '',
      approvedBy: null,
      approvedAt: null
    });
  }
  
  return punches;
};

// Calculate labor costs
export const calculateLaborCosts = (timePunches, hourlyRates = {}) => {
  const defaultRate = restaurantConfig.laborCostPerHour;
  
  return timePunches.map(punch => ({
    ...punch,
    hourlyRate: hourlyRates[punch.staffId] || defaultRate,
    laborCost: Math.round((punch.hoursWorked * (hourlyRates[punch.staffId] || defaultRate)) * 100) / 100
  }));
};

// Aggregate labor costs by date
export const aggregateLaborByDate = (laborData) => {
  const byDate = {};
  
  for (const record of laborData) {
    const date = record.clockInTime.split('T')[0];
    if (!byDate[date]) {
      byDate[date] = {
        date,
        totalHours: 0,
        totalCost: 0,
        staffCount: 0
      };
    }
    byDate[date].totalHours += record.hoursWorked;
    byDate[date].totalCost += record.laborCost;
    byDate[date].staffCount++;
  }
  
  return Object.values(byDate);
};

// Check for scheduling conflicts
export const checkSchedulingConflicts = (shifts) => {
  const conflicts = [];
  const byStaff = {};
  
  for (const shift of shifts) {
    if (!byStaff[shift.staffId]) {
      byStaff[shift.staffId] = [];
    }
    byStaff[shift.staffId].push(shift);
  }
  
  for (const [staffId, staffShifts] of Object.entries(byStaff)) {
    // Check for overlapping shifts on the same day
    const byDate = {};
    for (const shift of staffShifts) {
      if (!byDate[shift.date]) byDate[shift.date] = [];
      byDate[shift.date].push(shift);
    }
    
    for (const [date, dayShifts] of Object.entries(byDate)) {
      if (dayShifts.length > 1) {
        conflicts.push({
          staffId,
          date,
          shifts: dayShifts,
          type: 'overlap',
          message: `Staff ${staffId} has ${dayShifts.length} shifts on ${date}`
        });
      }
    }
  }
  
  return conflicts;
};
