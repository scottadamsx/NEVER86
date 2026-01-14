export const mockStaff = [
  { id: 'staff-1', username: 'manager', role: 'manager', displayName: 'Manager', section: null, station: null, status: 'active', createdAt: '2024-01-15' },
  { id: 'staff-2', username: 'server1', role: 'server', displayName: 'Server 1', section: 'A', station: null, status: 'active', createdAt: '2024-03-15' },
  { id: 'staff-3', username: 'server24', role: 'server', displayName: 'Server 24', section: 'A', station: null, status: 'active', createdAt: '2024-02-20' },
  { id: 'staff-4', username: 'chef', role: 'kitchen', displayName: 'Chef', section: null, station: 'grill', status: 'active', createdAt: '2024-01-10' },
];

export const mockTables = [
  { id: 't1', number: 1, seats: 4, section: 'A', status: 'available', serverId: null, guestCount: 0, seatedAt: null, currentOrderId: null },
  { id: 't2', number: 2, seats: 4, section: 'A', status: 'occupied', serverId: 'staff-2', guestCount: 4, seatedAt: '2026-01-08T19:23:00', currentOrderId: 'order-1' },
  { id: 't3', number: 3, seats: 2, section: 'A', status: 'occupied', serverId: 'staff-2', guestCount: 2, seatedAt: '2026-01-08T19:45:00', currentOrderId: 'order-2' },
  { id: 't4', number: 4, seats: 4, section: 'B', status: 'available', serverId: null, guestCount: 0, seatedAt: null, currentOrderId: null },
  { id: 't5', number: 5, seats: 4, section: 'B', status: 'occupied', serverId: 'staff-3', guestCount: 3, seatedAt: '2026-01-08T18:30:00', currentOrderId: 'order-3' },
  { id: 't6', number: 6, seats: 6, section: 'B', status: 'available', serverId: null, guestCount: 0, seatedAt: null, currentOrderId: null },
  { id: 't7', number: 7, seats: 2, section: 'C', status: 'occupied', serverId: 'staff-4', guestCount: 2, seatedAt: '2026-01-08T20:00:00', currentOrderId: 'order-4' },
  { id: 't8', number: 8, seats: 4, section: 'C', status: 'available', serverId: null, guestCount: 0, seatedAt: null, currentOrderId: null },
  { id: 't9', number: 9, seats: 8, section: 'C', status: 'reserved', serverId: null, guestCount: 0, seatedAt: null, currentOrderId: null },
  { id: 't10', number: 10, seats: 4, section: 'A', status: 'available', serverId: null, guestCount: 0, seatedAt: null, currentOrderId: null },
  { id: 't11', number: 11, seats: 4, section: 'A', status: 'available', serverId: null, guestCount: 0, seatedAt: null, currentOrderId: null },
  { id: 't12', number: 12, seats: 6, section: 'A', status: 'available', serverId: null, guestCount: 0, seatedAt: null, currentOrderId: null },
  { id: 't13', number: 13, seats: 2, section: 'B', status: 'available', serverId: null, guestCount: 0, seatedAt: null, currentOrderId: null },
  { id: 't14', number: 14, seats: 4, section: 'B', status: 'available', serverId: null, guestCount: 0, seatedAt: null, currentOrderId: null },
  { id: 't15', number: 15, seats: 6, section: 'B', status: 'available', serverId: null, guestCount: 0, seatedAt: null, currentOrderId: null },
  { id: 't16', number: 16, seats: 4, section: 'C', status: 'available', serverId: null, guestCount: 0, seatedAt: null, currentOrderId: null },
  { id: 't17', number: 17, seats: 2, section: 'C', status: 'available', serverId: null, guestCount: 0, seatedAt: null, currentOrderId: null },
  { id: 't18', number: 18, seats: 8, section: 'C', status: 'available', serverId: null, guestCount: 0, seatedAt: null, currentOrderId: null },
  { id: 't19', number: 19, seats: 4, section: 'A', status: 'available', serverId: null, guestCount: 0, seatedAt: null, currentOrderId: null },
  { id: 't20', number: 20, seats: 6, section: 'B', status: 'available', serverId: null, guestCount: 0, seatedAt: null, currentOrderId: null },
];

