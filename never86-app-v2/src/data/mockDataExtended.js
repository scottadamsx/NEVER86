// Extended mock data with a week of history, 8 servers, and comprehensive data

// Helper function to generate dates
const getDate = (daysAgo, hour = 18, minute = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

// Helper to generate random number in range
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to pick random item from array
const randomItem = (arr) => arr[random(0, arr.length - 1)];

// 8 Servers with proper names
// Server usernames: first initial + lastname + random 4 digit number
export const mockStaff = [
  { id: 'staff-1', username: 'manager949', role: 'manager', displayName: 'Sarah Johnson', section: null, station: null, status: 'active', createdAt: '2024-01-15' },
  { id: 'staff-2', username: 'mrodriguez2847', role: 'server', displayName: 'Maria Rodriguez', section: 'A', station: null, status: 'active', createdAt: '2024-03-15' },
  { id: 'staff-3', username: 'jthompson5921', role: 'server', displayName: 'Jake Thompson', section: 'A', station: null, status: 'active', createdAt: '2024-02-20' },
  { id: 'staff-4', username: 'schen7364', role: 'server', displayName: 'Sophie Chen', section: 'B', station: null, status: 'active', createdAt: '2024-01-10' },
  { id: 'staff-5', username: 'mbrown4189', role: 'server', displayName: 'Michael Brown', section: 'B', station: null, status: 'active', createdAt: '2024-02-05' },
  { id: 'staff-6', username: 'edavis8523', role: 'server', displayName: 'Emily Davis', section: 'C', station: null, status: 'active', createdAt: '2024-01-20' },
  { id: 'staff-7', username: 'dwilson1647', role: 'server', displayName: 'David Wilson', section: 'C', station: null, status: 'active', createdAt: '2024-02-15' },
  { id: 'staff-8', username: 'omartinez9032', role: 'server', displayName: 'Olivia Martinez', section: 'A', station: null, status: 'active', createdAt: '2024-03-01' },
  { id: 'staff-9', username: 'chef949', role: 'kitchen', displayName: 'Chef Anderson', section: null, station: 'grill', status: 'active', createdAt: '2024-01-10' },
];

// Tables
export const mockTables = [
  { id: 't1', number: 1, seats: 4, section: 'A', status: 'available', serverId: null, guestCount: 0, seatedAt: null, currentOrderId: null },
  { id: 't2', number: 2, seats: 4, section: 'A', status: 'occupied', serverId: 'staff-2', guestCount: 4, seatedAt: getDate(0, 19, 23), currentOrderId: 'order-1' },
  { id: 't3', number: 3, seats: 2, section: 'A', status: 'occupied', serverId: 'staff-2', guestCount: 2, seatedAt: getDate(0, 19, 45), currentOrderId: 'order-2' },
  { id: 't4', number: 4, seats: 4, section: 'B', status: 'available', serverId: null, guestCount: 0, seatedAt: null, currentOrderId: null },
  { id: 't5', number: 5, seats: 4, section: 'B', status: 'occupied', serverId: 'staff-3', guestCount: 3, seatedAt: getDate(0, 18, 30), currentOrderId: 'order-3' },
  { id: 't6', number: 6, seats: 6, section: 'B', status: 'available', serverId: null, guestCount: 0, seatedAt: null, currentOrderId: null },
  { id: 't7', number: 7, seats: 2, section: 'C', status: 'occupied', serverId: 'staff-4', guestCount: 2, seatedAt: getDate(0, 20, 0), currentOrderId: 'order-4' },
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

// Menu Items with modifiers
// modifiers: array of modifier groups
// Each modifier group: { name, required, options: [{ name, price }] }
export const mockMenuItems = [
  { 
    id: 'menu-1', 
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
        required: true, 
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
        required: false,
        options: [
          { name: 'No Side', price: 0 },
          { name: 'Mashed Potatoes', price: 0 },
          { name: 'Fries', price: 0 },
          { name: 'Vegetables', price: 0 }
        ]
      }
    ]
  },
  { 
    id: 'menu-2', 
    name: 'Grilled Salmon', 
    description: 'Atlantic salmon with lemon dill sauce', 
    price: 36.00, 
    category: 'mains', 
    prepTime: 15, 
    onMenu: true, 
    available: true,
    modifiers: [
      {
        name: 'Preparation',
        required: true,
        options: [
          { name: 'Grilled', price: 0 },
          { name: 'Pan Seared', price: 0 },
          { name: 'Blackened', price: 0 }
        ]
      }
    ]
  },
  { id: 'menu-3', name: 'Chicken Parmesan', description: 'Breaded chicken breast with marinara', price: 28.00, category: 'mains', prepTime: 16, onMenu: true, available: true, modifiers: [] },
  { id: 'menu-4', name: 'Pasta Primavera', description: 'Seasonal vegetables in garlic cream sauce', price: 24.00, category: 'mains', prepTime: 12, onMenu: true, available: true, modifiers: [] },
  { 
    id: 'menu-5', 
    name: 'Caesar Salad', 
    description: 'Romaine, parmesan, croutons, caesar dressing', 
    price: 14.00, 
    category: 'appetizers', 
    prepTime: 5, 
    onMenu: true, 
    available: true,
    modifiers: [
      {
        name: 'Add Protein',
        required: false,
        options: [
          { name: 'No Protein', price: 0 },
          { name: 'Grilled Chicken', price: 6 },
          { name: 'Grilled Shrimp', price: 8 },
          { name: 'Salmon', price: 10 }
        ]
      }
    ]
  },
  { id: 'menu-6', name: 'Soup of the Day', description: 'Ask your server for today\'s selection', price: 9.00, category: 'appetizers', prepTime: 3, onMenu: true, available: true, modifiers: [] },
  { id: 'menu-7', name: 'Calamari', description: 'Crispy fried calamari with marinara', price: 16.00, category: 'appetizers', prepTime: 8, onMenu: true, available: true, modifiers: [] },
  { id: 'menu-8', name: 'Bruschetta', description: 'Toasted bread with tomato basil topping', price: 12.00, category: 'appetizers', prepTime: 6, onMenu: true, available: true, modifiers: [] },
  { id: 'menu-9', name: 'Chocolate Cake', description: 'Rich chocolate layer cake', price: 12.00, category: 'desserts', prepTime: 5, onMenu: true, available: false, modifiers: [] },
  { id: 'menu-10', name: 'Tiramisu', description: 'Classic Italian coffee dessert', price: 11.00, category: 'desserts', prepTime: 5, onMenu: true, available: true, modifiers: [] },
  { id: 'menu-11', name: 'House Red Wine', description: 'Glass of house cabernet', price: 12.00, category: 'drinks', prepTime: 1, onMenu: true, available: true, modifiers: [] },
  { id: 'menu-12', name: 'House White Wine', description: 'Glass of house chardonnay', price: 12.00, category: 'drinks', prepTime: 1, onMenu: true, available: true, modifiers: [] },
  { 
    id: 'menu-13', 
    name: 'Draft Beer', 
    description: 'Ask for today\'s selections', 
    price: 8.00, 
    category: 'drinks', 
    prepTime: 1, 
    onMenu: true, 
    available: true,
    modifiers: [
      {
        name: 'Selection',
        required: true,
        options: [
          { name: 'IPA', price: 0 },
          { name: 'Lager', price: 0 },
          { name: 'Pilsner', price: 0 },
          { name: 'Stout', price: 2 }
        ]
      }
    ]
  },
  { 
    id: 'menu-14', 
    name: 'Soft Drinks', 
    description: 'Coke, Sprite, Ginger Ale', 
    price: 4.00, 
    category: 'drinks', 
    prepTime: 1, 
    onMenu: true, 
    available: true,
    modifiers: [
      {
        name: 'Type',
        required: true,
        options: [
          { name: 'Coca-Cola', price: 0 },
          { name: 'Diet Coke', price: 0 },
          { name: 'Sprite', price: 0 },
          { name: 'Ginger Ale', price: 0 },
          { name: 'Root Beer', price: 0 },
          { name: 'Lemonade', price: 0 }
        ]
      }
    ]
  },
  { id: 'menu-15', name: 'Garlic Mashed Potatoes', description: 'Creamy mashed potatoes with roasted garlic', price: 8.00, category: 'sides', prepTime: 5, onMenu: true, available: true, modifiers: [] },
  { id: 'menu-16', name: 'Seasonal Vegetables', description: 'Chef\'s selection of grilled vegetables', price: 7.00, category: 'sides', prepTime: 6, onMenu: true, available: true, modifiers: [] },
  { 
    id: 'menu-17', 
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
          { name: 'Aioli', price: 0.50 },
          { name: 'Cheese Sauce', price: 1 }
        ]
      }
    ]
  },
];

