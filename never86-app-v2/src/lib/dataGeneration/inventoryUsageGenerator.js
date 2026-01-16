// Inventory Usage Generator
// Tracks ingredient usage based on sales and generates predictions

// Recipe definitions - what ingredients each menu item uses
export const recipes = {
  'menu-1': { // Ribeye Steak
    ingredients: [
      { inventoryItemId: 'inv-1', quantity: 1 }, // Ribeye portion
      { inventoryItemId: 'inv-8', quantity: 0.02 }, // Olive oil
    ]
  },
  'menu-2': { // Grilled Salmon
    ingredients: [
      { inventoryItemId: 'inv-2', quantity: 1 }, // Salmon
      { inventoryItemId: 'inv-7', quantity: 0.5 }, // Lemons
      { inventoryItemId: 'inv-8', quantity: 0.02 },
    ]
  },
  'menu-3': { // Chicken Parmesan
    ingredients: [
      { inventoryItemId: 'inv-3', quantity: 1 }, // Chicken
      { inventoryItemId: 'inv-10', quantity: 0.15 }, // Parmesan
      { inventoryItemId: 'inv-13', quantity: 0.25 }, // Marinara
    ]
  },
  'menu-4': { // Pasta Primavera
    ingredients: [
      { inventoryItemId: 'inv-12', quantity: 0.25 }, // Pasta
      { inventoryItemId: 'inv-11', quantity: 0.2 }, // Heavy cream
      { inventoryItemId: 'inv-8', quantity: 0.03 },
    ]
  },
  'menu-5': { // Caesar Salad
    ingredients: [
      { inventoryItemId: 'inv-6', quantity: 0.5 }, // Romaine
      { inventoryItemId: 'inv-10', quantity: 0.1 }, // Parmesan
      { inventoryItemId: 'inv-9', quantity: 1 }, // Bread (croutons)
    ]
  },
  'menu-6': { // Soup
    ingredients: [
      { inventoryItemId: 'inv-11', quantity: 0.15 },
    ]
  },
  'menu-7': { // Calamari
    ingredients: [
      { inventoryItemId: 'inv-8', quantity: 0.1 },
      { inventoryItemId: 'inv-13', quantity: 0.15 },
    ]
  },
  'menu-8': { // Bruschetta
    ingredients: [
      { inventoryItemId: 'inv-9', quantity: 2 },
      { inventoryItemId: 'inv-8', quantity: 0.02 },
    ]
  },
  'menu-9': { // Chocolate Cake
    ingredients: [
      { inventoryItemId: 'inv-14', quantity: 1 },
    ]
  },
  'menu-10': { // Tiramisu
    ingredients: [
      { inventoryItemId: 'inv-15', quantity: 1 },
    ]
  },
  'menu-11': { // Red Wine
    ingredients: [
      { inventoryItemId: 'inv-4', quantity: 0.17 }, // ~1 glass per bottle
    ]
  },
  'menu-12': { // White Wine
    ingredients: [
      { inventoryItemId: 'inv-5', quantity: 0.17 },
    ]
  },
};

// Calculate ingredient usage from sales data
export const calculateIngredientUsage = (salesItems, inventoryItems) => {
  const usage = {};
  
  for (const item of salesItems) {
    const recipe = recipes[item.menuItemId];
    if (!recipe) continue;
    
    for (const ingredient of recipe.ingredients) {
      const qty = ingredient.quantity * (item.quantity || 1);
      usage[ingredient.inventoryItemId] = (usage[ingredient.inventoryItemId] || 0) + qty;
    }
  }
  
  return usage;
};

// Generate daily inventory usage history
export const generateInventoryHistory = (salesHistory, inventoryItems) => {
  const history = [];
  
  // Group sales by day
  const salesByDay = {};
  for (const sale of salesHistory) {
    const dayKey = sale.date.toISOString().split('T')[0];
    if (!salesByDay[dayKey]) {
      salesByDay[dayKey] = [];
    }
    salesByDay[dayKey].push(...sale.items);
  }
  
  for (const [dateStr, items] of Object.entries(salesByDay)) {
    const usage = calculateIngredientUsage(items, inventoryItems);
    
    for (const [itemId, quantity] of Object.entries(usage)) {
      const item = inventoryItems.find(i => i.id === itemId);
      if (!item) continue;
      
      history.push({
        itemId,
        itemName: item.name,
        date: dateStr,
        quantityUsed: Math.round(quantity * 100) / 100,
        unit: item.unit
      });
    }
  }
  
  return history;
};

// Calculate average daily usage
export const calculateAverageDailyUsage = (usageHistory, itemId, days = 30) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().split('T')[0];
  
  const recentUsage = usageHistory.filter(u => 
    u.itemId === itemId && u.date >= cutoffStr
  );
  
  if (recentUsage.length === 0) return 0;
  
  const total = recentUsage.reduce((sum, u) => sum + u.quantityUsed, 0);
  return Math.round((total / days) * 100) / 100;
};

// Predict days until out of stock
export const predictDaysUntilOut = (currentStock, averageDailyUsage) => {
  if (averageDailyUsage <= 0) return Infinity;
  return Math.round((currentStock / averageDailyUsage) * 10) / 10;
};

// Generate inventory prediction
export const generateInventoryPrediction = (item, usageHistory) => {
  const avgDailyUsage = calculateAverageDailyUsage(usageHistory, item.id, 30);
  const daysUntilOut = predictDaysUntilOut(item.quantity, avgDailyUsage);
  
  // Calculate recommended reorder quantity (1.5 weeks supply)
  const weeklyUsage = avgDailyUsage * 7;
  const recommendedReorder = Math.ceil(weeklyUsage * 1.5);
  
  // Determine urgency
  let urgency;
  if (daysUntilOut < 2) {
    urgency = 'critical';
  } else if (daysUntilOut < 5) {
    urgency = 'urgent';
  } else if (daysUntilOut < 10) {
    urgency = 'soon';
  } else {
    urgency = 'ok';
  }
  
  return {
    itemId: item.id,
    itemName: item.name,
    currentStock: item.quantity,
    unit: item.unit,
    averageDailyUsage: avgDailyUsage,
    predictedDaysUntilOut: daysUntilOut === Infinity ? null : daysUntilOut,
    recommendedReorderQuantity: recommendedReorder,
    reorderUrgency: urgency,
    belowMinThreshold: item.quantity < item.minThreshold
  };
};

// Generate predictions for all inventory items
export const generateAllInventoryPredictions = (inventoryItems, usageHistory) => {
  return inventoryItems.map(item => 
    generateInventoryPrediction(item, usageHistory)
  );
};

// Generate reorder notifications
export const generateReorderNotifications = (predictions) => {
  return predictions
    .filter(p => p.reorderUrgency !== 'ok' || p.belowMinThreshold)
    .map(p => ({
      id: `reorder-${p.itemId}-${Date.now()}`,
      itemId: p.itemId,
      itemName: p.itemName,
      currentStock: p.currentStock,
      unit: p.unit,
      recommendedQuantity: p.recommendedReorderQuantity,
      urgency: p.reorderUrgency,
      reason: p.belowMinThreshold 
        ? 'Below minimum threshold' 
        : `Will run out in ${p.predictedDaysUntilOut} days`,
      status: 'pending',
      createdAt: new Date().toISOString()
    }));
};