export const mockMenuItems = [
  { id: 'menu-1', name: 'Ribeye Steak', description: '12oz aged ribeye with herb butter', price: 42.00, category: 'mains', prepTime: 18, onMenu: true, available: true },
  { id: 'menu-2', name: 'Grilled Salmon', description: 'Atlantic salmon with lemon dill sauce', price: 36.00, category: 'mains', prepTime: 15, onMenu: true, available: true },
  { id: 'menu-3', name: 'Chicken Parmesan', description: 'Breaded chicken breast with marinara', price: 28.00, category: 'mains', prepTime: 16, onMenu: true, available: true },
  { id: 'menu-4', name: 'Pasta Primavera', description: 'Seasonal vegetables in garlic cream sauce', price: 24.00, category: 'mains', prepTime: 12, onMenu: true, available: true },
  { id: 'menu-5', name: 'Caesar Salad', description: 'Romaine, parmesan, croutons, caesar dressing', price: 14.00, category: 'appetizers', prepTime: 5, onMenu: true, available: true },
  { id: 'menu-6', name: 'Soup of the Day', description: 'Ask your server for today\'s selection', price: 9.00, category: 'appetizers', prepTime: 3, onMenu: true, available: true },
  { id: 'menu-7', name: 'Calamari', description: 'Crispy fried calamari with marinara', price: 16.00, category: 'appetizers', prepTime: 8, onMenu: true, available: true },
  { id: 'menu-8', name: 'Bruschetta', description: 'Toasted bread with tomato basil topping', price: 12.00, category: 'appetizers', prepTime: 6, onMenu: true, available: true },
  { id: 'menu-9', name: 'Chocolate Cake', description: 'Rich chocolate layer cake', price: 12.00, category: 'desserts', prepTime: 5, onMenu: true, available: false },
  { id: 'menu-10', name: 'Tiramisu', description: 'Classic Italian coffee dessert', price: 11.00, category: 'desserts', prepTime: 5, onMenu: true, available: true },
  { id: 'menu-11', name: 'House Red Wine', description: 'Glass of house cabernet', price: 12.00, category: 'drinks', prepTime: 1, onMenu: true, available: true },
  { id: 'menu-12', name: 'House White Wine', description: 'Glass of house chardonnay', price: 12.00, category: 'drinks', prepTime: 1, onMenu: true, available: true },
  { id: 'menu-13', name: 'Draft Beer', description: 'Ask for today\'s selections', price: 8.00, category: 'drinks', prepTime: 1, onMenu: true, available: true },
  { id: 'menu-14', name: 'Soft Drinks', description: 'Coke, Sprite, Ginger Ale', price: 4.00, category: 'drinks', prepTime: 1, onMenu: true, available: true },
  { id: 'menu-15', name: 'Garlic Mashed Potatoes', description: 'Creamy mashed potatoes with roasted garlic', price: 8.00, category: 'sides', prepTime: 5, onMenu: true, available: true },
  { id: 'menu-16', name: 'Seasonal Vegetables', description: 'Chef\'s selection of grilled vegetables', price: 7.00, category: 'sides', prepTime: 6, onMenu: true, available: true },
  { id: 'menu-17', name: 'French Fries', description: 'Crispy hand-cut fries', price: 6.00, category: 'sides', prepTime: 7, onMenu: true, available: true },
];

