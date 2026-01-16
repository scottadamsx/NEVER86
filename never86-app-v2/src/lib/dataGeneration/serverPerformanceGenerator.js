// Server Performance Generator
// Creates realistic performance data for each server

import { restaurantConfig, isWeekend } from './config.js';

// Seeded random
let seed = 54321;
const seededRandom = () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
};

const resetSeed = (newSeed = 54321) => {
  seed = newSeed;
};

const random = (min, max) => Math.floor(seededRandom() * (max - min + 1)) + min;
const randomFloat = (min, max) => seededRandom() * (max - min) + min;

// Server skill levels affect performance
export const serverSkillLevels = {
  'staff-2': 4.5, // Maria - excellent
  'staff-3': 3.5, // Jake - good
  'staff-4': 4.0, // Sophie - very good
  'staff-5': 3.0, // Michael - average
  'staff-6': 4.2, // Emily - very good
  'staff-7': 2.5, // David - below average
  'staff-8': 3.8, // Olivia - good
};

// Calculate turnover time based on skill
export const calculateTurnoverTime = (skillLevel) => {
  // Skill 1: 55-65 min, Skill 5: 35-45 min
  const baseTime = 70 - (skillLevel * 6);
  const variation = -5 + (seededRandom() * 10);
  return Math.round(baseTime + variation);
};

// Calculate tips based on tables, shift, and skill
export const calculateTips = (tablesServed, shift, skillLevel) => {
  const basePerTable = shift === 'dinner' ? 12 : 8;
  const skillBonus = skillLevel * 2;
  const perTableTip = basePerTable + skillBonus + (seededRandom() * 5);
  return Math.round(tablesServed * perTableTip * 100) / 100;
};

// Calculate error rate based on skill
export const calculateErrors = (tablesServed, skillLevel) => {
  // Higher skill = fewer errors
  const errorProbability = 0.15 - (skillLevel * 0.02);
  let errors = 0;
  for (let i = 0; i < tablesServed; i++) {
    if (seededRandom() < errorProbability) errors++;
  }
  return errors;
};

// Calculate customer satisfaction (1-5)
export const calculateSatisfaction = (skillLevel) => {
  const baseSatisfaction = 2.5 + (skillLevel * 0.5);
  const variation = -0.3 + (seededRandom() * 0.6);
  return Math.min(5, Math.max(1, Math.round((baseSatisfaction + variation) * 10) / 10));
};

// Get tables served based on shift and skill
export const calculateTablesServed = (shift, skillLevel, date) => {
  let baseTables;
  switch (shift) {
    case 'breakfast': baseTables = 4; break;
    case 'lunch': baseTables = 6; break;
    case 'dinner': baseTables = 8; break;
    default: baseTables = 6;
  }
  
  // Skill bonus
  baseTables *= (0.7 + (skillLevel * 0.1));
  
  // Weekend bonus
  if (isWeekend(date)) {
    baseTables *= 1.2;
  }
  
  // Random variation
  baseTables *= (0.85 + seededRandom() * 0.3);
  
  return Math.round(baseTables);
};

// Calculate upsell rate
export const calculateUpsellRate = (skillLevel) => {
  // Higher skill = better upselling
  const baseRate = 0.15 + (skillLevel * 0.08);
  const variation = -0.05 + (seededRandom() * 0.1);
  return Math.min(0.8, Math.max(0.05, baseRate + variation));
};

// Generate performance for a single shift
export const generateShiftPerformance = (serverId, date, shift) => {
  const skillLevel = serverSkillLevels[serverId] || 3;
  const tablesServed = calculateTablesServed(shift, skillLevel, date);
  const turnoverTime = calculateTurnoverTime(skillLevel);
  const tips = calculateTips(tablesServed, shift, skillLevel);
  const errors = calculateErrors(tablesServed, skillLevel);
  const satisfaction = calculateSatisfaction(skillLevel);
  const upsellRate = calculateUpsellRate(skillLevel);
  
  // Calculate sales based on tables and average check
  const averageCheck = restaurantConfig.averageCheck * (0.9 + seededRandom() * 0.2);
  const totalSales = Math.round(tablesServed * averageCheck * 100) / 100;
  
  return {
    serverId,
    date: date.toISOString().split('T')[0],
    shift,
    tablesServed,
    averageTurnoverTime: turnoverTime,
    totalTips: tips,
    totalSales,
    averageCheckSize: Math.round(averageCheck * 100) / 100,
    errorCount: errors,
    customerSatisfaction: satisfaction,
    upsellRate: Math.round(upsellRate * 100) / 100
  };
};

// Generate performance history for a server
export const generateServerPerformance = (serverId, startDate, endDate) => {
  resetSeed(parseInt(serverId.replace(/\D/g, '')) * 1000);
  const performances = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    // Servers typically work 4-5 shifts per week
    if (seededRandom() < 0.65) {
      // Pick a random shift
      const shifts = ['lunch', 'dinner'];
      const shift = shifts[Math.floor(seededRandom() * shifts.length)];
      
      performances.push(generateShiftPerformance(serverId, new Date(current), shift));
    }
    
    current.setDate(current.getDate() + 1);
  }
  
  return performances;
};

// Generate performance for all servers
export const generateAllServerPerformance = (serverIds, startDate, endDate) => {
  const allPerformance = [];
  
  for (const serverId of serverIds) {
    const serverData = generateServerPerformance(serverId, startDate, endDate);
    allPerformance.push(...serverData);
  }
  
  return allPerformance;
};

// Calculate KPIs for a server
export const calculateServerKPIs = (performances) => {
  if (performances.length === 0) return null;
  
  const serverId = performances[0].serverId;
  const totalShifts = performances.length;
  
  const sums = performances.reduce((acc, p) => ({
    tables: acc.tables + p.tablesServed,
    turnover: acc.turnover + p.averageTurnoverTime,
    tips: acc.tips + p.totalTips,
    sales: acc.sales + p.totalSales,
    errors: acc.errors + p.errorCount,
    satisfaction: acc.satisfaction + p.customerSatisfaction,
    upsell: acc.upsell + p.upsellRate
  }), { tables: 0, turnover: 0, tips: 0, sales: 0, errors: 0, satisfaction: 0, upsell: 0 });
  
  return {
    serverId,
    totalShifts,
    totalTablesServed: sums.tables,
    averageTablesPerShift: Math.round((sums.tables / totalShifts) * 10) / 10,
    averageTurnoverTime: Math.round(sums.turnover / totalShifts),
    totalTips: Math.round(sums.tips * 100) / 100,
    averageTipsPerShift: Math.round((sums.tips / totalShifts) * 100) / 100,
    totalSales: Math.round(sums.sales * 100) / 100,
    averageSalesPerShift: Math.round((sums.sales / totalShifts) * 100) / 100,
    totalErrors: sums.errors,
    errorRate: Math.round((sums.errors / sums.tables) * 1000) / 10, // per 100 tables
    averageSatisfaction: Math.round((sums.satisfaction / totalShifts) * 10) / 10,
    averageUpsellRate: Math.round((sums.upsell / totalShifts) * 100) // as percentage
  };
};

// Rank servers by a metric
export const rankServersByMetric = (allKPIs, metric, ascending = false) => {
  const sorted = [...allKPIs].sort((a, b) => {
    const diff = a[metric] - b[metric];
    return ascending ? diff : -diff;
  });
  
  return sorted.map((kpi, index) => ({
    ...kpi,
    rank: index + 1,
    percentile: Math.round(((allKPIs.length - index) / allKPIs.length) * 100)
  }));
};
