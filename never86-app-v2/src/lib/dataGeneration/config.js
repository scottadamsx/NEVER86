// Restaurant configuration for data generation

export const restaurantConfig = {
  name: "Never86 Restaurant",
  openHour: 11,
  closeHour: 23,
  tableCount: 20,
  baseTablesPerHour: 4,
  averageCheck: 65,
  averageTipPercent: 20,
  laborCostPerHour: 18,
  
  // Time multipliers
  multipliers: {
    lunchRush: { start: 11, end: 14, factor: 1.5 },
    dinnerRush: { start: 17, end: 21, factor: 2.0 },
    slowPeriod: { factor: 0.3 },
    weekend: 1.3,
    holiday: 1.8
  },
  
  // Staffing ratios
  staffingRatios: {
    tablesPerServer: 4.5,
    tablesPerHost: 17,
    coversPerCook: 35
  },
  
  // Item popularity weights (higher = more popular)
  menuPopularity: {
    'menu-1': 0.15, // Ribeye - popular
    'menu-2': 0.12, // Salmon
    'menu-3': 0.11, // Chicken Parm
    'menu-4': 0.10, // Pasta
    'menu-5': 0.13, // Caesar Salad - very popular appetizer
    'menu-6': 0.06, // Soup
    'menu-7': 0.08, // Calamari
    'menu-8': 0.05, // Bruschetta
    'menu-9': 0.02, // Chocolate Cake (often unavailable)
    'menu-10': 0.04, // Tiramisu
    'menu-11': 0.05, // Red Wine
    'menu-12': 0.04, // White Wine
    'menu-13': 0.03, // Beer
    'menu-14': 0.02, // Soft Drinks
  }
};

// US Holidays 2025-2026 for the simulation
export const holidays = [
  '2025-01-01', // New Year
  '2025-02-14', // Valentine's Day
  '2025-05-25', // Memorial Day (approx)
  '2025-07-04', // July 4th
  '2025-09-01', // Labor Day (approx)
  '2025-11-27', // Thanksgiving (approx)
  '2025-12-24', // Christmas Eve
  '2025-12-25', // Christmas
  '2025-12-31', // New Year's Eve
  '2026-01-01', // New Year
  '2026-02-14', // Valentine's Day
];

export const isHoliday = (date) => {
  const dateStr = date.toISOString().split('T')[0];
  return holidays.includes(dateStr);
};

export const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};
