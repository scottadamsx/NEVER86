import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { X, Users, Plus, Minus, Send, Trash2, CheckCircle, Droplet, Utensils, Coffee, Square, FlaskConical } from 'lucide-react';
import { TableSkeleton } from '../../components/SkeletonLoader';
import { formatTimeElapsed } from '../../utils/timeFormat';

function ServerTables() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { success, error: showError } = useToast();
  const { tables = [], orders = [], menuItems = [], chits = [], staff = [], seatTable, getOrderByTable, createOrder, addItemToOrder, removeItemFromOrder, sendToKitchen, markChitAsRun } = useData();
  const [selectedTable, setSelectedTable] = useState(null);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [guestCount, setGuestCount] = useState(2);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedGuest, setSelectedGuest] = useState(1);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [customizations, setCustomizations] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [showSentItemModal, setShowSentItemModal] = useState(false);
  const [selectedSentItem, setSelectedSentItem] = useState(null);
  const [orderViewMode, setOrderViewMode] = useState('menu'); // 'menu' or 'ordered'
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [selectedRefillItem, setSelectedRefillItem] = useState(null);
  const [quickActions, setQuickActions] = useState([]);

  const getQuickActionIcon = (type) => {
    switch (type) {
      case 'napkins': return <Square size={16} />;
      case 'cutlery': return <Utensils size={16} />;
      case 'water': return <Droplet size={16} />;
      case 'condiments': return <FlaskConical size={16} />;
      case 'drinks': return <Coffee size={16} />;
      default: return null;
    }
  };

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get server's section from staff data
  const mySection = useMemo(() => {
    const serverStaff = staff.find(s => s.id === currentUser?.id);
    return serverStaff?.section || 'A'; // Default to 'A' if not found
  }, [staff, currentUser?.id]);

  const myTables = useMemo(() => tables.filter(t => t.section === mySection), [tables, mySection]);

  const getTimeElapsed = (seatedAt) => {
    return formatTimeElapsed(seatedAt, currentTime);
  };

  const getOrderTotal = (tableId) => {
    const order = orders.find(o => o.tableId === tableId && o.status === 'active');
    if (!order) return 0;
    return order.items.reduce((sum, item) => sum + item.price, 0);
  };

  const handleSeatTable = () => {
    if (selectedTable && currentUser) {
      seatTable(selectedTable.id, guestCount, currentUser.id);
      success(`Table ${selectedTable.number} seated with ${guestCount} guests`);
      setShowSeatModal(false);
      setSelectedTable(null);
    }
  };

  const handleBillOut = (tableId) => {
    navigate(`/server/billout/${tableId}`);
  };

  const handleOpenOrder = (table) => {
    if (!currentUser) return;
    setSelectedTable(table);
    let order = getOrderByTable(table.id);
    if (!order) {
      order = createOrder(table.id, currentUser.id, table.guestCount);
    }
    // Always get the latest order from context to ensure we have the most up-to-date data
    const latestOrder = orders.find(o => o.id === order.id) || order;
    setCurrentOrder(latestOrder);
    setSelectedGuest(1); // Reset to first guest
    setOrderViewMode('menu'); // Reset to menu view
    setShowOrderModal(true);
  };

  // Sync currentOrder with orders from context when orders change
  useEffect(() => {
    if (currentOrder && showOrderModal) {
      const updatedOrder = orders.find(o => o.id === currentOrder.id);
      if (updatedOrder && JSON.stringify(updatedOrder) !== JSON.stringify(currentOrder)) {
        setCurrentOrder(updatedOrder);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, showOrderModal]);

  const handleAddItem = (menuItem) => {
    if (!currentOrder) return;
    // Show customization modal
    setSelectedMenuItem(menuItem);
    setCustomizations('');
    setCustomNotes('');
    setShowCustomizationModal(true);
  };

  const handleConfirmAddItem = () => {
    if (!currentOrder || !selectedMenuItem) return;

    const orderItem = {
      id: `oi-${Date.now()}-${Math.random()}`,
      menuItemId: selectedMenuItem.id,
      name: selectedMenuItem.name,
      guestNumber: selectedGuest,
      modifications: customizations,
      notes: customNotes,
      price: selectedMenuItem.price,
      sentToKitchen: false
    };

    addItemToOrder(currentOrder.id, orderItem);
    // Update local state to reflect the change immediately
    setCurrentOrder({
      ...currentOrder,
      items: [...currentOrder.items, orderItem]
    });
    
    // Close modal
    setShowCustomizationModal(false);
    setSelectedMenuItem(null);
    setCustomizations('');
    setCustomNotes('');
  };

  const handleRemoveItem = (itemId) => {
    if (!currentOrder) return;
    
    const item = currentOrder.items.find(i => i.id === itemId);
    removeItemFromOrder(currentOrder.id, itemId);
    if (item) {
      success(`Removed ${item.name} from order`);
    }
    
    // Update local state
    const updatedItems = currentOrder.items.filter(item => item.id !== itemId);
    setCurrentOrder({
      ...currentOrder,
      items: updatedItems
    });
  };

  const handleSendToKitchen = () => {
    if (!currentOrder || !selectedTable) return;
    
    const itemsToSend = currentOrder.items.filter(item => !item.sentToKitchen && menuItems.find(m => m.id === item.menuItemId)?.category !== 'drinks');
    
    if (itemsToSend.length > 0) {
      sendToKitchen(
        currentOrder.id,
        itemsToSend,
        selectedTable.number,
        currentUser?.displayName || 'Server'
      );
      success(`Sent ${itemsToSend.length} item(s) to kitchen`);
      
      // Mark items as sent
      setCurrentOrder({
        ...currentOrder,
        items: currentOrder.items.map(item => 
          itemsToSend.some(sent => sent.id === item.id) 
            ? { ...item, sentToKitchen: true }
            : item
        )
      });
    }
  };

  const categories = menuItems && menuItems.length > 0 
    ? ['all', ...new Set(menuItems.map(item => item.category).filter(Boolean))]
    : ['all'];
  const filteredMenuItems = menuItems && menuItems.length > 0
    ? (selectedCategory === 'all' 
        ? menuItems.filter(item => item.available && item.onMenu)
        : menuItems.filter(item => item.category === selectedCategory && item.available && item.onMenu))
    : [];

  const getCurrentOrderTotal = () => {
    if (!currentOrder) return 0;
    return currentOrder.items.reduce((sum, item) => sum + item.price, 0);
  };

  const getItemsByGuest = (guestNum) => {
    if (!currentOrder) return [];
    return currentOrder.items.filter(item => item.guestNumber === guestNum);
  };

  const getStatusBadge = (table) => {
    switch (table.status) {
      case 'available':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">Available</span>;
      case 'occupied':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Occupied</span>;
      case 'reserved':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Reserved</span>;
      default:
        return null;
    }
  };

  // Safety check - don't render if essential data is missing
  if (!tables || !menuItems) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Tables</h1>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Tables</h1>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myTables.map(table => (
          <div
            key={table.id}
            className={`bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border-2 ${
              table.status === 'available'
                ? 'border-green-200 dark:border-green-800'
                : table.status === 'occupied'
                ? 'border-blue-200 dark:border-blue-800'
                : 'border-gray-200 dark:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Table {table.number}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{table.seats} seats</p>
              </div>
              {getStatusBadge(table)}
            </div>

            {table.status === 'occupied' && (
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Guests</span>
                  <span className="text-gray-900 dark:text-white">{table.guestCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Time</span>
                  <span className="text-gray-900 dark:text-white">{getTimeElapsed(table.seatedAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Order Total</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${getOrderTotal(table.id).toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {table.status === 'available' && (
                <button
                  onClick={() => {
                    setSelectedTable(table);
                    setShowSeatModal(true);
                  }}
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Seat
                </button>
              )}
              {table.status === 'occupied' && (() => {
                // Check if food is ready to be run
                const readyChit = chits.find(c => c.tableNumber === table.number && c.status === 'ready' && !c.run);
                const hasReadyFood = !!readyChit;
                
                return (
                  <>
                    {hasReadyFood ? (
                      <button 
                        onClick={() => {
                          if (readyChit) {
                            markChitAsRun(readyChit.id);
                          }
                        }}
                        className="flex-1 py-2 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={16} />
                        Run Food
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleOpenOrder(table)}
                        className="flex-1 py-2 px-4 bg-server-primary text-white rounded-lg hover:bg-server-primary/90 transition-colors"
                      >
                        Order
                      </button>
                    )}
                    <button
                      onClick={() => handleBillOut(table.id)}
                      className="flex-1 py-2 px-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      Bill Out
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        ))}
      </div>

      {/* Seat Table Modal */}
      {showSeatModal && selectedTable && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Seat Table {selectedTable.number}
              </h2>
              <button
                onClick={() => {
                  setShowSeatModal(false);
                  setSelectedTable(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Number of Guests
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <button
                    key={num}
                    onClick={() => setGuestCount(num)}
                    className={`p-3 rounded-lg font-medium transition-colors ${
                      guestCount === num
                        ? 'bg-server-primary text-white'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSeatModal(false);
                  setSelectedTable(null);
                }}
                className="flex-1 py-2 px-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSeatTable}
                className="flex-1 py-2 px-4 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Users size={18} />
                Seat {guestCount}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && selectedTable && currentOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-6xl max-h-[90vh] shadow-xl flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Table {selectedTable.number} - Order</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedTable.guestCount} guests</p>
                </div>
                <button
                  onClick={() => {
                    setShowOrderModal(false);
                    setSelectedTable(null);
                    setCurrentOrder(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Quick Actions</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      const action = { type: 'napkins', label: 'Napkins', timestamp: Date.now() };
                      setQuickActions(prev => [...prev, action]);
                      // In real app, this would send a notification or add to a requests list
                      setTimeout(() => {
                        setQuickActions(prev => prev.filter(a => a.timestamp !== action.timestamp));
                      }, 2000);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
                  >
                    <Square size={16} />
                    Napkins
                  </button>
                  <button
                    onClick={() => {
                      const action = { type: 'cutlery', label: 'Cutlery', timestamp: Date.now() };
                      setQuickActions(prev => [...prev, action]);
                      setTimeout(() => {
                        setQuickActions(prev => prev.filter(a => a.timestamp !== action.timestamp));
                      }, 2000);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
                  >
                    <Utensils size={16} />
                    Cutlery
                  </button>
                  <button
                    onClick={() => {
                      const action = { type: 'water', label: 'More Water', timestamp: Date.now() };
                      setQuickActions(prev => [...prev, action]);
                      setTimeout(() => {
                        setQuickActions(prev => prev.filter(a => a.timestamp !== action.timestamp));
                      }, 2000);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
                  >
                    <Droplet size={16} />
                    More Water
                  </button>
                  <button
                    onClick={() => {
                      const action = { type: 'condiments', label: 'Condiments', timestamp: Date.now() };
                      setQuickActions(prev => [...prev, action]);
                      setTimeout(() => {
                        setQuickActions(prev => prev.filter(a => a.timestamp !== action.timestamp));
                      }, 2000);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
                  >
                    <FlaskConical size={16} />
                    Condiments
                  </button>
                  <button
                    onClick={() => {
                      const action = { type: 'drinks', label: 'More Drinks', timestamp: Date.now() };
                      setQuickActions(prev => [...prev, action]);
                      setTimeout(() => {
                        setQuickActions(prev => prev.filter(a => a.timestamp !== action.timestamp));
                      }, 2000);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
                  >
                    <Coffee size={16} />
                    More Drinks
                  </button>
                </div>
                {quickActions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {quickActions.map((action) => (
                      <div
                        key={action.timestamp}
                        className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-xs font-medium animate-pulse"
                      >
                        {getQuickActionIcon(action.type)}
                        {action.label} requested
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex">
              {/* Menu Side */}
              <div className="w-2/3 border-r border-gray-200 dark:border-slate-700 flex flex-col">
                {/* View Mode Toggle */}
                <div className="p-3 border-b border-gray-200 dark:border-slate-700">
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => setOrderViewMode('menu')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        orderViewMode === 'menu'
                          ? 'bg-server-primary text-white'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      Menu
                    </button>
                    <button
                      onClick={() => setOrderViewMode('ordered')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        orderViewMode === 'ordered'
                          ? 'bg-server-primary text-white'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      Ordered Items
                    </button>
                  </div>
                </div>

                {/* Guest Selector Tabs */}
                {orderViewMode === 'menu' && (
                  <div className="p-3 border-b border-gray-200 dark:border-slate-700 overflow-x-auto">
                    <div className="flex gap-2 mb-3">
                      {Array.from({ length: selectedTable.guestCount }, (_, i) => i + 1).map(guestNum => {
                        const guestItems = getItemsByGuest(guestNum);
                        return (
                          <button
                            key={guestNum}
                            onClick={() => setSelectedGuest(guestNum)}
                            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors relative ${
                              selectedGuest === guestNum
                                ? 'bg-server-primary text-white'
                                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600'
                            }`}
                          >
                            Guest {guestNum}
                            {guestItems.length > 0 && (
                              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                                selectedGuest === guestNum
                                  ? 'bg-white text-server-primary'
                                  : 'bg-server-primary text-white'
                              }`}>
                                {guestItems.length}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {orderViewMode === 'menu' ? (
                  <>
                    {/* Category Filter */}
                    <div className="p-3 border-b border-gray-200 dark:border-slate-700 overflow-x-auto">
                      <div className="flex gap-2">
                        {categories.map(cat => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors text-sm ${
                              selectedCategory === cat
                                ? 'bg-gray-700 dark:bg-gray-600 text-white'
                                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600'
                            }`}
                          >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="grid grid-cols-2 gap-3">
                        {filteredMenuItems.map(item => (
                          <button
                            key={item.id}
                            onClick={() => handleAddItem(item)}
                            className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors text-left"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
                              </div>
                              <span className="font-bold text-server-primary ml-2">${item.price.toFixed(2)}</span>
                            </div>
                            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-slate-600">
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                Tap to add to Guest {selectedGuest}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Ordered Items by Category */
                  <div className="flex-1 overflow-y-auto p-4">
                    {currentOrder && currentOrder.items.length > 0 ? (
                      <div className="space-y-6">
                        {['drinks', 'sides', 'appetizers', 'mains', 'desserts'].map(category => {
                          const categoryItems = currentOrder.items.filter(item => {
                            const menuItem = menuItems.find(m => m.id === item.menuItemId);
                            return menuItem?.category === category;
                          });
                          
                          if (categoryItems.length === 0) return null;

                          const categoryLabels = {
                            drinks: 'Drinks',
                            sides: 'Sides',
                            appetizers: 'Appetizers',
                            mains: 'Main Courses',
                            desserts: 'Desserts'
                          };

                          return (
                            <div key={category} className="border-b border-gray-200 dark:border-slate-700 pb-4 last:border-b-0">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {categoryLabels[category]}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                {category === 'drinks' ? 'Beverages and cocktails' : 
                                 category === 'sides' ? 'Side dishes and accompaniments' :
                                 category === 'appetizers' ? 'Starters and small plates' :
                                 category === 'mains' ? 'Main entrees' :
                                 'Sweet endings'}
                              </p>
                              <div className="space-y-2">
                                {categoryItems.map(item => {
                                  const menuItem = menuItems.find(m => m.id === item.menuItemId);
                                  const isDrink = menuItem?.category === 'drinks';
                                  
                                  return (
                                    <button
                                      key={item.id}
                                      onClick={() => {
                                        if (isDrink) {
                                          setSelectedRefillItem(item);
                                          setShowRefillModal(true);
                                        }
                                      }}
                                      className={`w-full text-left bg-gray-50 dark:bg-slate-700 rounded-lg p-3 transition-colors ${
                                        isDrink ? 'hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer' : ''
                                      }`}
                                      disabled={!isDrink}
                                    >
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-gray-900 dark:text-white">{item.name}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">Guest {item.guestNumber}</span>
                                            {isDrink && (
                                              <span className="text-xs text-blue-600 dark:text-blue-400">(Tap to refill)</span>
                                            )}
                                          </div>
                                          {item.modifications && (
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Mod: {item.modifications}</p>
                                          )}
                                          {item.notes && (
                                            <p className="text-xs text-orange-600 dark:text-orange-400">Note: {item.notes}</p>
                                          )}
                                        </div>
                                        <div className="text-right">
                                          <p className="font-semibold text-gray-900 dark:text-white">${item.price.toFixed(2)}</p>
                                          {item.sentToKitchen && (
                                            <span className="text-xs text-green-600 dark:text-green-400">Sent</span>
                                          )}
                                        </div>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 dark:text-gray-400">No items ordered yet</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Order Side */}
              <div className="w-1/3 flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Current Order</h3>
                  <div className="text-2xl font-bold text-server-primary">${getCurrentOrderTotal().toFixed(2)}</div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {Array.from({ length: selectedTable.guestCount }, (_, i) => i + 1).map(guestNum => {
                    const guestItems = getItemsByGuest(guestNum);
                    if (guestItems.length === 0) return null;
                    
                    return (
                      <div key={guestNum} className="mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Guest {guestNum}</h4>
                        <div className="space-y-2">
                          {guestItems.map(item => (
                            <div key={item.id} className="bg-gray-50 dark:bg-slate-700 rounded-lg p-2 flex justify-between items-start">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                                {item.modifications && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Mod: {item.modifications}</p>
                                )}
                                {item.notes && (
                                  <p className="text-xs text-orange-600 dark:text-orange-400">Note: {item.notes}</p>
                                )}
                                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">${item.price.toFixed(2)}</p>
                              </div>
                              {!item.sentToKitchen && (
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="text-red-500 hover:text-red-700 ml-2"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                              {item.sentToKitchen && (
                                <button
                                  onClick={() => {
                                    setSelectedSentItem(item);
                                    setShowSentItemModal(true);
                                  }}
                                  className="text-xs text-green-600 dark:text-green-400 ml-2 hover:underline"
                                  title="View sent item details"
                                >
                                  Sent
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {currentOrder.items.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">No items yet</p>
                  )}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-slate-700">
                  <button
                    onClick={handleSendToKitchen}
                    disabled={!currentOrder.items.some(item => !item.sentToKitchen && menuItems.find(m => m.id === item.menuItemId)?.category !== 'drinks')}
                    className="w-full py-3 px-4 bg-server-primary text-white rounded-xl font-medium hover:bg-server-primary/90 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    Send to Kitchen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customization Modal */}
      {showCustomizationModal && selectedMenuItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Customize {selectedMenuItem.name}
              </h2>
              <button
                onClick={() => {
                  setShowCustomizationModal(false);
                  setSelectedMenuItem(null);
                  setCustomizations('');
                  setCustomNotes('');
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Modifications / Customizations
                </label>
                <input
                  type="text"
                  value={customizations}
                  onChange={(e) => setCustomizations(e.target.value)}
                  placeholder="e.g., no onions, extra cheese, well done"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Notes
                </label>
                <textarea
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Additional notes for kitchen..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none"
                />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Adding to Guest {selectedGuest}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCustomizationModal(false);
                  setSelectedMenuItem(null);
                  setCustomizations('');
                  setCustomNotes('');
                }}
                className="flex-1 py-2 px-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAddItem}
                className="flex-1 py-2 px-4 bg-server-primary text-white rounded-xl hover:bg-server-primary/90 flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Add to Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sent Item Details Modal */}
      {showSentItemModal && selectedSentItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Item Details - {selectedSentItem.name}
              </h2>
              <button
                onClick={() => {
                  setShowSentItemModal(false);
                  setSelectedSentItem(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Guest</p>
                <p className="text-lg text-gray-900 dark:text-white">Guest {selectedSentItem.guestNumber}</p>
              </div>
              {selectedSentItem.modifications && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Modifications</p>
                  <p className="text-gray-900 dark:text-white">{selectedSentItem.modifications}</p>
                </div>
              )}
              {selectedSentItem.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                  <p className="text-gray-900 dark:text-white">{selectedSentItem.notes}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Price</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">${selectedSentItem.price.toFixed(2)}</p>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This item has been sent to the kitchen and cannot be modified.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowSentItemModal(false);
                setSelectedSentItem(null);
              }}
              className="w-full py-2 px-4 bg-server-primary text-white rounded-xl hover:bg-server-primary/90"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Refill Modal */}
      {showRefillModal && selectedRefillItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Refill {selectedRefillItem.name}
              </h2>
              <button
                onClick={() => {
                  setShowRefillModal(false);
                  setSelectedRefillItem(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Original Order</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">${selectedRefillItem.price.toFixed(2)}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Guest {selectedRefillItem.guestNumber}
                  {selectedRefillItem.modifications && (
                    <span className="ml-2">• {selectedRefillItem.modifications}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Refill Options
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      // Add refill with same specifications
                      const menuItem = menuItems.find(m => m.id === selectedRefillItem.menuItemId);
                      if (menuItem && currentOrder) {
                        const refillItem = {
                          id: `oi-${Date.now()}-${Math.random()}`,
                          menuItemId: menuItem.id,
                          name: menuItem.name,
                          guestNumber: selectedRefillItem.guestNumber,
                          modifications: selectedRefillItem.modifications,
                          notes: selectedRefillItem.notes || 'Refill',
                          price: menuItem.price,
                          sentToKitchen: false
                        };
                        addItemToOrder(currentOrder.id, refillItem);
                        setCurrentOrder({
                          ...currentOrder,
                          items: [...currentOrder.items, refillItem]
                        });
                        setShowRefillModal(false);
                        setSelectedRefillItem(null);
                      }
                    }}
                    className="w-full py-3 px-4 bg-server-primary text-white rounded-lg hover:bg-server-primary/90 transition-colors text-left"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Same as Original</p>
                        <p className="text-sm opacity-90">
                          {selectedRefillItem.modifications || 'No modifications'}
                        </p>
                      </div>
                      <span className="font-bold">${selectedRefillItem.price.toFixed(2)}</span>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      // Open customization modal for refill
                      const menuItem = menuItems.find(m => m.id === selectedRefillItem.menuItemId);
                      if (menuItem) {
                        setSelectedMenuItem(menuItem);
                        setSelectedGuest(selectedRefillItem.guestNumber);
                        setCustomizations('');
                        setCustomNotes('Refill');
                        setShowRefillModal(false);
                        setSelectedRefillItem(null);
                        setShowCustomizationModal(true);
                      }
                    }}
                    className="w-full py-3 px-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-left"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Customize Refill</p>
                        <p className="text-sm opacity-75">Add modifications or notes</p>
                      </div>
                      <span className="font-bold">${selectedRefillItem.price.toFixed(2)}</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRefillModal(false);
                  setSelectedRefillItem(null);
                }}
                className="flex-1 py-2 px-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServerTables;