/**
 * MENU IMPORT TEMPLATE
 * 
 * Use this template when parsing a restaurant menu PDF.
 * Replace the example items with actual items from the menu.
 * 
 * Instructions:
 * 1. Extract all menu items from the PDF
 * 2. Organize by category
 * 3. Identify modifiers (customization options)
 * 4. Fill in this template with the extracted data
 * 5. Save as menuItems.js in the src/data/ directory
 */

export const menuItems = [
  // ============================================
  // APPETIZERS
  // ============================================
  {
    id: 'menu-1',
    name: 'Item Name',
    description: 'Item description from menu',
    price: 14.00,  // Numeric, not string
    category: 'appetizers',
    prepTime: 5,  // Minutes (default: 10 if unknown)
    onMenu: true,
    available: true,
    modifiers: []  // Empty array if no modifiers
  },

  // Example with modifiers:
  {
    id: 'menu-2',
    name: 'Caesar Salad',
    description: 'Romaine, parmesan, croutons',
    price: 14.00,
    category: 'appetizers',
    prepTime: 5,
    onMenu: true,
    available: true,
    modifiers: [
      {
        name: 'Add Protein',
        required: false,  // false = optional, true = required
        options: [
          { name: 'No Protein', price: 0 },
          { name: 'Grilled Chicken', price: 6 },
          { name: 'Grilled Shrimp', price: 8 },
          { name: 'Salmon', price: 10 }
        ]
      }
    ]
  },

  // ============================================
  // MAINS
  // ============================================
  {
    id: 'menu-3',
    name: 'Ribeye Steak',
    description: '12oz aged ribeye with herb butter',
    price: 42.00,
    category: 'mains',
    prepTime: 18,
    onMenu: true,
    available: true,
    modifiers: [
      {
        name: 'Temperature',
        required: true,  // Customer must select
        options: [
          { name: 'Rare', price: 0 },
          { name: 'Medium Rare', price: 0 },
          { name: 'Medium', price: 0 },
          { name: 'Medium Well', price: 0 },
          { name: 'Well Done', price: 0 }
        ]
      },
      {
        name: 'Side',
        required: false,  // Optional
        options: [
          { name: 'No Side', price: 0 },
          { name: 'Mashed Potatoes', price: 0 },
          { name: 'Fries', price: 0 },
          { name: 'Vegetables', price: 0 }
        ]
      }
    ]
  },

  // ============================================
  // DESSERTS
  // ============================================
  {
    id: 'menu-4',
    name: 'Chocolate Cake',
    description: 'Rich chocolate layer cake',
    price: 12.00,
    category: 'desserts',
    prepTime: 5,
    onMenu: true,
    available: true,
    modifiers: []
  },

  // ============================================
  // DRINKS
  // ============================================
  {
    id: 'menu-5',
    name: 'House Wine',
    description: 'Glass of house selection',
    price: 12.00,
    category: 'drinks',
    prepTime: 1,
    onMenu: true,
    available: true,
    modifiers: [
      {
        name: 'Selection',
        required: true,
        options: [
          { name: 'House Red', price: 0 },
          { name: 'House White', price: 0 },
          { name: 'House Rosé', price: 0 }
        ]
      }
    ]
  },

  // ============================================
  // SIDES
  // ============================================
  {
    id: 'menu-6',
    name: 'French Fries',
    description: 'Crispy hand-cut fries',
    price: 6.00,
    category: 'sides',
    prepTime: 7,
    onMenu: true,
    available: true,
    modifiers: [
      {
        name: 'Sauce',
        required: false,
        options: [
          { name: 'No Sauce', price: 0 },
          { name: 'Ketchup', price: 0 },
          { name: 'Ranch', price: 0.50 },
          { name: 'Aioli', price: 0.50 }
        ]
      }
    ]
  }
];

/**
 * CATEGORY REFERENCE:
 * - 'appetizers' - Starters, small plates
 * - 'mains' - Entrees, main courses
 * - 'desserts' - Desserts, sweets
 * - 'drinks' - Beverages, cocktails, wine, beer
 * - 'sides' - Side dishes
 * - 'salads' - Salads (if separate from appetizers)
 * - 'soups' - Soups (if separate from appetizers)
 * - 'sandwiches' - Sandwiches, burgers, wraps
 * - 'pizza' - Pizza items
 * - 'breakfast' - Breakfast items
 * - 'lunch' - Lunch-specific items
 * 
 * MODIFIER TIPS:
 * - If modifier is required, set required: true
 * - If modifier is optional, set required: false AND include a "No [X]" option with price 0
 * - Price can be 0 for standard options, or additional cost for upgrades
 * - Common modifier names: 'Temperature', 'Size', 'Side', 'Sauce', 'Add Protein', 'Preparation'
 */