export const mockInventory = [
  { id: 'inv-1', name: 'Ribeye', quantity: 24, unit: 'portions', minThreshold: 10, category: 'protein' },
  { id: 'inv-2', name: 'Salmon Fillet', quantity: 8, unit: 'portions', minThreshold: 10, category: 'protein' },
  { id: 'inv-3', name: 'Chicken Breast', quantity: 30, unit: 'portions', minThreshold: 12, category: 'protein' },
  { id: 'inv-4', name: 'House Red Wine', quantity: 3, unit: 'bottles', minThreshold: 6, category: 'beverage' },
  { id: 'inv-5', name: 'House White Wine', quantity: 8, unit: 'bottles', minThreshold: 6, category: 'beverage' },
  { id: 'inv-6', name: 'Romaine Lettuce', quantity: 15, unit: 'heads', minThreshold: 8, category: 'produce' },
  { id: 'inv-7', name: 'Lemons', quantity: 12, unit: 'units', minThreshold: 20, category: 'produce' },
  { id: 'inv-8', name: 'Olive Oil', quantity: 1.5, unit: 'liters', minThreshold: 2, category: 'pantry' },
  { id: 'inv-9', name: 'Bread Rolls', quantity: 6, unit: 'units', minThreshold: 24, category: 'bakery' },
  { id: 'inv-10', name: 'Parmesan Cheese', quantity: 4, unit: 'lbs', minThreshold: 3, category: 'dairy' },
  { id: 'inv-11', name: 'Heavy Cream', quantity: 6, unit: 'quarts', minThreshold: 4, category: 'dairy' },
  { id: 'inv-12', name: 'Pasta', quantity: 20, unit: 'lbs', minThreshold: 10, category: 'pantry' },
  { id: 'inv-13', name: 'Marinara Sauce', quantity: 8, unit: 'quarts', minThreshold: 5, category: 'pantry' },
  { id: 'inv-14', name: 'Chocolate Cake', quantity: 0, unit: 'slices', minThreshold: 8, category: 'dessert' },
  { id: 'inv-15', name: 'Tiramisu', quantity: 12, unit: 'portions', minThreshold: 6, category: 'dessert' },
];

export const mockOrders = [
  {
    id: 'order-1',
    tableId: 't2',
    serverId: 'staff-2',
    guestCount: 4,
    status: 'active',
    items: [
      { id: 'oi-1', menuItemId: 'menu-1', name: 'Ribeye Steak', guestNumber: 1, modifications: 'med-rare', notes: 'no onions', price: 42.00, sentToKitchen: true },
      { id: 'oi-2', menuItemId: 'menu-2', name: 'Grilled Salmon', guestNumber: 2, modifications: '', notes: '', price: 36.00, sentToKitchen: true },
      { id: 'oi-3', menuItemId: 'menu-11', name: 'House Red Wine', guestNumber: 1, modifications: '', notes: '', price: 12.00, sentToKitchen: false },
      { id: 'oi-4', menuItemId: 'menu-11', name: 'House Red Wine', guestNumber: 2, modifications: '', notes: '', price: 12.00, sentToKitchen: false },
      { id: 'oi-5', menuItemId: 'menu-5', name: 'Caesar Salad', guestNumber: 3, modifications: '', notes: 'dressing on side', price: 14.00, sentToKitchen: true },
      { id: 'oi-6', menuItemId: 'menu-4', name: 'Pasta Primavera', guestNumber: 4, modifications: '', notes: 'extra garlic', price: 24.00, sentToKitchen: true },
    ],
    createdAt: '2026-01-08T19:23:00',
    closedAt: null,
    tip: 0
  },
  {
    id: 'order-2',
    tableId: 't3',
    serverId: 'staff-2',
    guestCount: 2,
    status: 'active',
    items: [
      { id: 'oi-7', menuItemId: 'menu-7', name: 'Calamari', guestNumber: 1, modifications: '', notes: '', price: 16.00, sentToKitchen: true },
      { id: 'oi-8', menuItemId: 'menu-3', name: 'Chicken Parmesan', guestNumber: 1, modifications: '', notes: '', price: 28.00, sentToKitchen: false },
      { id: 'oi-9', menuItemId: 'menu-2', name: 'Grilled Salmon', guestNumber: 2, modifications: '', notes: 'well done', price: 36.00, sentToKitchen: false },
    ],
    createdAt: '2026-01-08T19:45:00',
    closedAt: null,
    tip: 0
  },
  {
    id: 'order-3',
    tableId: 't5',
    serverId: 'staff-3',
    guestCount: 3,
    status: 'active',
    items: [
      { id: 'oi-10', menuItemId: 'menu-1', name: 'Ribeye Steak', guestNumber: 1, modifications: 'medium', notes: '', price: 42.00, sentToKitchen: true },
      { id: 'oi-11', menuItemId: 'menu-1', name: 'Ribeye Steak', guestNumber: 2, modifications: 'med-well', notes: '', price: 42.00, sentToKitchen: true },
      { id: 'oi-12', menuItemId: 'menu-4', name: 'Pasta Primavera', guestNumber: 3, modifications: '', notes: '', price: 24.00, sentToKitchen: true },
    ],
    createdAt: '2026-01-08T18:30:00',
    closedAt: null,
    tip: 0
  },
  {
    id: 'order-4',
    tableId: 't7',
    serverId: 'staff-4',
    guestCount: 2,
    status: 'active',
    items: [
      { id: 'oi-13', menuItemId: 'menu-6', name: 'Soup of the Day', guestNumber: 1, modifications: '', notes: '', price: 9.00, sentToKitchen: true },
      { id: 'oi-14', menuItemId: 'menu-6', name: 'Soup of the Day', guestNumber: 2, modifications: '', notes: '', price: 9.00, sentToKitchen: true },
    ],
    createdAt: '2026-01-08T20:00:00',
    closedAt: null,
    tip: 0
  },
];

