/**
 * Calculate server leaderboard based on orders and staff data
 * @param {Array} orders - Array of order objects
 * @param {Array} staff - Array of staff member objects
 * @returns {Array} Array of server objects with stats, sorted by revenue
 */
export function calculateServerLeaderboard(orders, staff) {
  // Group orders by server
  const serverStats = {};
  
  orders.forEach(order => {
    if (!order.serverId) return;
    
    if (!serverStats[order.serverId]) {
      const server = staff.find(s => s.id === order.serverId);
      serverStats[order.serverId] = {
        id: order.serverId,
        name: server?.displayName || server?.name || 'Unknown',
        revenue: 0,
        tables: 0,
        tips: 0
      };
    }
    
    const stats = serverStats[order.serverId];
    // Calculate order total from items if order.total doesn't exist
    const orderTotal = order.total || (order.items ? order.items.reduce((sum, item) => sum + item.price, 0) : 0);
    stats.revenue += orderTotal;
    stats.tips += order.tip || 0;
    stats.tables += 1;
  });
  
  // Convert to array and sort by revenue
  return Object.values(serverStats)
    .sort((a, b) => b.revenue - a.revenue)
    .map((server, index) => ({
      ...server,
      rank: index + 1
    }));
}

/**
 * Calculate peak hours distribution from orders
 * @param {Array} orders - Array of order objects with createdAt timestamps
 * @returns {Array} Array of hour objects with hour (0-23) and count
 */
export function calculatePeakHours(orders) {
  // Initialize hours array
  const hours = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: 0
  }));
  
  // Count orders per hour
  orders.forEach(order => {
    if (!order.createdAt) return;
    
    const date = new Date(order.createdAt);
    const hour = date.getHours();
    hours[hour].count += 1;
  });
  
  return hours;
}

/**
 * Calculate comprehensive revenue metrics with period comparison
 * @param {Array} orders - Array of order objects
 * @param {Array} sales - Array of daily sales summary
 * @param {Date} startDate - Start date for current period
 * @param {Date} endDate - End date for current period
 * @param {Date} prevStartDate - Optional: Start date for previous period (for comparison)
 * @param {Date} prevEndDate - Optional: End date for previous period (for comparison)
 * @returns {Object} Comprehensive revenue metrics with comparisons
 */
export function calculateRevenueMetrics(orders, sales, startDate, endDate, prevStartDate = null, prevEndDate = null) {
  // Filter current period data
  const currentOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt);
    return orderDate >= startDate && orderDate <= endDate && o.status === 'completed';
  });

  const currentSales = sales.filter(s => {
    const saleDate = new Date(s.date);
    return saleDate >= startDate && saleDate <= endDate;
  });

  // Calculate current period metrics
  const totalRevenue = currentSales.reduce((sum, s) => sum + s.totalRevenue, 0);
  const totalTips = currentSales.reduce((sum, s) => sum + s.totalTips, 0);
  const totalTables = currentSales.reduce((sum, s) => sum + s.totalTables, 0);
  const totalOrders = currentOrders.length;
  const avgCheck = totalTables > 0 ? totalRevenue / totalTables : 0;
  const avgTipPercent = totalRevenue > 0 ? (totalTips / totalRevenue) * 100 : 0;
  
  // Calculate average guests per table
  const totalGuests = currentOrders.reduce((sum, o) => sum + (o.guestCount || 1), 0);
  const avgGuestsPerTable = currentOrders.length > 0 ? totalGuests / currentOrders.length : 0;

  // Calculate average table turnover time
  let totalTurnover = 0;
  let turnoverCount = 0;
  currentOrders.forEach(order => {
    if (order.createdAt && order.closedAt) {
      const created = new Date(order.createdAt);
      const closed = new Date(order.closedAt);
      totalTurnover += (closed - created) / 60000; // minutes
      turnoverCount++;
    }
  });
  const avgTurnover = turnoverCount > 0 ? totalTurnover / turnoverCount : 0;

  // Calculate revenue by day of week
  const revenueByDay = {};
  currentSales.forEach(sale => {
    const date = new Date(sale.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    if (!revenueByDay[dayName]) {
      revenueByDay[dayName] = { revenue: 0, tables: 0, count: 0 };
    }
    revenueByDay[dayName].revenue += sale.totalRevenue;
    revenueByDay[dayName].tables += sale.totalTables;
    revenueByDay[dayName].count += 1;
  });

  // Calculate averages for each day
  Object.keys(revenueByDay).forEach(day => {
    const data = revenueByDay[day];
    data.avgRevenue = data.count > 0 ? data.revenue / data.count : 0;
    data.avgTables = data.count > 0 ? data.tables / data.count : 0;
  });

  // Previous period comparison (if provided)
  let previousMetrics = null;
  if (prevStartDate && prevEndDate) {
    const prevSales = sales.filter(s => {
      const saleDate = new Date(s.date);
      return saleDate >= prevStartDate && saleDate <= prevEndDate;
    });
    
    const prevRevenue = prevSales.reduce((sum, s) => sum + s.totalRevenue, 0);
    const prevTables = prevSales.reduce((sum, s) => sum + s.totalTables, 0);
    const prevAvgCheck = prevTables > 0 ? prevRevenue / prevTables : 0;
    
    previousMetrics = {
      totalRevenue: prevRevenue,
      totalTables: prevTables,
      avgCheck: prevAvgCheck,
      revenueChange: totalRevenue - prevRevenue,
      revenueChangePercent: prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0,
      tablesChange: totalTables - prevTables,
      tablesChangePercent: prevTables > 0 ? ((totalTables - prevTables) / prevTables) * 100 : 0,
      avgCheckChange: avgCheck - prevAvgCheck,
      avgCheckChangePercent: prevAvgCheck > 0 ? ((avgCheck - prevAvgCheck) / prevAvgCheck) * 100 : 0
    };
  }

  const daysInPeriod = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

  return {
    // Current period metrics
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalTips: Math.round(totalTips * 100) / 100,
    totalTables,
    totalOrders,
    avgCheck: Math.round(avgCheck * 100) / 100,
    avgTipPercent: Math.round(avgTipPercent * 10) / 10,
    avgGuestsPerTable: Math.round(avgGuestsPerTable * 10) / 10,
    avgTurnover: Math.round(avgTurnover),
    revenueByDay,
    
    // Daily averages
    avgDailyRevenue: currentSales.length > 0 ? Math.round((totalRevenue / currentSales.length) * 100) / 100 : 0,
    avgDailyTables: currentSales.length > 0 ? Math.round((totalTables / currentSales.length) * 10) / 10 : 0,
    
    // Previous period comparison
    previousPeriod: previousMetrics,
    
    // Date range info
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    daysInPeriod
  };
}