// Inventory
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

// Generate historical orders for the past week
const generateHistoricalOrders = () => {
  const orders = [];
  const servers = ['staff-2', 'staff-3', 'staff-4', 'staff-5', 'staff-6', 'staff-7', 'staff-8'];
  const tables = ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12', 't13', 't14', 't15', 't16', 't17', 't18', 't19', 't20'];
  const menuItems = [
    { id: 'menu-1', price: 42.00, name: 'Ribeye Steak' },
    { id: 'menu-2', price: 36.00, name: 'Grilled Salmon' },
    { id: 'menu-3', price: 28.00, name: 'Chicken Parmesan' },
    { id: 'menu-4', price: 24.00, name: 'Pasta Primavera' },
    { id: 'menu-5', price: 14.00, name: 'Caesar Salad' },
    { id: 'menu-6', price: 9.00, name: 'Soup of the Day' },
    { id: 'menu-7', price: 16.00, name: 'Calamari' },
    { id: 'menu-11', price: 12.00, name: 'House Red Wine' },
    { id: 'menu-12', price: 12.00, name: 'House White Wine' },
    { id: 'menu-13', price: 8.00, name: 'Draft Beer' },
    { id: 'menu-14', price: 4.00, name: 'Soft Drinks' },
  ];

  let orderIdCounter = 1000;
  let itemIdCounter = 10000;

  // Generate orders for each day of the past week
  for (let day = 7; day >= 1; day--) {
    // Each night has 15-25 tables
    const tablesPerNight = random(15, 25);
    
    for (let i = 0; i < tablesPerNight; i++) {
      const serverId = randomItem(servers);
      const tableId = randomItem(tables);
      const guestCount = random(1, 8);
      const seatedHour = random(17, 21); // 5pm to 9pm
      const seatedMinute = random(0, 59);
      const seatedAt = getDate(day, seatedHour, seatedMinute);
      
      // Order created 5-20 minutes after seating
      const orderDelay = random(5, 20);
      const orderDate = new Date(seatedAt);
      orderDate.setMinutes(orderDate.getMinutes() + orderDelay);
      const createdAt = orderDate.toISOString();
      
      // Bill out 60-120 minutes after seating
      const billOutDelay = random(60, 120);
      const billOutDate = new Date(seatedAt);
      billOutDate.setMinutes(billOutDate.getMinutes() + billOutDelay);
      const closedAt = billOutDate.toISOString();
      
      // Generate 2-6 items per order
      const itemCount = random(2, 6);
      const items = [];
      for (let j = 0; j < itemCount; j++) {
        const menuItem = randomItem(menuItems);
        items.push({
          id: `oi-${itemIdCounter++}`,
          menuItemId: menuItem.id,
          name: menuItem.name,
          guestNumber: random(1, guestCount),
          modifications: random(0, 3) === 0 ? randomItem(['medium', 'well done', 'rare', 'no onions', 'extra sauce']) : '',
          notes: random(0, 4) === 0 ? randomItem(['allergy note', 'extra napkins', 'dressing on side', '']) : '',
          price: menuItem.price,
          sentToKitchen: true
        });
      }
      
      const subtotal = items.reduce((sum, item) => sum + item.price, 0);
      const tipPercent = random(15, 25); // 15-25% tip
      const tip = Math.round(subtotal * tipPercent / 100);
      
      orders.push({
        id: `order-${orderIdCounter++}`,
        tableId,
        serverId,
        guestCount,
        status: 'completed',
        items,
        createdAt,
        closedAt,
        tip
      });
    }
  }
  
  return orders;
};