export const mockChits = [
  {
    id: 'chit-1',
    orderId: 'order-1',
    tableNumber: 2,
    serverName: 'Maria',
    status: 'pending',
    items: [
      { id: 'ci-1', name: 'Ribeye Steak', modifications: 'med-rare', notes: 'no onions', guestNumber: 1, done: true },
      { id: 'ci-2', name: 'Grilled Salmon', modifications: '', notes: '', guestNumber: 2, done: true },
      { id: 'ci-3', name: 'Caesar Salad', modifications: '', notes: 'dressing on side', guestNumber: 3, done: false },
      { id: 'ci-4', name: 'Pasta Primavera', modifications: '', notes: 'extra garlic', guestNumber: 4, done: false },
    ],
    createdAt: '2026-01-08T19:25:00',
    completedAt: null
  },
  {
    id: 'chit-2',
    orderId: 'order-2',
    tableNumber: 3,
    serverName: 'Maria',
    status: 'ready',
    items: [
      { id: 'ci-5', name: 'Calamari', modifications: '', notes: '', guestNumber: 1, done: true },
    ],
    createdAt: '2026-01-08T19:47:00',
    completedAt: '2026-01-08T19:55:00'
  },
  {
    id: 'chit-3',
    orderId: 'order-3',
    tableNumber: 5,
    serverName: 'Jake',
    status: 'pending',
    items: [
      { id: 'ci-6', name: 'Ribeye Steak', modifications: 'medium', notes: '', guestNumber: 1, done: false },
      { id: 'ci-7', name: 'Ribeye Steak', modifications: 'med-well', notes: '', guestNumber: 2, done: false },
      { id: 'ci-8', name: 'Pasta Primavera', modifications: '', notes: '', guestNumber: 3, done: false },
    ],
    createdAt: '2026-01-08T18:35:00',
    completedAt: null
  },
  {
    id: 'chit-4',
    orderId: 'order-4',
    tableNumber: 7,
    serverName: 'Sophie',
    status: 'ready',
    items: [
      { id: 'ci-9', name: 'Soup of the Day', modifications: '', notes: '', guestNumber: 1, done: true },
      { id: 'ci-10', name: 'Soup of the Day', modifications: '', notes: '', guestNumber: 2, done: true },
    ],
    createdAt: '2026-01-08T20:02:00',
    completedAt: '2026-01-08T20:07:00'
  },
];