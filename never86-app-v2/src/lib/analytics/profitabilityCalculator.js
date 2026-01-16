// Profitability Calculator
// Calculates profit margins for menu items and overall restaurant

import { recipes } from '../dataGeneration/inventoryUsageGenerator.js';

// Ingredient costs (per unit)
export const ingredientCosts = {
  'inv-1': 12.00,  // Ribeye per portion
  'inv-2': 8.00,   // Salmon per portion
  'inv-3': 4.00,   // Chicken per portion
  'inv-4': 15.00,  // Red wine per bottle
  'inv-5': 12.00,  // White wine per bottle
  'inv-6': 2.50,   // Romaine per head
  'inv-7': 0.30,   // Lemons each
  'inv-8': 8.00,   // Olive oil per liter
  'inv-9': 0.50,   // Bread rolls each
  'inv-10': 12.00, // Parmesan per lb
  'inv-11': 4.00,  // Heavy cream per quart
  'inv-12': 2.00,  // Pasta per lb
  'inv-13': 3.00,  // Marinara per quart
  'inv-14': 3.00,  // Chocolate cake per slice
  'inv-15': 2.50,  // Tiramisu per portion
};

// Calculate COGS for a menu item
export const calculateMenuItemCOGS = (menuItemId) => {
  const recipe = recipes[menuItemId];
  if (!recipe) return 0;
  
  let totalCost = 0;
  for (const ingredient of recipe.ingredients) {
    const costPerUnit = ingredientCosts[ingredient.inventoryItemId] || 0;
    totalCost += costPerUnit * ingredient.quantity;
  }
  
  return Math.round(totalCost * 100) / 100;
};

// Calculate menu item profitability
export const calculateMenuItemProfitability = (menuItem, salesData) => {
  const cogs = calculateMenuItemCOGS(menuItem.id);
  const sellingPrice = menuItem.price;
  
  // Count sales from historical data
  let quantitySold = 0;
  if (salesData) {
    for (const sale of salesData) {
      if (sale.items) {
        quantitySold += sale.items.filter(i => i.menuItemId === menuItem.id).length;
      }
    }
  }
  
  const grossProfit = sellingPrice - cogs;
  const grossMargin = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;
  const totalRevenue = sellingPrice * quantitySold;
  const totalCost = cogs * quantitySold;
  const contributionMargin = totalRevenue - totalCost;
  
  // Generate recommendation
  let recommendation, reasoning;
  
  if (grossMargin < 60) {
    recommendation = 'increase_price';
    reasoning = `Margin of ${grossMargin.toFixed(1)}% is below 60% target. Consider price increase or cost reduction.`;
  } else if (grossMargin > 75 && quantitySold > 10) {
    recommendation = 'promote';
    reasoning = `High margin (${grossMargin.toFixed(1)}%) and good sales. Great candidate for promotion.`;
  } else if (quantitySold < 5) {
    recommendation = 'review';
    reasoning = `Low sales volume (${quantitySold}). Consider removing or repositioning.`;
  } else {
    recommendation = 'maintain';
    reasoning = `Healthy margin (${grossMargin.toFixed(1)}%) with steady sales.`;
  }
  
  return {
    menuItemId: menuItem.id,
    itemName: menuItem.name,
    category: menuItem.category,
    sellingPrice,
    ingredientCost: cogs,
    grossProfit: Math.round(grossProfit * 100) / 100,
    grossMargin: Math.round(grossMargin * 10) / 10,
    quantitySold,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    contributionMargin: Math.round(contributionMargin * 100) / 100,
    recommendation,
    reasoning
  };
};

// Calculate all menu item profitability
export const calculateAllMenuProfitability = (menuItems, salesData) => {
  return menuItems.map(item => calculateMenuItemProfitability(item, salesData));
};

