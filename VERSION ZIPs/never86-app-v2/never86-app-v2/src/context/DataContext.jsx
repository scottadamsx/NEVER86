import { createContext, useContext, useState, useEffect } from 'react';
import { mockTables, mockMenuItems, mockInventory, mockStaff, mockOrders, mockChits, defaultMessages as mockDefaultMessages } from '../data/mockDataExtended';

const DataContext = createContext();

// Use defaultMessages from mockDataExtended
const defaultMessages = mockDefaultMessages;

// Load data from localStorage or use defaults
const loadDataFromStorage = () => {
  try {
    const savedTables = localStorage.getItem('never86_tables');
    const savedMenuItems = localStorage.getItem('never86_menuItems');
    const savedInventory = localStorage.getItem('never86_inventory');
    const savedStaff = localStorage.getItem('never86_staff');
    const savedOrders = localStorage.getItem('never86_orders');
    const savedChits = localStorage.getItem('never86_chits');
    const savedMessages = localStorage.getItem('never86_messages');

    return {
      tables: savedTables ? JSON.parse(savedTables) : mockTables,
      menuItems: savedMenuItems ? JSON.parse(savedMenuItems) : mockMenuItems,
      inventory: savedInventory ? JSON.parse(savedInventory) : mockInventory,
      staff: savedStaff ? JSON.parse(savedStaff) : mockStaff,
      orders: savedOrders ? JSON.parse(savedOrders) : mockOrders,
      chits: savedChits ? JSON.parse(savedChits) : mockChits,
      messages: savedMessages ? JSON.parse(savedMessages) : defaultMessages,
    };
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return {
      tables: mockTables,
      menuItems: mockMenuItems,
      inventory: mockInventory,
      staff: mockStaff,
      orders: mockOrders,
      chits: mockChits,
      messages: defaultMessages,
    };
  }
};