// Current active orders
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
    createdAt: getDate(0, 19, 23),
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
    createdAt: getDate(0, 19, 45),
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
    createdAt: getDate(0, 18, 30),
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
    createdAt: getDate(0, 20, 0),
    closedAt: null,
    tip: 0
  },
  // Add all historical orders
  ...generateHistoricalOrders()
];

// Generate chits for historical orders
const generateHistoricalChits = (orders) => {
  const chits = [];
  let chitIdCounter = 1000;
  let itemIdCounter = 10000;
  
  orders.filter(o => o.status === 'completed').forEach(order => {
    const foodItems = order.items.filter(item => {
      const menuItem = mockMenuItems.find(m => m.id === item.menuItemId);
      return menuItem && menuItem.category !== 'drinks';
    });
    
    if (foodItems.length > 0) {
      const chitCreated = new Date(order.createdAt);
      const completedDelay = random(12, 25); // 12-25 minutes to complete
      chitCreated.setMinutes(chitCreated.getMinutes() + completedDelay);
      const completedAt = chitCreated.toISOString();
      
      const server = mockStaff.find(s => s.id === order.serverId);
      const table = mockTables.find(t => t.id === order.tableId);
      
      chits.push({
        id: `chit-${chitIdCounter++}`,
        orderId: order.id,
        tableNumber: table?.number || 1,
        serverName: server?.displayName || 'Server',
        status: 'ready',
        items: foodItems.map(item => ({
          id: `ci-${itemIdCounter++}`,
          name: item.name,
          modifications: item.modifications || '',
          notes: item.notes || '',
          guestNumber: item.guestNumber,
          done: true
        })),
        createdAt: order.createdAt,
        completedAt,
        run: true
      });
    }
  });
  
  return chits;
};

