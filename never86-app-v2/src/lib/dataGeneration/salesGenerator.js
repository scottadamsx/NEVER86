// Sales Data Generator
// Generates realistic historical sales with proper patterns

import { restaurantConfig, isHoliday, isWeekend } from './config.js';

// Seeded random for reproducible results
let seed = 12345;
const seededRandom = () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
};

export const resetSeed = (newSeed = 12345) => {
  seed = newSeed;
};

// Random number in range
const random = (min, max) => Math.floor(seededRandom() * (max - min + 1)) + min;
const randomFloat = (min, max) => seededRandom() * (max - min) + min;

// Weighted random selection
const weightedRandomSelect = (items, weights) => {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let r = seededRandom() * totalWeight;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
};

// Calculate table count for a given hour
export const calculateTableCount = (date, hour, config = restaurantConfig) => {
  const { multipliers, baseTablesPerHour } = config;
  
  let tables = baseTablesPerHour;
  
  // Time of day multipliers
  if (hour >= multipliers.lunchRush.start && hour < multipliers.lunchRush.end) {
    tables *= multipliers.lunchRush.factor;
  } else if (hour >= multipliers.dinnerRush.start && hour < multipliers.dinnerRush.end) {
    tables *= multipliers.dinnerRush.factor;
  } else if (hour < 11 || hour > 21) {
    tables *= multipliers.slowPeriod.factor;
  }
  
  // Weekend multiplier
  if (isWeekend(date)) {
    tables *= multipliers.weekend;
  }
  
  // Holiday multiplier
  if (isHoliday(date)) {
    tables *= multipliers.holiday;
  }
  
  // Add randomness (±25%)
  const randomFactor = 0.75 + (seededRandom() * 0.5);
  tables *= randomFactor;
  
  return Math.round(Math.max(0, tables));
};

// Generate order items for tables
export const generateOrderItems = (tableCount, hour, menuItems, menuPopularity) => {
  const orders = [];
  const itemIds = Object.keys(menuPopularity);
  const weights = Object.values(menuPopularity);
  
  for (let table = 0; table < tableCount; table++) {
    const guestCount = random(1, 6);
    const itemsPerTable = random(2, Math.min(4, guestCount + 1));
    
    for (let j = 0; j < itemsPerTable; j++) {
      const menuItemId = weightedRandomSelect(itemIds, weights);
      const menuItem = menuItems.find(m => m.id === menuItemId);
      
      if (menuItem && menuItem.available !== false) {
        orders.push({
          menuItemId,
          name: menuItem.name,
          quantity: 1,
          price: menuItem.price,
          guestNumber: random(1, guestCount),
          timestamp: new Date()
        });
      }
    }
  }
  
  return orders;
};

// Calculate revenue from orders
export const calculateRevenue = (items) => {
  return items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
};

// Generate a full day of sales data
export const generateDailySales = (date, menuItems, config = restaurantConfig) => {
  const hourlyData = [];
  
  for (let hour = config.openHour; hour <= config.closeHour; hour++) {
    const tableCount = calculateTableCount(date, hour, config);
    const items = generateOrderItems(tableCount, hour, menuItems, config.menuPopularity);
    const revenue = calculateRevenue(items);
    
    hourlyData.push({
      date: new Date(date),
      hour,
      tableCount,
      revenue: Math.round(revenue * 100) / 100,
      averageCheck: tableCount > 0 ? Math.round((revenue / tableCount) * 100) / 100 : 0,
      itemCount: items.length,
      items
    });
  }
  
  return hourlyData;
};

// Generate historical sales for a date range
export const generateHistoricalSales = (startDate, endDate, menuItems, config = restaurantConfig) => {
  resetSeed(12345); // Reset for reproducibility
  const allData = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dailyData = generateDailySales(new Date(current), menuItems, config);
    allData.push(...dailyData);
    current.setDate(current.getDate() + 1);
  }
  
  return allData;
};

// Aggregate sales data by day
export const aggregateDailySales = (hourlyData) => {
  const byDay = {};
  
  for (const entry of hourlyData) {
    const dayKey = entry.date.toISOString().split('T')[0];
    if (!byDay[dayKey]) {
      byDay[dayKey] = {
        date: dayKey,
        totalRevenue: 0,
        totalTables: 0,
        totalItems: 0,
        averageCheck: 0,
        peakHour: null,
        peakRevenue: 0
      };
    }
    
    byDay[dayKey].totalRevenue += entry.revenue;
    byDay[dayKey].totalTables += entry.tableCount;
    byDay[dayKey].totalItems += entry.itemCount;
    
    if (entry.revenue > byDay[dayKey].peakRevenue) {
      byDay[dayKey].peakHour = entry.hour;
      byDay[dayKey].peakRevenue = entry.revenue;
    }
  }
  
  // Calculate averages
  for (const day of Object.values(byDay)) {
    day.averageCheck = day.totalTables > 0 
      ? Math.round((day.totalRevenue / day.totalTables) * 100) / 100 
      : 0;
    day.totalRevenue = Math.round(day.totalRevenue * 100) / 100;
  }
  
  return Object.values(byDay);
};

// Aggregate sales by week
export const aggregateWeeklySales = (dailyData) => {
  const byWeek = {};
  
  for (const day of dailyData) {
    const date = new Date(day.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!byWeek[weekKey]) {
      byWeek[weekKey] = {
        weekStart: weekKey,
        totalRevenue: 0,
        totalTables: 0,
        totalItems: 0,
        daysWithData: 0
      };
    }
    
    byWeek[weekKey].totalRevenue += day.totalRevenue;
    byWeek[weekKey].totalTables += day.totalTables;
    byWeek[weekKey].totalItems += day.totalItems;
    byWeek[weekKey].daysWithData++;
  }
  
  return Object.values(byWeek);
};