/**
 * Calculate menu item performance metrics
 * @param {Array} orders - Array of order objects
 * @param {Array} menuItems - Array of menu item objects
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array} Menu item performance data sorted by quantity sold
 */
export function calculateMenuPerformance(orders, menuItems, startDate, endDate) {
  const filteredOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt);
    return orderDate >= startDate && orderDate <= endDate && o.status === 'completed';
  });

  const itemStats = {};
  
  filteredOrders.forEach(order => {
    if (!order.items) return;
    
    order.items.forEach(item => {
      const menuItem = menuItems.find(m => m.id === item.menuItemId);
      if (!menuItem) return;
      
      if (!itemStats[item.menuItemId]) {
        itemStats[item.menuItemId] = {
          menuItemId: item.menuItemId,
          name: menuItem.name,
          category: menuItem.category,
          price: menuItem.price,
          quantitySold: 0,
          totalRevenue: 0,
          orders: 0
        };
      }
      
      const stats = itemStats[item.menuItemId];
      stats.quantitySold += 1;
      stats.totalRevenue += item.price;
      stats.orders += 1;
    });
  });
  
  // Calculate averages and sort by quantity sold
  return Object.values(itemStats).map(item => ({
    ...item,
    avgPrice: item.quantitySold > 0 ? Math.round((item.totalRevenue / item.quantitySold) * 100) / 100 : 0
  })).sort((a, b) => b.quantitySold - a.quantitySold);
}

/**
 * Calculate hourly revenue distribution
 * @param {Array} orders - Array of order objects
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array} Hourly revenue data (0-23 hours)
 */
export function calculateHourlyRevenue(orders, startDate, endDate) {
  const filteredOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt);
    return orderDate >= startDate && orderDate <= endDate && o.status === 'completed';
  });

  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    revenue: 0,
    orders: 0,
    tables: 0,
    tips: 0
  }));
  
  filteredOrders.forEach(order => {
    const orderDate = new Date(order.createdAt);
    const hour = orderDate.getHours();
    const orderTotal = order.total || (order.items ? order.items.reduce((sum, item) => sum + item.price, 0) : 0);
    
    hourlyData[hour].revenue += orderTotal;
    hourlyData[hour].orders += 1;
    hourlyData[hour].tables += 1;
    hourlyData[hour].tips += order.tip || 0;
  });
  
  return hourlyData.map(hour => ({
    ...hour,
    avgOrderValue: hour.orders > 0 ? Math.round((hour.revenue / hour.orders) * 100) / 100 : 0,
    label: hour.hour === 0 ? '12am' 
      : hour.hour === 12 ? '12pm' 
      : hour.hour > 12 ? `${hour.hour - 12}pm` 
      : `${hour.hour}am`
  }));
}