export function DataProvider({ children }) {
  const initialData = loadDataFromStorage();

  const [tables, setTables] = useState(initialData.tables);
  const [menuItems, setMenuItems] = useState(initialData.menuItems);
  const [inventory, setInventory] = useState(initialData.inventory);
  const [staff, setStaff] = useState(initialData.staff);
  const [orders, setOrders] = useState(initialData.orders);
  const [chits, setChits] = useState(initialData.chits);
  const [messages, setMessages] = useState(initialData.messages);
  
  // Load table history from localStorage or initialize from completed orders
  const loadTableHistory = () => {
    try {
      const savedHistory = localStorage.getItem('never86_tableHistory');
      if (savedHistory) {
        return JSON.parse(savedHistory);
      }
      // Initialize from completed orders if no history exists
      const completedOrders = initialData.orders.filter(o => o.status === 'completed');
      const history = [];
      completedOrders.forEach(order => {
        const table = initialData.tables.find(t => t.id === order.tableId);
        const orderChits = initialData.chits.filter(c => c.orderId === order.id);
        
        const seatedTime = order.createdAt ? new Date(order.createdAt) : null;
        const orderCreatedTime = new Date(order.createdAt);
        const closingTime = new Date(order.closedAt);
        
        const timeToOrder = seatedTime ? Math.floor((orderCreatedTime - seatedTime) / 60000) : 0;
        
        const avgOrderRunTime = orderChits.length > 0
          ? orderChits.reduce((sum, chit) => {
              if (chit.completedAt && chit.createdAt) {
                const runTime = Math.floor((new Date(chit.completedAt) - new Date(chit.createdAt)) / 60000);
                return sum + runTime;
              }
              return sum;
            }, 0) / orderChits.length
          : 0;
        
        const totalPartyTime = seatedTime ? Math.floor((closingTime - seatedTime) / 60000) : 0;
        
        history.push({
          id: `history-${order.id}`,
          tableId: order.tableId,
          tableNumber: table?.number,
          orderId: order.id,
          serverId: order.serverId,
          guestCount: order.guestCount,
          seatedAt: seatedTime?.toISOString(),
          orderCreatedAt: order.createdAt,
          closedAt: order.closedAt,
          timeToOrder,
          avgOrderRunTime,
          totalPartyTime,
          totalSales: order.items.reduce((sum, item) => sum + item.price, 0),
          tip: order.tip || 0,
          chits: orderChits.map(c => ({
            id: c.id,
            createdAt: c.createdAt,
            completedAt: c.completedAt,
            runTime: c.completedAt && c.createdAt
              ? Math.floor((new Date(c.completedAt) - new Date(c.createdAt)) / 60000)
              : null
          }))
        });
      });
      // Save initial history to localStorage
      if (history.length > 0) {
        localStorage.setItem('never86_tableHistory', JSON.stringify(history));
      }
      return history;
    } catch (error) {
      console.error('Error loading table history:', error);
      return [];
    }
  };
  
  const [tableHistory, setTableHistory] = useState(loadTableHistory());

  // Optimized: Batch localStorage writes with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('never86_tables', JSON.stringify(tables));
        localStorage.setItem('never86_menuItems', JSON.stringify(menuItems));
        localStorage.setItem('never86_inventory', JSON.stringify(inventory));
        localStorage.setItem('never86_staff', JSON.stringify(staff));
        localStorage.setItem('never86_orders', JSON.stringify(orders));
        localStorage.setItem('never86_chits', JSON.stringify(chits));
        localStorage.setItem('never86_messages', JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }, 300); // Debounce: wait 300ms after last change

    return () => clearTimeout(timeoutId);
  }, [tables, menuItems, inventory, staff, orders, chits, messages]);

  // Function to reload mock data
  const reloadMockData = () => {
    // Save fresh mock data to localStorage
    localStorage.setItem('never86_tables', JSON.stringify(mockTables));
    localStorage.setItem('never86_menuItems', JSON.stringify(mockMenuItems));
    localStorage.setItem('never86_inventory', JSON.stringify(mockInventory));
    localStorage.setItem('never86_staff', JSON.stringify(mockStaff));
    localStorage.setItem('never86_orders', JSON.stringify(mockOrders));
    localStorage.setItem('never86_chits', JSON.stringify(mockChits));
      localStorage.setItem('never86_messages', JSON.stringify(defaultMessages));
      
      // Initialize table history from completed orders
      const completedOrders = mockOrders.filter(o => o.status === 'completed');
      const initialHistory = [];
      completedOrders.forEach(order => {
        const table = mockTables.find(t => t.id === order.tableId);
        const orderChits = mockChits.filter(c => c.orderId === order.id);
        
        const seatedTime = order.createdAt ? new Date(order.createdAt) : null;
        const orderCreatedTime = new Date(order.createdAt);
        const closingTime = new Date(order.closedAt);
        
        const timeToOrder = seatedTime ? Math.floor((orderCreatedTime - seatedTime) / 60000) : 0;
        
        const avgOrderRunTime = orderChits.length > 0
          ? orderChits.reduce((sum, chit) => {
              if (chit.completedAt && chit.createdAt) {
                const runTime = Math.floor((new Date(chit.completedAt) - new Date(chit.createdAt)) / 60000);
                return sum + runTime;
              }
              return sum;
            }, 0) / orderChits.length
          : 0;
        
        const totalPartyTime = seatedTime ? Math.floor((closingTime - seatedTime) / 60000) : 0;
        
        initialHistory.push({
          id: `history-${order.id}`,
          tableId: order.tableId,
          tableNumber: table?.number,
          orderId: order.id,
          serverId: order.serverId,
          guestCount: order.guestCount,
          seatedAt: seatedTime?.toISOString(),
          orderCreatedAt: order.createdAt,
          closedAt: order.closedAt,
          timeToOrder,
          avgOrderRunTime,
          totalPartyTime,
          totalSales: order.items.reduce((sum, item) => sum + item.price, 0),
          tip: order.tip || 0,
          chits: orderChits.map(c => ({
            id: c.id,
            createdAt: c.createdAt,
            completedAt: c.completedAt,
            runTime: c.completedAt && c.createdAt
              ? Math.floor((new Date(c.completedAt) - new Date(c.createdAt)) / 60000)
              : null
          }))
        });
      });
      
      localStorage.setItem('never86_tableHistory', JSON.stringify(initialHistory));
      
      // Update state
      setTables(mockTables);
      setMenuItems(mockMenuItems);
      setInventory(mockInventory);
      setStaff(mockStaff);
      setOrders(mockOrders);
      setChits(mockChits);
      setMessages(defaultMessages);
      setTableHistory(initialHistory);
  };

  const addMessage = (fromRole, toRole, text, fromName, toName, messageType = 'chat', fromUserId = null, toUserId = null) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      from: fromRole,
      to: toRole,
      text,
      timestamp: new Date().toISOString(),
      fromRole,
      toRole,
      fromName: fromName || fromRole,
      toName: toName || toRole,
      fromUserId, // Add user-specific ID
      toUserId, // Add user-specific ID
      read: false,
      type: messageType // 'chat', '86-request', 'server-request'
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const markMessageAsRead = (messageId) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };

  const markAllMessagesAsRead = (userRole, userId = null) => {
    setMessages(prev => prev.map(msg => {
      const matchesRole = msg.toRole === userRole;
      const matchesUser = userId ? msg.toUserId === userId : true;
      return (matchesRole && matchesUser) ? { ...msg, read: true } : msg;
    }));
  };

  // Table functions
  const seatTable = (tableId, guestCount, serverId) => {
    setTables(prev => prev.map(table =>
      table.id === tableId
        ? { ...table, status: 'occupied', guestCount, serverId, seatedAt: new Date().toISOString() }
        : table
    ));
  };

  const clearTable = (tableId) => {
    setTables(prev => prev.map(table =>
      table.id === tableId
        ? { ...table, status: 'available', guestCount: 0, serverId: null, seatedAt: null, currentOrderId: null }
        : table
    ));
  };

  const updateTable = (tableId, updates) => {
    setTables(prev => prev.map(table =>
      table.id === tableId
        ? { ...table, ...updates }
        : table
    ));
  };

  // Order functions
  const createOrder = (tableId, serverId, guestCount) => {
    const newOrder = {
      id: `order-${Date.now()}`,
      tableId,
      serverId,
      guestCount,
      status: 'active',
      items: [],
      createdAt: new Date().toISOString(),
      closedAt: null,
      tip: 0
    };
    setOrders(prev => [...prev, newOrder]);
    setTables(prev => prev.map(table =>
      table.id === tableId
        ? { ...table, currentOrderId: newOrder.id }
        : table
    ));
    return newOrder;
  };

  const addItemToOrder = (orderId, item) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { ...order, items: [...order.items, item] }
        : order
    ));
  };

  const removeItemFromOrder = (orderId, itemId) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { ...order, items: order.items.filter(item => item.id !== itemId) }
        : order
    ));
  };

  const sendToKitchen = (orderId, items, tableNumber, serverName) => {
    const newChit = {
      id: `chit-${Date.now()}`,
      orderId,
      tableNumber,
      serverName,
      status: 'pending',
      items: items.map(item => ({ 
        id: `ci-${Date.now()}-${Math.random()}`,
        name: item.name, 
        modifications: item.modifications || '', 
        notes: item.notes || '', 
        guestNumber: item.guestNumber,
        done: false 
      })),
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    setChits(prev => [...prev, newChit]);
    
    // Mark items as sent to kitchen in the order
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? {
            ...order,
            items: order.items.map(item =>
              items.some(sentItem => sentItem.id === item.id)
                ? { ...item, sentToKitchen: true }
                : item
            )
          }
        : order
    ));
    
    return newChit;
  };

  const markChitItemDone = (chitId, itemId) => {
    setChits(prev => prev.map(chit =>
      chit.id === chitId
        ? {
            ...chit,
            items: chit.items.map(item =>
              item.id === itemId ? { ...item, done: true } : item
            )
          }
        : chit
    ));
  };

  const sendChitToFloor = (chitId) => {
    setChits(prev => prev.map(chit =>
      chit.id === chitId
        ? { ...chit, status: 'ready', completedAt: new Date().toISOString(), run: false }
        : chit
    ));
  };

  const markChitAsRun = (chitId) => {
    setChits(prev => prev.map(chit =>
      chit.id === chitId
        ? { ...chit, run: true }
        : chit
    ));
  };

  const closeOrder = (orderId, tip) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const table = tables.find(t => t.id === order.tableId);
    const closedAt = new Date().toISOString();

    // Calculate time metrics
    const seatedTime = table?.seatedAt ? new Date(table.seatedAt) : null;
    const orderCreatedTime = new Date(order.createdAt);
    const closingTime = new Date(closedAt);

    // Time from seating to first order
    const timeToOrder = seatedTime ? Math.floor((orderCreatedTime - seatedTime) / 60000) : 0;

    // Get all chits for this order
    const orderChits = chits.filter(c => c.orderId === orderId);

    // Calculate average time from order to food ready
    const avgOrderRunTime = orderChits.length > 0
      ? orderChits.reduce((sum, chit) => {
          if (chit.completedAt && chit.createdAt) {
            const runTime = Math.floor((new Date(chit.completedAt) - new Date(chit.createdAt)) / 60000);
            return sum + runTime;
          }
          return sum;
        }, 0) / orderChits.length
      : 0;

    // Total party time (from seating to bill out)
    const totalPartyTime = seatedTime ? Math.floor((closingTime - seatedTime) / 60000) : 0;

    // Record to table history
    const historyRecord = {
      id: `history-${Date.now()}`,
      tableId: order.tableId,
      tableNumber: table?.number,
      orderId,
      serverId: order.serverId,
      guestCount: order.guestCount,
      seatedAt: table?.seatedAt,
      orderCreatedAt: order.createdAt,
      closedAt,
      timeToOrder, // minutes from seating to order
      avgOrderRunTime, // average minutes from order to food ready
      totalPartyTime, // total minutes from seating to bill out
      totalSales: order.items.reduce((sum, item) => sum + item.price, 0),
      tip,
      chits: orderChits.map(c => ({
        id: c.id,
        createdAt: c.createdAt,
        completedAt: c.completedAt,
        runTime: c.completedAt && c.createdAt
          ? Math.floor((new Date(c.completedAt) - new Date(c.createdAt)) / 60000)
          : null
      }))
    };

    setTableHistory(prev => {
      const updated = [...prev, historyRecord];
      // Save to localStorage
      try {
        localStorage.setItem('never86_tableHistory', JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving table history:', error);
      }
      return updated;
    });

    // Update order status
    setOrders(prev => prev.map(o =>
      o.id === orderId
        ? { ...o, status: 'completed', tip, closedAt }
        : o
    ));
  };

  // Inventory functions
  const updateInventoryQuantity = (itemId, newQuantity) => {
    setInventory(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const adjustInventoryQuantity = (itemId, adjustment) => {
    setInventory(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, quantity: Math.max(0, item.quantity + adjustment) }
        : item
    ));
  };

  const addInventoryItem = (item) => {
    setInventory(prev => [...prev, { ...item, id: `inv-${Date.now()}` }]);
  };

  // Menu functions
  const addMenuItem = (item) => {
    setMenuItems(prev => [...prev, { ...item, id: `menu-${Date.now()}` }]);
  };

  const updateMenuItem = (itemId, updates) => {
    setMenuItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, ...updates }
        : item
    ));
  };

  const toggleMenuItemAvailable = (itemId) => {
    setMenuItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, available: !item.available }
        : item
    ));
  };

  // Staff functions
  const addStaffMember = (member) => {
    setStaff(prev => [...prev, { ...member, id: `staff-${Date.now()}`, createdAt: new Date().toISOString().split('T')[0], status: 'active' }]);
  };

  const updateStaffMember = (memberId, updates) => {
    setStaff(prev => prev.map(member =>
      member.id === memberId
        ? { ...member, ...updates }
        : member
    ));
  };

  // Getters
  const getTablesBySection = (section) => tables.filter(t => t.section === section);
  const getTablesByServer = (serverId) => tables.filter(t => t.serverId === serverId);
  const getOrderByTable = (tableId) => orders.find(o => o.tableId === tableId && o.status === 'active');
  const getActiveChits = () => chits.filter(c => c.status === 'pending');
  const getCompletedChits = () => chits.filter(c => c.status === 'ready');
  const getLowInventory = () => inventory.filter(i => i.quantity <= i.minThreshold).slice(0, 5);
  const getStaffByRole = (role) => staff.filter(s => s.role === role);
  const getTableHistory = (tableId) => tableHistory.filter(h => h.tableId === tableId);

  // Restaurant metadata calculations
  const getRestaurantMetrics = () => {
    if (tableHistory.length === 0) {
      return {
        avgPartyTime: 0,
        avgOrderRunTime: 0,
        avgTimeToOrder: 0,
        totalCovers: 0,
        avgCheckSize: 0
      };
    }

    const totalPartyTime = tableHistory.reduce((sum, h) => sum + h.totalPartyTime, 0);
    const totalOrderRunTime = tableHistory.reduce((sum, h) => sum + h.avgOrderRunTime, 0);
    const totalTimeToOrder = tableHistory.reduce((sum, h) => sum + h.timeToOrder, 0);
    const totalCovers = tableHistory.reduce((sum, h) => sum + h.guestCount, 0);
    const totalSales = tableHistory.reduce((sum, h) => sum + h.totalSales, 0);

    return {
      avgPartyTime: Math.round(totalPartyTime / tableHistory.length),
      avgOrderRunTime: Math.round(totalOrderRunTime / tableHistory.length),
      avgTimeToOrder: Math.round(totalTimeToOrder / tableHistory.length),
      totalCovers,
      avgCheckSize: tableHistory.length > 0 ? totalSales / tableHistory.length : 0
    };
  };

  return (
    <DataContext.Provider value={{
      // Data
      tables,
      menuItems,
      inventory,
      staff,
      orders,
      chits,
      messages,
      // Table functions
      seatTable,
      clearTable,
      updateTable,
      // Order functions
      createOrder,
      addItemToOrder,
      removeItemFromOrder,
      sendToKitchen,
      markChitItemDone,
      sendChitToFloor,
      markChitAsRun,
      closeOrder,
      // Inventory functions
      updateInventoryQuantity,
      adjustInventoryQuantity,
      addInventoryItem,
      // Menu functions
      addMenuItem,
      updateMenuItem,
      toggleMenuItemAvailable,
      // Staff functions
      addStaffMember,
      updateStaffMember,
      // Getters
      getTablesBySection,
      getTablesByServer,
      getOrderByTable,
      getActiveChits,
      getCompletedChits,
      getLowInventory,
      getStaffByRole,
      getTableHistory,
      getRestaurantMetrics,
      // Chat functions
      addMessage,
      markMessageAsRead,
      markAllMessagesAsRead,
      // Data management
      reloadMockData,
      tableHistory,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}