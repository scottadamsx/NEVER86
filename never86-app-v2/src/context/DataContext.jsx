/**
 * DATA CONTEXT
 * 
 * This is the CENTRAL STATE MANAGEMENT for the entire restaurant application.
 * It manages ALL data: tables, orders, menu items, inventory, staff, etc.
 * 
 * WHAT IT DOES:
 * - Stores all restaurant data in React state
 * - Persists data to localStorage (so it survives page refreshes)
 * - Provides functions to update data (seatTable, createOrder, etc.)
 * - Handles data versioning (clears old data when structure changes)
 * - Makes all data available to any component via useData() hook
 * 
 * DATA STRUCTURES MANAGED:
 * - tables: Restaurant tables (status, section, current order, etc.)
 * - menuItems: Menu items with prices, categories, modifiers
 * - orders: Customer orders (items, status, totals, etc.)
 * - chits: Kitchen tickets (orders sent to kitchen)
 * - inventory: Stock levels for ingredients
 * - staff: Staff members (servers, managers, kitchen)
 * - messages: Chat messages between staff
 * - tableHistory: Historical data about completed tables
 * - storeHours: Restaurant operating hours
 * - timeOffRequests: Staff time-off requests
 * - staffAvailability: Staff availability schedules
 * - notifications: System notifications
 * 
 * HOW TO USE:
 * In any component:
 *   const { tables, orders, seatTable, createOrder } = useData();
 * 
 * PERSISTENCE:
 * - All data is saved to localStorage automatically
 * - Data persists across page refreshes
 * - When DATA_VERSION changes, old data is cleared and fresh mock data is loaded
 * 
 * IMPORTANT:
 * This is a MOCK implementation - in production, this would connect to a real API/database.
 * Currently, all data is stored in browser localStorage.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { mockTables, mockMenuItems, mockInventory, mockStaff, mockOrders, mockChits, defaultMessages as mockDefaultMessages } from '../data/mockDataExtended';

const DataContext = createContext();

/**
 * DATA_VERSION
 * 
 * Increment this number when the data structure changes.
 * When the version changes, all old localStorage data is cleared
 * and fresh mock data is loaded.
 * 
 * This prevents errors when data structures are updated.
 */
const DATA_VERSION = 2;

// Use defaultMessages from mockDataExtended
const defaultMessages = mockDefaultMessages;

/**
 * loadDataFromStorage Function
 * 
 * Loads all restaurant data from localStorage, or uses default mock data if:
 * - localStorage is empty (first time user visits)
 * - Data version has changed (structure updated)
 * - Error occurs reading from localStorage
 * 
 * @returns {Object} Object containing all data: { tables, menuItems, inventory, staff, orders, chits, messages }
 */
