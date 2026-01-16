import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  X, Users, Plus, Send, Trash2, CheckCircle, 
  Droplet, Utensils, Coffee, Square, FlaskConical,
  Clock, DollarSign, ChevronRight, Minus, Edit2, Check
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { TableSkeleton } from '../../components/SkeletonLoader';
import { formatTimeElapsed } from '../../utils/timeFormat';

function ServerTables() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { success, error: showError } = useToast();
  const { 
    tables = [], orders = [], menuItems = [], chits = [], staff = [], 
    seatTable, getOrderByTable, createOrder, addItemToOrder, 
    removeItemFromOrder, sendToKitchen, markChitAsRun 
  } = useData();
  
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
  const [orderViewMode, setOrderViewMode] = useState('menu');
  const [selectedModifiers, setSelectedModifiers] = useState({});
  const [showSendConfirmModal, setShowSendConfirmModal] = useState(false);
  const [itemsToSend, setItemsToSend] = useState([]);
  const [editingOrderItem, setEditingOrderItem] = useState(null);

  // Update timer
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Get server's section
  const mySection = useMemo(() => {
    const serverStaff = staff.find(s => s.id === currentUser?.id);
    return serverStaff?.section || 'A';
  }, [staff, currentUser?.id]);

  const myTables = useMemo(() => tables.filter(t => t.section === mySection), [tables, mySection]);

  const getTimeElapsed = (seatedAt) => formatTimeElapsed(seatedAt, currentTime);

  const getOrderTotal = (tableId) => {
    const order = orders.find(o => o.tableId === tableId && o.status === 'active');
    if (!order || !order.items) return 0;
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

  const handleBillOut = (tableId) => navigate(`/server/billout/${tableId}`);

  const handleOpenOrder = (table) => {
    if (!currentUser) return;
    setSelectedTable(table);
    let order = getOrderByTable(table.id);
    if (!order) {
      order = createOrder(table.id, currentUser.id, table.guestCount);
    }
    const latestOrder = orders.find(o => o.id === order.id) || order;
    setCurrentOrder(latestOrder);
    setSelectedGuest(1);
    setOrderViewMode('menu');
    setShowOrderModal(true);
  };

  // Sync currentOrder with context
  useEffect(() => {
    if (currentOrder && showOrderModal) {
      const updatedOrder = orders.find(o => o.id === currentOrder.id);
      if (updatedOrder && JSON.stringify(updatedOrder) !== JSON.stringify(currentOrder)) {
        setCurrentOrder(updatedOrder);
      }
    }
  }, [orders, showOrderModal, currentOrder]);

  const handleAddItem = (menuItem) => {
    if (!currentOrder) return;
    setSelectedMenuItem(menuItem);
    setCustomizations('');
    setCustomNotes('');
    // Initialize modifiers state
    const initialMods = {};
    (menuItem.modifiers || []).forEach(mod => {
      initialMods[mod.name] = null;
    });
    setSelectedModifiers(initialMods);
    setShowCustomizationModal(true);
  };

  // Check if all required modifiers are selected
  const canAddItem = () => {
    if (!selectedMenuItem) return false;
    const requiredMods = (selectedMenuItem.modifiers || []).filter(m => m.required);
    return requiredMods.every(mod => selectedModifiers[mod.name] !== null);
  };

  // Calculate modifier price additions
  const getModifierPrice = () => {
    if (!selectedMenuItem) return 0;
    let extra = 0;
    (selectedMenuItem.modifiers || []).forEach(mod => {
      const selected = selectedModifiers[mod.name];
      if (selected) {
        const option = mod.options.find(o => o.name === selected);
        if (option) extra += option.price;
      }
    });
    return extra;
  };

  const handleConfirmAddItem = () => {
    if (!currentOrder || !selectedMenuItem || !canAddItem()) return;
    
    // Build modifications string from selected modifiers
    const modStrings = [];
    (selectedMenuItem.modifiers || []).forEach(mod => {
      const selected = selectedModifiers[mod.name];
      if (selected && selected !== 'No Sauce' && selected !== 'No Side' && selected !== 'No Protein') {
        modStrings.push(selected);
      }
    });
    if (customizations) modStrings.push(customizations);
    
    const totalPrice = selectedMenuItem.price + getModifierPrice();
    
    const orderItem = {
      id: `oi-${Date.now()}-${Math.random()}`,
      menuItemId: selectedMenuItem.id,
      name: selectedMenuItem.name,
      guestNumber: selectedGuest,
      modifications: modStrings.join(', '),
      modifiers: { ...selectedModifiers },
      notes: customNotes,
      price: totalPrice,
      sentToKitchen: false
    };
    addItemToOrder(currentOrder.id, orderItem);
    setCurrentOrder({ ...currentOrder, items: [...(currentOrder.items || []), orderItem] });
    setShowCustomizationModal(false);
    setSelectedMenuItem(null);
    setCustomizations('');
    setCustomNotes('');
    setSelectedModifiers({});
  };

  const handleRemoveItem = (itemId) => {
    if (!currentOrder || !currentOrder.items) return;
    const item = currentOrder.items.find(i => i.id === itemId);
    removeItemFromOrder(currentOrder.id, itemId);
    if (item) success(`Removed ${item.name}`);
    setCurrentOrder({ ...currentOrder, items: currentOrder.items.filter(i => i.id !== itemId) });
  };

  const handleOpenSendConfirm = () => {
    if (!currentOrder || !selectedTable || !currentOrder.items) return;
    const items = currentOrder.items.filter(item => 
      !item.sentToKitchen && menuItems.find(m => m.id === item.menuItemId)?.category !== 'drinks'
    );
    if (items.length > 0) {
      setItemsToSend(items);
      setShowSendConfirmModal(true);
    }
  };

  const handleConfirmSendToKitchen = () => {
    if (!currentOrder || !selectedTable || itemsToSend.length === 0) return;
    sendToKitchen(currentOrder.id, itemsToSend, selectedTable.number, currentUser?.displayName || 'Server');
    success(`Sent ${itemsToSend.length} item(s) to kitchen`);
    setCurrentOrder({
      ...currentOrder,
      items: (currentOrder.items || []).map(item => 
        itemsToSend.some(sent => sent.id === item.id) ? { ...item, sentToKitchen: true } : item
      )
    });
    setShowSendConfirmModal(false);
    setItemsToSend([]);
  };

  const handleEditItemFromConfirm = (item) => {
    const menuItem = menuItems.find(m => m.id === item.menuItemId);
    if (!menuItem) return;
    setEditingOrderItem(item);
    setSelectedMenuItem(menuItem);
    // Restore modifiers from item
    setSelectedModifiers(item.modifiers || {});
    setCustomizations(item.modifications?.split(', ').filter(m => {
      // Filter out modifier selections to get only custom text
      const modOptions = (menuItem.modifiers || []).flatMap(mod => mod.options.map(o => o.name));
      return !modOptions.includes(m);
    }).join(', ') || '');
    setCustomNotes(item.notes || '');
    setShowSendConfirmModal(false);
    setShowCustomizationModal(true);
  };

  const handleUpdateItem = () => {
    if (!currentOrder || !selectedMenuItem || !editingOrderItem || !canAddItem()) return;
    
    const modStrings = [];
    (selectedMenuItem.modifiers || []).forEach(mod => {
      const selected = selectedModifiers[mod.name];
      if (selected && selected !== 'No Sauce' && selected !== 'No Side' && selected !== 'No Protein') {
        modStrings.push(selected);
      }
    });
    if (customizations) modStrings.push(customizations);
    
    const totalPrice = selectedMenuItem.price + getModifierPrice();
    
    const updatedItem = {
      ...editingOrderItem,
      modifications: modStrings.join(', '),
      modifiers: { ...selectedModifiers },
      notes: customNotes,
      price: totalPrice,
    };
    
    const updatedItems = (currentOrder.items || []).map(item => 
      item.id === editingOrderItem.id ? updatedItem : item
    );
    
    setCurrentOrder({ ...currentOrder, items: updatedItems });
    // Also update in context
    const updatedOrder = { ...currentOrder, items: updatedItems };
    // Re-open send confirm with updated items
    const items = updatedItems.filter(item => 
      !item.sentToKitchen && menuItems.find(m => m.id === item.menuItemId)?.category !== 'drinks'
    );
    
    setShowCustomizationModal(false);
    setSelectedMenuItem(null);
    setEditingOrderItem(null);
    setCustomizations('');
    setCustomNotes('');
    setSelectedModifiers({});
    
    if (items.length > 0) {
      setItemsToSend(items);
      setShowSendConfirmModal(true);
    }
  };

  const categories = menuItems?.length > 0 
    ? ['all', ...new Set(menuItems.map(item => item.category).filter(Boolean))]
    : ['all'];
  
  const filteredMenuItems = menuItems?.length > 0
    ? (selectedCategory === 'all' 
        ? menuItems.filter(item => item.available && item.onMenu)
        : menuItems.filter(item => item.category === selectedCategory && item.available && item.onMenu))
    : [];

  const getCurrentOrderTotal = () => currentOrder?.items.reduce((sum, item) => sum + item.price, 0) || 0;
  const getItemsByGuest = (guestNum) => currentOrder?.items.filter(item => item.guestNumber === guestNum) || [];

  if (!tables || !menuItems) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">My Tables</h1>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 md:pb-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Tables</h1>
          <p className="text-muted-foreground text-sm">Section {mySection}</p>
        </div>
        <Badge variant="secondary">{myTables.filter(t => t.status === 'occupied').length} active</Badge>
      </div>

      {/* Mobile-first Table Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {myTables.map(table => {
          const readyChit = chits.find(c => c.tableNumber === table.number && c.status === 'ready' && !c.run);
          const hasReadyFood = !!readyChit;

          return (
            <Card 
              key={table.id}
              className={`overflow-hidden transition-all ${
                table.status === 'available' ? 'border-emerald-500/30 dark:border-emerald-500/30' :
                table.status === 'occupied' ? 'border-primary/30' : 'border-border'
              } ${hasReadyFood ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-background' : ''}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Table {table.number}</CardTitle>
                  <Badge 
                    variant={
                      table.status === 'available' ? 'success' : 
                      table.status === 'occupied' ? 'default' : 'secondary'
                    }
                  >
                    {table.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{table.seats} seats</p>
              </CardHeader>

              <CardContent className="space-y-4">
                {table.status === 'occupied' && (
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-muted rounded-lg p-2">
                      <Users className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-sm font-medium">{table.guestCount}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-2">
                      <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-sm font-medium">{getTimeElapsed(table.seatedAt) || '0s ago'}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-2">
                      <DollarSign className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-sm font-medium">${getOrderTotal(table.id).toFixed(0)}</p>
                    </div>
                  </div>
                )}

                {/* Actions - Large touch targets for mobile */}
                <div className="flex gap-2">
                  {table.status === 'available' && (
                    <Button
                      onClick={() => { setSelectedTable(table); setShowSeatModal(true); }}
                      className="flex-1 h-12 text-base bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Seat
                    </Button>
                  )}
                  {table.status === 'occupied' && (
                    <>
                      {hasReadyFood ? (
                        <Button 
                          onClick={() => readyChit && markChitAsRun(readyChit.id)}
                          className="flex-1 h-12 text-base bg-amber-600 hover:bg-amber-700"
                        >
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Run Food
                        </Button>
                      ) : (
                        <Button 
                          variant="outline"
                          onClick={() => handleOpenOrder(table)}
                          className="flex-1 h-12 text-base border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          Order
                          <ChevronRight className="w-5 h-5 ml-1" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => handleBillOut(table.id)}
                        className="flex-1 h-12 text-base border-2"
                      >
                        Bill Out
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Seat Modal */}
      {showSeatModal && selectedTable && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4">
          <Card className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl max-h-[80vh] overflow-auto animate-slide-in">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Seat Table {selectedTable.number}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => { setShowSeatModal(false); setSelectedTable(null); }}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground mb-3">Number of Guests</p>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <button
                    key={num}
                    onClick={() => setGuestCount(num)}
                    className={`h-14 text-lg font-semibold rounded-lg transition-all ${
                      guestCount === num
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-400 shadow-lg'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => { setShowSeatModal(false); setSelectedTable(null); }} className="flex-1 h-12">
                  Cancel
                </Button>
                <Button onClick={handleSeatTable} className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700">
                  <Users className="w-5 h-5 mr-2" />
                  Seat {guestCount}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>,
        document.body
      )}

      {/* Order Modal - Full screen on mobile */}
      {showOrderModal && selectedTable && currentOrder && createPortal(
        <div className="fixed inset-0 bg-white dark:bg-slate-950 z-[100] flex flex-col">
          {/* Header */}
          <div className="border-b bg-card px-4 py-3 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-lg font-bold">Table {selectedTable.number}</h2>
              <p className="text-sm text-muted-foreground">{selectedTable.guestCount} guests · ${getCurrentOrderTotal().toFixed(2)}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => { setShowOrderModal(false); setSelectedTable(null); setCurrentOrder(null); }}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="border-b px-4 py-2 flex gap-2 overflow-x-auto shrink-0">
            {[
              { icon: Droplet, label: 'Water' },
              { icon: Square, label: 'Napkins' },
              { icon: Utensils, label: 'Cutlery' },
              { icon: FlaskConical, label: 'Condiments' },
            ].map(({ icon: Icon, label }) => (
              <Button key={label} variant="outline" size="sm" className="shrink-0">
                <Icon className="w-4 h-4 mr-1" />
                {label}
              </Button>
            ))}
          </div>

          {/* Guest Tabs */}
          <div className="border-b px-4 py-2 flex gap-2 overflow-x-auto shrink-0">
            {Array.from({ length: selectedTable.guestCount }, (_, i) => i + 1).map(guestNum => {
              const guestItems = getItemsByGuest(guestNum);
              const isSelected = selectedGuest === guestNum;
              return (
                <button
                  key={guestNum}
                  onClick={() => setSelectedGuest(guestNum)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-server-primary text-white ring-2 ring-server-primary ring-offset-2 ring-offset-background'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 border border-border'
                  }`}
                >
                  Guest {guestNum}
                  {guestItems.length > 0 && (
                    <span className={`ml-1 px-1.5 py-0.5 rounded text-xs font-semibold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                    }`}>
                      {guestItems.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Category Filter */}
          <div className="border-b px-4 py-2 flex gap-2 overflow-x-auto shrink-0 bg-muted/30">
            {categories.map(cat => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 capitalize px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Menu Items Grid or Order View */}
          <div className="flex-1 overflow-y-auto p-4">
            {orderViewMode === 'menu' ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredMenuItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleAddItem(item)}
                    className="bg-card border rounded-xl p-4 text-left hover:bg-accent transition-colors active:scale-[0.98]"
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-semibold text-sm leading-tight">{item.name}</h3>
                      <span className="font-bold text-primary shrink-0">${item.price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg mb-3">Current Order</h3>
                {!currentOrder.items || currentOrder.items.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No items in order yet</p>
                ) : (
                  currentOrder.items.map((item, idx) => {
                    const menuItem = menuItems.find(m => m.id === item.menuItemId);
                    return (
                      <div key={item.id || idx} className="bg-card border rounded-lg p-3 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-muted px-1.5 py-0.5 rounded">G{item.guestNumber}</span>
                            <span className="font-medium">{menuItem?.name || item.name}</span>
                          </div>
                          {item.modifications && (
                            <p className="text-xs text-muted-foreground mt-1">{item.modifications}</p>
                          )}
                          {item.sentToKitchen && (
                            <Badge variant="secondary" className="mt-1 text-xs">Sent to Kitchen</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">${item.price.toFixed(2)}</span>
                          {!item.sentToKitchen && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div className="border-t pt-3 mt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${(currentOrder.items || []).reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Bar */}
          <div className="border-t bg-card px-4 py-3 shrink-0 safe-area-pb">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setOrderViewMode(orderViewMode === 'menu' ? 'ordered' : 'menu')}
                className="flex-1 h-12"
              >
                {orderViewMode === 'menu' ? `View Order (${(currentOrder.items || []).length})` : 'Back to Menu'}
              </Button>
              <Button
                onClick={handleOpenSendConfirm}
                disabled={!(currentOrder.items || []).some(item => !item.sentToKitchen && menuItems.find(m => m.id === item.menuItemId)?.category !== 'drinks')}
                className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:bg-slate-600 disabled:text-slate-400"
              >
                <Send className="w-5 h-5 mr-2" />
                Send to Kitchen
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Customization Modal with Modifiers */}
      {showCustomizationModal && selectedMenuItem && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[110] p-0 sm:p-4">
          <Card className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl animate-slide-in max-h-[90vh] flex flex-col">
            <CardHeader className="border-b shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{editingOrderItem ? 'Edit' : ''} {selectedMenuItem.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {editingOrderItem ? `Guest ${editingOrderItem.guestNumber}` : `Adding to Guest ${selectedGuest}`} · ${(selectedMenuItem.price + getModifierPrice()).toFixed(2)}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => { setShowCustomizationModal(false); setSelectedMenuItem(null); setSelectedModifiers({}); setEditingOrderItem(null); }}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 overflow-y-auto flex-1">
              {/* Modifiers */}
              {(selectedMenuItem.modifiers || []).map(mod => (
                <div key={mod.name}>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    {mod.name}
                    {mod.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {mod.options.map(option => {
                      const isSelected = selectedModifiers[mod.name] === option.name;
                      return (
                        <button
                          key={option.name}
                          onClick={() => setSelectedModifiers(prev => ({ ...prev, [mod.name]: option.name }))}
                          className={`p-3 rounded-lg text-sm font-medium transition-all text-left ${
                            isSelected
                              ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background'
                              : 'bg-muted hover:bg-muted/80 border border-border'
                          }`}
                        >
                          <span>{option.name}</span>
                          {option.price > 0 && (
                            <span className="text-xs opacity-70 ml-1">+${option.price.toFixed(2)}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              
              {/* Additional modifications */}
              <div>
                <label className="text-sm font-medium mb-2 block">Additional Modifications</label>
                <Input
                  value={customizations}
                  onChange={(e) => setCustomizations(e.target.value)}
                  placeholder="e.g., no onions, extra cheese"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Notes</label>
                <Input
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Additional notes..."
                />
              </div>
            </CardContent>
            <div className="p-4 border-t shrink-0">
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => { setShowCustomizationModal(false); setSelectedMenuItem(null); setSelectedModifiers({}); setEditingOrderItem(null); }} className="flex-1 h-12">
                  Cancel
                </Button>
                <Button 
                  onClick={editingOrderItem ? handleUpdateItem : handleConfirmAddItem} 
                  disabled={!canAddItem()}
                  className="flex-1 h-12"
                >
                  {editingOrderItem ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Update
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Add ${(selectedMenuItem.price + getModifierPrice()).toFixed(2)}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>,
        document.body
      )}

      {/* Send to Kitchen Confirmation Modal */}
      {showSendConfirmModal && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[110] p-0 sm:p-4">
          <Card className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl animate-slide-in max-h-[90vh] flex flex-col">
            <CardHeader className="border-b shrink-0 bg-emerald-600 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Confirm Order</CardTitle>
                  <p className="text-sm text-white/80">Table {selectedTable?.number} · {itemsToSend.length} item(s)</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowSendConfirmModal(false)} className="text-white hover:bg-white/20">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 overflow-y-auto flex-1">
              <p className="text-sm text-muted-foreground">Review the order before sending to kitchen:</p>
              
              {/* Group items by guest */}
              {Array.from({ length: selectedTable?.guestCount || 1 }, (_, i) => i + 1).map(guestNum => {
                const guestItems = itemsToSend.filter(item => item.guestNumber === guestNum);
                if (guestItems.length === 0) return null;
                
                return (
                  <div key={guestNum} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <span className="bg-primary/20 text-primary px-2 py-0.5 rounded">Guest {guestNum}</span>
                      </h4>
                      <button
                        onClick={() => {
                          setSelectedGuest(guestNum);
                          setShowSendConfirmModal(false);
                          setOrderViewMode('menu');
                        }}
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add item
                      </button>
                    </div>
                    
                    {guestItems.map((item, idx) => (
                      <div key={idx} className="bg-muted/50 border rounded-lg p-3">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold">{item.name}</span>
                            {item.modifications && (
                              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 font-medium">→ {item.modifications}</p>
                            )}
                            {item.notes && (
                              <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">Note: {item.notes}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditItemFromConfirm(item)}
                              className="h-8 px-2 text-primary hover:text-primary"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                handleRemoveItem(item.id);
                                setItemsToSend(prev => prev.filter(i => i.id !== item.id));
                              }}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
              
              {itemsToSend.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No items to send</p>
              )}
            </CardContent>
            <div className="p-4 border-t shrink-0">
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowSendConfirmModal(false)} className="flex-1 h-12">
                  Go Back
                </Button>
                <Button 
                  onClick={handleConfirmSendToKitchen}
                  disabled={itemsToSend.length === 0}
                  className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send to Kitchen
                </Button>
              </div>
            </div>
          </Card>
        </div>,
        document.body
      )}
    </div>
  );
}

export default ServerTables;