// Current active chits
export const mockChits = [
  {
    id: 'chit-1',
    orderId: 'order-1',
    tableNumber: 2,
    serverName: 'Maria Rodriguez',
    status: 'pending',
    items: [
      { id: 'ci-1', name: 'Ribeye Steak', modifications: 'med-rare', notes: 'no onions', guestNumber: 1, done: true },
      { id: 'ci-2', name: 'Grilled Salmon', modifications: '', notes: '', guestNumber: 2, done: true },
      { id: 'ci-3', name: 'Caesar Salad', modifications: '', notes: 'dressing on side', guestNumber: 3, done: false },
      { id: 'ci-4', name: 'Pasta Primavera', modifications: '', notes: 'extra garlic', guestNumber: 4, done: false },
    ],
    createdAt: getDate(0, 19, 25),
    completedAt: null
  },
  {
    id: 'chit-2',
    orderId: 'order-2',
    tableNumber: 3,
    serverName: 'Maria Rodriguez',
    status: 'ready',
    items: [
      { id: 'ci-5', name: 'Calamari', modifications: '', notes: '', guestNumber: 1, done: true },
    ],
    createdAt: getDate(0, 19, 47),
    completedAt: getDate(0, 19, 55)
  },
  {
    id: 'chit-3',
    orderId: 'order-3',
    tableNumber: 5,
    serverName: 'Jake Thompson',
    status: 'pending',
    items: [
      { id: 'ci-6', name: 'Ribeye Steak', modifications: 'medium', notes: '', guestNumber: 1, done: false },
      { id: 'ci-7', name: 'Ribeye Steak', modifications: 'med-well', notes: '', guestNumber: 2, done: false },
      { id: 'ci-8', name: 'Pasta Primavera', modifications: '', notes: '', guestNumber: 3, done: false },
    ],
    createdAt: getDate(0, 18, 35),
    completedAt: null
  },
  {
    id: 'chit-4',
    orderId: 'order-4',
    tableNumber: 7,
    serverName: 'Sophie Chen',
    status: 'ready',
    items: [
      { id: 'ci-9', name: 'Soup of the Day', modifications: '', notes: '', guestNumber: 1, done: true },
      { id: 'ci-10', name: 'Soup of the Day', modifications: '', notes: '', guestNumber: 2, done: true },
    ],
    createdAt: getDate(0, 20, 2),
    completedAt: getDate(0, 20, 7)
  },
  // Add historical chits
  ...generateHistoricalChits(mockOrders.filter(o => o.status === 'completed'))
];

// Default messages
export const defaultMessages = [
  { id: 'msg-1', from: 'server', to: 'kitchen', text: 'Can we get 2 more ribeyes?', timestamp: getDate(0, 19, 30), fromRole: 'server', toRole: 'kitchen', fromName: 'Maria Rodriguez', toName: 'Kitchen', read: false, fromUserId: 'staff-2', toUserId: null },
  { id: 'msg-2', from: 'kitchen', to: 'server', text: 'On it!', timestamp: getDate(0, 19, 31), fromRole: 'kitchen', toRole: 'server', fromName: 'Kitchen', toName: 'Maria Rodriguez', read: false, fromUserId: null, toUserId: 'staff-2' },
];