const loadDataFromStorage = () => {
  try {
    // STEP 1: Check if data version has changed
    // If version changed, clear all old data and use fresh mock data
    const savedVersion = localStorage.getItem('never86_data_version');
    if (savedVersion !== String(DATA_VERSION)) {
      console.log('Data version changed, refreshing with new mock data');
      
      // Clear all old data from localStorage
      localStorage.removeItem('never86_tables');
      localStorage.removeItem('never86_menuItems');
      localStorage.removeItem('never86_inventory');
      localStorage.removeItem('never86_staff');
      localStorage.removeItem('never86_orders');
      localStorage.removeItem('never86_chits');
      localStorage.removeItem('never86_messages');
      
      // Save new version number
      localStorage.setItem('never86_data_version', String(DATA_VERSION));
      
      // Return fresh mock data
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

    // STEP 2: Version matches - try to load saved data from localStorage
    const savedTables = localStorage.getItem('never86_tables');
    const savedMenuItems = localStorage.getItem('never86_menuItems');
    const savedInventory = localStorage.getItem('never86_inventory');
    const savedStaff = localStorage.getItem('never86_staff');
    const savedOrders = localStorage.getItem('never86_orders');
    const savedChits = localStorage.getItem('never86_chits');
    const savedMessages = localStorage.getItem('never86_messages');

    // Parse JSON strings back to objects, or use mock data if not found
    let parsedStaff;
    try {
      parsedStaff = savedStaff ? JSON.parse(savedStaff) : null;
    } catch (e) {
      console.error('Error parsing staff from localStorage:', e);
      parsedStaff = null;
    }
    
    // Ensure staff always has data - if empty array or invalid, use mock data and fix localStorage
    const staff = (parsedStaff && Array.isArray(parsedStaff) && parsedStaff.length > 0) 
      ? parsedStaff 
      : mockStaff;
    
    // If we had to use mock data, save it to localStorage to fix the issue
    if (!parsedStaff || !Array.isArray(parsedStaff) || parsedStaff.length === 0) {
      console.warn('Staff data was empty or invalid, using mock data and fixing localStorage');
      localStorage.setItem('never86_staff', JSON.stringify(mockStaff));
    }
    
    return {
      tables: savedTables ? JSON.parse(savedTables) : mockTables,
      menuItems: savedMenuItems ? JSON.parse(savedMenuItems) : mockMenuItems,
      inventory: savedInventory ? JSON.parse(savedInventory) : mockInventory,
      staff: staff,
      orders: savedOrders ? JSON.parse(savedOrders) : mockOrders,
      chits: savedChits ? JSON.parse(savedChits) : mockChits,
      messages: savedMessages ? JSON.parse(savedMessages) : defaultMessages,
    };
  } catch (error) {
    // STEP 3: If any error occurs (corrupted data, etc.), use fresh mock data
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

/**
 * DataProvider Component
 * 
 * The main provider component that wraps the app and provides all restaurant data.
 * 
 * WHAT IT DOES:
 * 1. Loads initial data from localStorage or mock data
 * 2. Manages all state (tables, orders, menu, etc.)
 * 3. Provides functions to update data (seatTable, createOrder, etc.)
 * 4. Automatically saves data to localStorage when it changes
 * 5. Makes everything available via useData() hook
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - All child components
 */
export function DataProvider({ children }) {
  // Load initial data (from localStorage or mock data)
  const initialData = loadDataFromStorage();

  // ============================================
  // STATE MANAGEMENT
  // ============================================
  // All restaurant data is stored in React state
  // When these change, components that use them will automatically re-render
  
  // Ensure staff always has data - fallback to mock if empty
  const initialStaff = initialData.staff && initialData.staff.length > 0 
    ? initialData.staff 
    : mockStaff;
  
  // Debug: Log staff initialization
  console.log('DataContext: Initial staff data:', initialStaff);
  console.log('DataContext: Staff count:', initialStaff?.length);
  
  const [tables, setTables] = useState(initialData.tables);           // Restaurant tables
  const [menuItems, setMenuItems] = useState(initialData.menuItems); // Menu items
  const [inventory, setInventory] = useState(initialData.inventory); // Inventory stock
  const [staff, setStaff] = useState(initialStaff);             // Staff members
  
  // Debug: Log staff state changes
  useEffect(() => {
    console.log('DataContext: Staff state updated:', staff);
    console.log('DataContext: Staff count:', staff?.length);
  }, [staff]);
  const [orders, setOrders] = useState(initialData.orders);          // Customer orders
  const [chits, setChits] = useState(initialData.chits);              // Kitchen tickets
  const [messages, setMessages] = useState(initialData.messages);    // Chat messages
  
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

  // Store hours state
  const [storeHours, setStoreHours] = useState(() => {
    try {
      const saved = localStorage.getItem('never86_storeHours');
      return saved ? JSON.parse(saved) : {
        monday: { open: '11:00', close: '22:00', closed: false },
        tuesday: { open: '11:00', close: '22:00', closed: false },
        wednesday: { open: '11:00', close: '22:00', closed: false },
        thursday: { open: '11:00', close: '22:00', closed: false },
        friday: { open: '11:00', close: '23:00', closed: false },
        saturday: { open: '10:00', close: '23:00', closed: false },
        sunday: { open: '10:00', close: '21:00', closed: false }
      };
    } catch { return {}; }
  });

  // Time off requests state
  const [timeOffRequests, setTimeOffRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('never86_timeOffRequests');
      return saved ? JSON.parse(saved) : [
        { id: 'tor-1', staffId: 'staff-3', startDate: '2026-01-20', endDate: '2026-01-22', reason: 'Family vacation', status: 'pending', createdAt: '2026-01-10' },
        { id: 'tor-2', staffId: 'staff-4', startDate: '2026-01-25', endDate: '2026-01-25', reason: 'Doctor appointment', status: 'pending', createdAt: '2026-01-12' }
      ];
    } catch { return []; }
  });

  // Staff availability state
  const [staffAvailability, setStaffAvailability] = useState(() => {
    try {
      const saved = localStorage.getItem('never86_staffAvailability');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  // Notifications state - cross-portal notifications
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('never86_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('never86_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Add a notification
  const addNotification = (notification) => {
    const newNotification = {
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification;
  };

  // Mark notification as read
  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  // Mark all notifications as read for a specific role/user
  const markAllNotificationsAsRead = (forRole) => {
    setNotifications(prev => prev.map(n => 
      n.forRole === forRole ? { ...n, read: true } : n
    ));
  };

  // Get notifications for a specific role
  const getNotificationsForRole = (role) => {
    return notifications.filter(n => n.forRole === role || n.forRole === 'all');
  };

  // Get unread count for a role
  const getUnreadNotificationCount = (role) => {
    return notifications.filter(n => (n.forRole === role || n.forRole === 'all') && !n.read).length;
  };

  // Get unread message count for a user
  const getUnreadMessageCount = (userId) => {
    return messages.filter(m => m.to === userId && !m.read).length;
  };

  /**
   * AUTO-SAVE TO LOCALSTORAGE
   * 
   * This useEffect automatically saves all data to localStorage whenever it changes.
   * 
   * OPTIMIZATION: Uses debouncing (300ms delay) to avoid saving on every keystroke.
   * Instead, it waits 300ms after the last change, then saves once.
   * This improves performance by reducing localStorage writes.
   * 
   * HOW IT WORKS:
   * 1. When any data changes (tables, orders, etc.), this effect runs
   * 2. It sets a 300ms timer
   * 3. If data changes again within 300ms, the timer resets
   * 4. After 300ms of no changes, it saves everything to localStorage
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        // Save all data to localStorage as JSON strings
        localStorage.setItem('never86_tables', JSON.stringify(tables));
        localStorage.setItem('never86_menuItems', JSON.stringify(menuItems));
        localStorage.setItem('never86_inventory', JSON.stringify(inventory));
        localStorage.setItem('never86_staff', JSON.stringify(staff));
        localStorage.setItem('never86_orders', JSON.stringify(orders));
        localStorage.setItem('never86_chits', JSON.stringify(chits));
        localStorage.setItem('never86_messages', JSON.stringify(messages));
        localStorage.setItem('never86_storeHours', JSON.stringify(storeHours));
        localStorage.setItem('never86_timeOffRequests', JSON.stringify(timeOffRequests));
        localStorage.setItem('never86_staffAvailability', JSON.stringify(staffAvailability));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }, 300); // Debounce: wait 300ms after last change before saving

    // Cleanup: Cancel the timer if data changes again before 300ms
    return () => clearTimeout(timeoutId);
  }, [tables, menuItems, inventory, staff, orders, chits, messages, storeHours, timeOffRequests, staffAvailability]);

  /**
   * Load scenario data - replaces entire app state
   * 
   * @param {Object} scenarioData - Data object with tables, menuItems, inventory, staff, orders, chits, messages
   */
  const loadScenarioData = (scenarioData) => {
    // Validate required data
    if (!scenarioData) {
      throw new Error('Scenario data is required');
    }

    // Set all state to new data (with defaults for missing)
    // Ensure staff always has data - fallback to mock if empty
    const scenarioStaff = scenarioData.staff && scenarioData.staff.length > 0 
      ? scenarioData.staff 
      : mockStaff;
    
    setTables(scenarioData.tables || []);
    setMenuItems(scenarioData.menuItems || []);
    setInventory(scenarioData.inventory || []);
    setStaff(scenarioStaff);
    setOrders(scenarioData.orders || []);
    setChits(scenarioData.chits || []);
    setMessages(scenarioData.messages || []);

    // Save to localStorage immediately
    try {
      localStorage.setItem('never86_tables', JSON.stringify(scenarioData.tables || []));
      localStorage.setItem('never86_menuItems', JSON.stringify(scenarioData.menuItems || []));
      localStorage.setItem('never86_inventory', JSON.stringify(scenarioData.inventory || []));
      localStorage.setItem('never86_staff', JSON.stringify(scenarioStaff));
      localStorage.setItem('never86_orders', JSON.stringify(scenarioData.orders || []));
      localStorage.setItem('never86_chits', JSON.stringify(scenarioData.chits || []));
      localStorage.setItem('never86_messages', JSON.stringify(scenarioData.messages || []));
    } catch (error) {
      console.error('Error saving scenario data to localStorage:', error);
      throw new Error('Failed to save scenario data');
    }

    // Initialize table history from completed orders
    const completedOrders = (scenarioData.orders || []).filter(o => o.status === 'completed');
    const initialHistory = [];
    completedOrders.forEach(order => {
      const table = (scenarioData.tables || []).find(t => t.id === order.tableId);
      const orderChits = (scenarioData.chits || []).filter(c => c.orderId === order.id);
      
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
        totalSales: order.items?.reduce((sum, item) => sum + item.price, 0) || 0,
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
    setTableHistory(initialHistory);
  };

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
  /**
   * seatTable Function
   * 
   * Marks a table as occupied when guests are seated.
   * 
   * @param {string} tableId - The ID of the table to seat
   * @param {number} guestCount - Number of guests at the table
   * @param {string} serverId - ID of the server assigned to this table
   */
  const seatTable = (tableId, guestCount, serverId) => {
    setTables(prev => prev.map(table =>
      // Find the table by ID and update its status
      table.id === tableId
        ? { ...table, status: 'occupied', guestCount, serverId, seatedAt: new Date().toISOString() }
        : table  // Keep other tables unchanged
    ));
  };

  /**
   * clearTable Function
   * 
   * Marks a table as available after guests leave.
   * Resets all table data (guest count, server, order, etc.)
   * 
   * @param {string} tableId - The ID of the table to clear
   */
  const clearTable = (tableId) => {
    setTables(prev => prev.map(table =>
      // Find the table by ID and reset it to available
      table.id === tableId
        ? { ...table, status: 'available', guestCount: 0, serverId: null, seatedAt: null, currentOrderId: null }
        : table  // Keep other tables unchanged
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
  /**
   * createOrder Function
   * 
   * Creates a new order for a table.
   * 
   * @param {string} tableId - The table this order is for
   * @param {string} serverId - The server taking the order
   * @param {number} guestCount - Number of guests at the table
   * @returns {Object} The newly created order object
   */
  const createOrder = (tableId, serverId, guestCount) => {
    // Create new order object
    const newOrder = {
      id: `order-${Date.now()}`,  // Unique ID based on timestamp
      tableId,
      serverId,
      guestCount,
      status: 'active',  // Order is active (not completed)
      items: [],  // Start with empty items array
      createdAt: new Date().toISOString(),
      closedAt: null,  // Will be set when order is completed
      tip: 0  // No tip yet
    };
    
    // Add new order to orders array
    setOrders(prev => [...prev, newOrder]);
    
    // Link the order to the table
    setTables(prev => prev.map(table =>
      table.id === tableId
        ? { ...table, currentOrderId: newOrder.id }
        : table
    ));
    
    return newOrder;
  };

  /**
   * addItemToOrder Function
   * 
   * Adds a menu item to an existing order.
   * 
   * @param {string} orderId - The order to add the item to
   * @param {Object} item - The menu item object to add
   */
  const addItemToOrder = (orderId, item) => {
    setOrders(prev => prev.map(order =>
      // Find the order and add the new item to its items array
      order.id === orderId
        ? { ...order, items: [...order.items, item] }
        : order  // Keep other orders unchanged
    ));
  };

  /**
   * removeItemFromOrder Function
   * 
   * Removes an item from an order (before it's sent to kitchen).
   * 
   * @param {string} orderId - The order to remove the item from
   * @param {string} itemId - The ID of the item to remove
   */
  const removeItemFromOrder = (orderId, itemId) => {
    setOrders(prev => prev.map(order =>
      // Find the order and filter out the item
      order.id === orderId
        ? { ...order, items: order.items.filter(item => item.id !== itemId) }
        : order  // Keep other orders unchanged
    ));
  };

  /**
   * sendToKitchen Function
   * 
   * Sends items from an order to the kitchen (creates a "chit").
   * This is what servers do when they're ready to send food items to be cooked.
   * 
   * @param {string} orderId - The order these items belong to
   * @param {Array} items - Array of order items to send to kitchen
   * @param {number} tableNumber - The table number (for display in kitchen)
   * @param {string} serverName - Name of the server (for display in kitchen)
   */
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

  // Store hours functions
  const updateStoreHours = (newHours) => {
    setStoreHours(newHours);
  };

  // Time off request functions
  const addTimeOffRequest = (request, staffName) => {
    const newRequest = {
      ...request,
      id: `tor-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTimeOffRequests(prev => [...prev, newRequest]);
    
    // Create notification for managers
    addNotification({
      type: 'time_off_request',
      forRole: 'manager',
      title: 'Time Off Request',
      message: `${staffName || 'A staff member'} has requested time off from ${new Date(request.startDate).toLocaleDateString()} to ${new Date(request.endDate).toLocaleDateString()}`,
      link: '/manager/schedule',
      relatedId: newRequest.id
    });
    
    return newRequest;
  };

  const updateTimeOffRequest = (requestId, status) => {
    setTimeOffRequests(prev => prev.map(req =>
      req.id === requestId
        ? { ...req, status, updatedAt: new Date().toISOString() }
        : req
    ));
  };

  const getTimeOffRequestsByStaff = (staffId) => {
    return timeOffRequests.filter(req => req.staffId === staffId);
  };

  // Staff availability functions
  const updateStaffAvailability = (staffId, availability) => {
    setStaffAvailability(prev => ({
      ...prev,
      [staffId]: availability
    }));
  };

  const getStaffAvailability = (staffId) => {
    return staffAvailability[staffId] || {
      monday: { available: true, preferredShift: 'any' },
      tuesday: { available: true, preferredShift: 'any' },
      wednesday: { available: true, preferredShift: 'any' },
      thursday: { available: true, preferredShift: 'any' },
      friday: { available: true, preferredShift: 'any' },
      saturday: { available: true, preferredShift: 'any' },
      sunday: { available: true, preferredShift: 'any' }
    };
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
      // Store hours
      storeHours,
      updateStoreHours,
      // Time off requests
      timeOffRequests,
      addTimeOffRequest,
      updateTimeOffRequest,
      getTimeOffRequestsByStaff,
      // Staff availability
      staffAvailability,
      updateStaffAvailability,
      getStaffAvailability,
      // Notifications
      notifications,
      addNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      getNotificationsForRole,
      getUnreadNotificationCount,
      getUnreadMessageCount,
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
      loadScenarioData,
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