// Calculate overall food cost percentage
export const calculateFoodCostPercentage = (menuProfitability) => {
  const totalRevenue = menuProfitability.reduce((sum, m) => sum + m.totalRevenue, 0);
  const totalCOGS = menuProfitability.reduce((sum, m) => 
    sum + (m.ingredientCost * m.quantitySold), 0
  );
  
  return totalRevenue > 0 
    ? Math.round((totalCOGS / totalRevenue) * 1000) / 10 
    : 0;
};

// Calculate prime cost (COGS + Labor)
export const calculatePrimeCost = (cogs, laborCost, revenue) => {
  const primeCost = cogs + laborCost;
  const primeCostPercent = revenue > 0 ? (primeCost / revenue) * 100 : 0;
  
  return {
    primeCost: Math.round(primeCost * 100) / 100,
    primeCostPercent: Math.round(primeCostPercent * 10) / 10,
    isHealthy: primeCostPercent <= 65, // Industry standard target
    target: 65
  };
};

// Generate profitability summary
export const generateProfitabilitySummary = (menuItems, salesData, laborCosts) => {
  const menuProfit = calculateAllMenuProfitability(menuItems, salesData);
  const totalRevenue = menuProfit.reduce((sum, m) => sum + m.totalRevenue, 0);
  const totalCOGS = menuProfit.reduce((sum, m) => 
    sum + (m.ingredientCost * m.quantitySold), 0
  );
  const totalLaborCost = laborCosts?.reduce((sum, l) => sum + l.laborCost, 0) || 0;
  
  const foodCostPercent = calculateFoodCostPercentage(menuProfit);
  const laborCostPercent = totalRevenue > 0 
    ? Math.round((totalLaborCost / totalRevenue) * 1000) / 10 
    : 0;
  const primeCost = calculatePrimeCost(totalCOGS, totalLaborCost, totalRevenue);
  
  // Group by recommendation
  const byRecommendation = {
    increase_price: menuProfit.filter(m => m.recommendation === 'increase_price'),
    promote: menuProfit.filter(m => m.recommendation === 'promote'),
    review: menuProfit.filter(m => m.recommendation === 'review'),
    maintain: menuProfit.filter(m => m.recommendation === 'maintain')
  };
  
  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalCOGS: Math.round(totalCOGS * 100) / 100,
    totalLaborCost: Math.round(totalLaborCost * 100) / 100,
    grossProfit: Math.round((totalRevenue - totalCOGS) * 100) / 100,
    netProfit: Math.round((totalRevenue - totalCOGS - totalLaborCost) * 100) / 100,
    foodCostPercent,
    laborCostPercent,
    primeCost,
    menuItems: menuProfit,
    recommendations: byRecommendation,
    insights: generateInsights(menuProfit, primeCost)
  };
};

// Generate actionable insights
const generateInsights = (menuProfit, primeCost) => {
  const insights = [];
  
  // Check for low margin items
  const lowMarginItems = menuProfit.filter(m => m.grossMargin < 60 && m.quantitySold > 5);
  if (lowMarginItems.length > 0) {
    insights.push({
      type: 'warning',
      title: 'Low Margin Alert',
      message: `${lowMarginItems.length} popular items have margins below 60%`,
      items: lowMarginItems.map(m => m.itemName)
    });
  }
  
  // Check prime cost
  if (!primeCost.isHealthy) {
    insights.push({
      type: 'critical',
      title: 'Prime Cost Too High',
      message: `Prime cost at ${primeCost.primeCostPercent}% exceeds ${primeCost.target}% target`,
      suggestion: 'Review labor scheduling and ingredient costs'
    });
  }
  
  // Identify stars (high margin + high sales)
  const stars = menuProfit.filter(m => m.grossMargin > 70 && m.quantitySold > 15);
  if (stars.length > 0) {
    insights.push({
      type: 'success',
      title: 'Star Performers',
      message: `${stars.length} items are highly profitable and popular`,
      items: stars.map(m => m.itemName)
    });
  }
  
  return insights;
};
