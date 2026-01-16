// Pre-generated Historical Data for Never86
// 12 weeks of realistic restaurant operations data

import { mockMenuItems, mockInventory, mockStaff } from './mockDataExtended.js';

// Helper functions
const getDate = (daysAgo, hour = 12, minute = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, minute, 0, 0);
  return date;
};

const random = (min, max, seed = null) => {
  if (seed !== null) {
    const x = Math.sin(seed) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomFloat = (min, max) => Math.random() * (max - min) + min;

// Weighted random selection
const weightedSelect = (items, weights) => {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
};

// Check if weekend
const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

// Menu item popularity weights
const menuPopularity = {
  'menu-1': 15, // Ribeye
  'menu-2': 12, // Salmon
  'menu-3': 11, // Chicken Parm
  'menu-4': 10, // Pasta
  'menu-5': 13, // Caesar
  'menu-6': 6,  // Soup
  'menu-7': 8,  // Calamari
  'menu-8': 5,  // Bruschetta
  'menu-9': 2,  // Chocolate Cake
  'menu-10': 4, // Tiramisu
  'menu-11': 5, // Red Wine
  'menu-12': 4, // White Wine
  'menu-13': 3, // Beer
  'menu-14': 2, // Soft Drinks
};

// Server IDs
const serverIds = ['staff-2', 'staff-3', 'staff-4', 'staff-5', 'staff-6', 'staff-7', 'staff-8'];

// Server skill levels (1-5)
const serverSkills = {
  'staff-2': 4.5, // Maria - excellent
  'staff-3': 3.5, // Jake
  'staff-4': 4.0, // Sophie
  'staff-5': 3.0, // Michael
  'staff-6': 4.2, // Emily
  'staff-7': 2.5, // David
  'staff-8': 3.8, // Olivia
};

// Generate historical orders (12 weeks = 84 days)
const generateHistoricalOrders = () => {
  const orders = [];
  let orderIdCounter = 10000;
  let itemIdCounter = 100000;

  for (let daysAgo = 84; daysAgo >= 1; daysAgo--) {
    const date = getDate(daysAgo);
    const dayOfWeek = date.getDay();
    const weekend = isWeekend(date);
    
    // Tables per day varies by day of week
    let baseTables = 45; // Weekday average
    if (weekend) baseTables = 65; // Weekend is busier
    if (dayOfWeek === 5) baseTables = 55; // Friday
    
    // Add randomness
    const tablesPerDay = baseTables + random(-10, 15);
    
    // Distribute across lunch and dinner
    const lunchTables = Math.floor(tablesPerDay * 0.35);
    const dinnerTables = tablesPerDay - lunchTables;
    
    // Generate lunch orders (11am - 2pm)
    for (let t = 0; t < lunchTables; t++) {
      const serverId = serverIds[t % serverIds.length];
      const hour = random(11, 14);
      const minute = random(0, 59);
      const guestCount = random(1, 4);
      const seatedAt = new Date(date);
      seatedAt.setHours(hour, minute, 0, 0);
      
      const orderCreated = new Date(seatedAt);
      orderCreated.setMinutes(orderCreated.getMinutes() + random(5, 15));
      
      const turnoverTime = random(45, 75); // Lunch is faster
      const closedAt = new Date(seatedAt);
      closedAt.setMinutes(closedAt.getMinutes() + turnoverTime);
      
      // Generate items
      const itemCount = random(2, Math.min(4, guestCount + 1));
      const items = [];
      const menuItemIds = Object.keys(menuPopularity);
      const weights = Object.values(menuPopularity);
      
      for (let i = 0; i < itemCount; i++) {
        const menuItemId = weightedSelect(menuItemIds, weights);
        const menuItem = mockMenuItems.find(m => m.id === menuItemId);
        if (menuItem) {
          items.push({
            id: `oi-${itemIdCounter++}`,
            menuItemId,
            name: menuItem.name,
            guestNumber: random(1, guestCount),
            modifications: random(0, 5) === 0 ? 'special request' : '',
            notes: '',
            price: menuItem.price,
            sentToKitchen: true,
            category: menuItem.category
          });
        }
      }
      
      const subtotal = items.reduce((sum, i) => sum + i.price, 0);
      const tipPercent = random(15, 22);
      const tip = Math.round(subtotal * tipPercent / 100);
      
      orders.push({
        id: `order-${orderIdCounter++}`,
        tableId: `t${random(1, 20)}`,
        serverId,
        guestCount,
        status: 'completed',
        items,
        createdAt: orderCreated.toISOString(),
        closedAt: closedAt.toISOString(),
        tip,
        shift: 'lunch'
      });
    }
    
    // Generate dinner orders (5pm - 10pm)
    for (let t = 0; t < dinnerTables; t++) {
      const serverId = serverIds[t % serverIds.length];
      const hour = random(17, 21);
      const minute = random(0, 59);
      const guestCount = random(2, 6);
      const seatedAt = new Date(date);
      seatedAt.setHours(hour, minute, 0, 0);
      
      const orderCreated = new Date(seatedAt);
      orderCreated.setMinutes(orderCreated.getMinutes() + random(8, 20));
      
      const turnoverTime = random(60, 100); // Dinner is slower
      const closedAt = new Date(seatedAt);
      closedAt.setMinutes(closedAt.getMinutes() + turnoverTime);
      
      // Generate items
      const itemCount = random(3, Math.min(6, guestCount + 2));
      const items = [];
      const menuItemIds = Object.keys(menuPopularity);
      const weights = Object.values(menuPopularity);
      
      for (let i = 0; i < itemCount; i++) {
        const menuItemId = weightedSelect(menuItemIds, weights);
        const menuItem = mockMenuItems.find(m => m.id === menuItemId);
        if (menuItem) {
          items.push({
            id: `oi-${itemIdCounter++}`,
            menuItemId,
            name: menuItem.name,
            guestNumber: random(1, guestCount),
            modifications: random(0, 5) === 0 ? 'special request' : '',
            notes: '',
            price: menuItem.price,
            sentToKitchen: true,
            category: menuItem.category
          });
        }
      }
      
      const subtotal = items.reduce((sum, i) => sum + i.price, 0);
      const tipPercent = random(18, 25); // Dinner tips are higher
      const tip = Math.round(subtotal * tipPercent / 100);
      
      orders.push({
        id: `order-${orderIdCounter++}`,
        tableId: `t${random(1, 20)}`,
        serverId,
        guestCount,
        status: 'completed',
        items,
        createdAt: orderCreated.toISOString(),
        closedAt: closedAt.toISOString(),
        tip,
        shift: 'dinner'
      });
    }
  }
  
  return orders;
};

// Generate server performance data
const generateServerPerformanceData = (orders) => {
  const performances = [];
  
  // Group orders by server and date
  const byServerDate = {};
  for (const order of orders) {
    const date = order.createdAt.split('T')[0];
    const key = `${order.serverId}-${date}-${order.shift}`;
    if (!byServerDate[key]) {
      byServerDate[key] = {
        serverId: order.serverId,
        date,
        shift: order.shift,
        orders: []
      };
    }
    byServerDate[key].orders.push(order);
  }
  
  // Calculate performance for each shift
  for (const [key, data] of Object.entries(byServerDate)) {
    const skillLevel = serverSkills[data.serverId] || 3;
    const tablesServed = data.orders.length;
    const totalSales = data.orders.reduce((sum, o) => 
      sum + o.items.reduce((s, i) => s + i.price, 0), 0
    );
    const totalTips = data.orders.reduce((sum, o) => sum + (o.tip || 0), 0);
    
    // Calculate average turnover time
    let totalTurnover = 0;
    for (const order of data.orders) {
      const created = new Date(order.createdAt);
      const closed = new Date(order.closedAt);
      totalTurnover += (closed - created) / 60000;
    }
    const avgTurnover = tablesServed > 0 ? totalTurnover / tablesServed : 0;
    
    // Error count based on skill
    const errorRate = 0.15 - (skillLevel * 0.02);
    const errorCount = Math.floor(tablesServed * errorRate * Math.random());
    
    // Customer satisfaction
    const baseSatisfaction = 2.5 + (skillLevel * 0.5);
    const satisfaction = Math.min(5, Math.max(1, baseSatisfaction + (Math.random() - 0.5)));
    
    // Upsell rate (appetizers + desserts / total tables)
    const upsellItems = data.orders.reduce((count, o) => 
      count + o.items.filter(i => 
        i.category === 'appetizers' || i.category === 'desserts'
      ).length, 0
    );
    const upsellRate = tablesServed > 0 ? upsellItems / tablesServed : 0;
    
    performances.push({
      serverId: data.serverId,
      date: data.date,
      shift: data.shift,
      tablesServed,
      totalSales: Math.round(totalSales * 100) / 100,
      totalTips: Math.round(totalTips * 100) / 100,
      averageTurnoverTime: Math.round(avgTurnover),
      averageCheck: tablesServed > 0 ? Math.round((totalSales / tablesServed) * 100) / 100 : 0,
      errorCount,
      customerSatisfaction: Math.round(satisfaction * 10) / 10,
      upsellRate: Math.round(upsellRate * 100) / 100
    });
  }
  
  return performances;
};

// Generate daily sales summary
const generateDailySalesSummary = (orders) => {
  const byDay = {};
  
  for (const order of orders) {
    const date = order.createdAt.split('T')[0];
    if (!byDay[date]) {
      byDay[date] = {
        date,
        totalRevenue: 0,
        totalTips: 0,
        totalTables: 0,
        lunchTables: 0,
        dinnerTables: 0,
        lunchRevenue: 0,
        dinnerRevenue: 0,
        itemsSold: 0
      };
    }
    
    const orderTotal = order.items.reduce((s, i) => s + i.price, 0);
    byDay[date].totalRevenue += orderTotal;
    byDay[date].totalTips += order.tip || 0;
    byDay[date].totalTables++;
    byDay[date].itemsSold += order.items.length;
    
    if (order.shift === 'lunch') {
      byDay[date].lunchTables++;
      byDay[date].lunchRevenue += orderTotal;
    } else {
      byDay[date].dinnerTables++;
      byDay[date].dinnerRevenue += orderTotal;
    }
  }
  
  return Object.values(byDay)
    .map(d => ({
      ...d,
      totalRevenue: Math.round(d.totalRevenue * 100) / 100,
      totalTips: Math.round(d.totalTips * 100) / 100,
      lunchRevenue: Math.round(d.lunchRevenue * 100) / 100,
      dinnerRevenue: Math.round(d.dinnerRevenue * 100) / 100,
      averageCheck: Math.round((d.totalRevenue / d.totalTables) * 100) / 100
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

// Generate scheduled shifts (last 12 weeks + next 2 weeks)
const generateScheduledShifts = () => {
  const shifts = [];
  let shiftIdCounter = 1;
  
  // Past 12 weeks + next 2 weeks = 98 days
  for (let daysOffset = -84; daysOffset <= 14; daysOffset++) {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    
    // Lunch shift (3-4 servers on weekdays, 5-6 on weekends)
    const lunchServers = isWeekend(date) ? random(5, 6) : random(3, 4);
    for (let i = 0; i < lunchServers; i++) {
      const serverId = serverIds[i % serverIds.length];
      const server = mockStaff.find(s => s.id === serverId);
      shifts.push({
        id: `shift-${shiftIdCounter++}`,
        staffId: serverId,
        staffName: server?.displayName || 'Unknown',
        date: dateStr,
        shiftType: 'lunch',
        startTime: '11:00',
        endTime: '16:00',
        role: 'server',
        status: daysOffset < 0 ? 'completed' : 'scheduled',
        createdAt: new Date().toISOString()
      });
    }
    
    // Dinner shift (4-5 servers on weekdays, 6-7 on weekends)
    const dinnerServers = isWeekend(date) ? random(6, 7) : random(4, 5);
    for (let i = 0; i < dinnerServers; i++) {
      const serverId = serverIds[(i + 2) % serverIds.length]; // Offset to mix servers
      const server = mockStaff.find(s => s.id === serverId);
      shifts.push({
        id: `shift-${shiftIdCounter++}`,
        staffId: serverId,
        staffName: server?.displayName || 'Unknown',
        date: dateStr,
        shiftType: 'dinner',
        startTime: '16:00',
        endTime: '23:00',
        role: 'server',
        status: daysOffset < 0 ? 'completed' : 'scheduled',
        createdAt: new Date().toISOString()
      });
    }
  }
  
  return shifts;
};

// Generate time punches
const generateTimePunches = (shifts) => {
  const punches = [];
  let punchIdCounter = 1;
  
  for (const shift of shifts.filter(s => s.status === 'completed')) {
    const [startHour, startMin] = shift.startTime.split(':').map(Number);
    const [endHour, endMin] = shift.endTime.split(':').map(Number);
    
    const shiftDate = new Date(shift.date);
    
    // Clock in (±5 minutes from start)
    const clockIn = new Date(shiftDate);
    clockIn.setHours(startHour, startMin + random(-5, 5), 0, 0);
    
    // Clock out (±10 minutes from end)
    const clockOut = new Date(shiftDate);
    clockOut.setHours(endHour, endMin + random(-5, 10), 0, 0);
    
    const hoursWorked = (clockOut - clockIn) / 3600000;
    const breakMinutes = hoursWorked > 6 ? 30 : 0;
    
    punches.push({
      id: `punch-${punchIdCounter++}`,
      staffId: shift.staffId,
      scheduledShiftId: shift.id,
      clockInTime: clockIn.toISOString(),
      clockOutTime: clockOut.toISOString(),
      breakMinutes,
      hoursWorked: Math.round((hoursWorked - breakMinutes / 60) * 100) / 100,
      notes: '',
      approvedBy: 'staff-1',
      approvedAt: new Date().toISOString()
    });
  }
  
  return punches;
};

// Generate inventory usage history
const generateInventoryUsage = (orders) => {
  const recipes = {
    'menu-1': [{ itemId: 'inv-1', qty: 1 }], // Ribeye
    'menu-2': [{ itemId: 'inv-2', qty: 1 }, { itemId: 'inv-7', qty: 0.5 }], // Salmon
    'menu-3': [{ itemId: 'inv-3', qty: 1 }, { itemId: 'inv-10', qty: 0.15 }], // Chicken
    'menu-4': [{ itemId: 'inv-12', qty: 0.25 }, { itemId: 'inv-11', qty: 0.2 }], // Pasta
    'menu-5': [{ itemId: 'inv-6', qty: 0.5 }, { itemId: 'inv-10', qty: 0.1 }], // Caesar
    'menu-11': [{ itemId: 'inv-4', qty: 0.17 }], // Red Wine
    'menu-12': [{ itemId: 'inv-5', qty: 0.17 }], // White Wine
  };
  
  const usageByDay = {};
  
  for (const order of orders) {
    const date = order.createdAt.split('T')[0];
    if (!usageByDay[date]) {
      usageByDay[date] = {};
    }
    
    for (const item of order.items) {
      const recipe = recipes[item.menuItemId];
      if (!recipe) continue;
      
      for (const ingredient of recipe) {
        if (!usageByDay[date][ingredient.itemId]) {
          usageByDay[date][ingredient.itemId] = 0;
        }
        usageByDay[date][ingredient.itemId] += ingredient.qty;
      }
    }
  }
  
  const usageHistory = [];
  for (const [date, items] of Object.entries(usageByDay)) {
    for (const [itemId, quantity] of Object.entries(items)) {
      const invItem = mockInventory.find(i => i.id === itemId);
      usageHistory.push({
        itemId,
        itemName: invItem?.name || 'Unknown',
        date,
        quantityUsed: Math.round(quantity * 100) / 100,
        unit: invItem?.unit || 'units'
      });
    }
  }
  
  return usageHistory.sort((a, b) => a.date.localeCompare(b.date));
};

// Generate all data
export const historicalOrders = generateHistoricalOrders();
export const serverPerformance = generateServerPerformanceData(historicalOrders);
export const dailySalesSummary = generateDailySalesSummary(historicalOrders);
export const scheduledShifts = generateScheduledShifts();
export const timePunches = generateTimePunches(scheduledShifts);
export const inventoryUsage = generateInventoryUsage(historicalOrders);

// Summary statistics
export const dataSummary = {
  totalOrders: historicalOrders.length,
  totalRevenue: Math.round(historicalOrders.reduce((sum, o) => 
    sum + o.items.reduce((s, i) => s + i.price, 0), 0
  ) * 100) / 100,
  totalTips: Math.round(historicalOrders.reduce((sum, o) => sum + (o.tip || 0), 0) * 100) / 100,
  dateRange: {
    start: dailySalesSummary[0]?.date,
    end: dailySalesSummary[dailySalesSummary.length - 1]?.date
  },
  averageDailyRevenue: Math.round(
    dailySalesSummary.reduce((sum, d) => sum + d.totalRevenue, 0) / dailySalesSummary.length * 100
  ) / 100,
  averageDailyTables: Math.round(
    dailySalesSummary.reduce((sum, d) => sum + d.totalTables, 0) / dailySalesSummary.length
  ),
  totalShifts: scheduledShifts.length,
  totalTimePunches: timePunches.length
};

console.log('Historical data generated:', dataSummary);
