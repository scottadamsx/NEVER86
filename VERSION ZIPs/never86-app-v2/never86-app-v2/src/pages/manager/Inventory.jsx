import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Package, Plus, Search, AlertTriangle, X, Minus } from 'lucide-react';

function ManagerInventory() {
  const { inventory, getLowInventory, updateInventoryQuantity, adjustInventoryQuantity, addInventoryItem } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    unit: 'portions',
    minThreshold: '',
    category: 'protein'
  });

  const lowStock = getLowInventory();
  const categories = ['all', ...new Set(inventory.map(item => item.category))];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (item) => {
    if (item.quantity === 0) return { label: 'Out', color: 'bg-red-100 text-red-700' };
    if (item.quantity <= item.minThreshold) return { label: 'Low', color: 'bg-orange-100 text-orange-700' };
    return { label: 'Good', color: 'bg-green-100 text-green-700' };
  };

  const getStockPercentage = (item) => {
    const maxExpected = item.minThreshold * 3;
    return Math.min((item.quantity / maxExpected) * 100, 100);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    addInventoryItem({
      ...newItem,
      quantity: parseFloat(newItem.quantity),
      minThreshold: parseFloat(newItem.minThreshold)
    });
    setNewItem({
      name: '',
      quantity: '',
      unit: 'portions',
      minThreshold: '',
      category: 'protein'
    });
    setShowAddModal(false);
  };

  const handleAdjustQuantity = (itemId, adjustment) => {
    adjustInventoryQuantity(itemId, adjustment);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-brand-navy text-white px-4 py-2 rounded-xl hover:bg-brand-navy/90 transition-colors"
        >
          <Plus size={20} />
          Add Item
        </button>
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="text-orange-600" size={20} />
            <h2 className="font-semibold text-orange-800 dark:text-orange-200">Running Low ({lowStock.length})</h2>
          </div>
          <div className="space-y-2">
            {lowStock.map(item => (
              <div key={item.id} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 dark:text-gray-300 w-32">{item.name}</span>
                <div className="flex-1 bg-orange-200 dark:bg-orange-800 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${getStockPercentage(item)}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-24 text-right">
                  {item.quantity} {item.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-navy"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-navy"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Item</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Category</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Quantity</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {filteredInventory.map(item => {
              const status = getStockStatus(item);
              return (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Package className="text-gray-400" size={20} />
                      <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 capitalize">{item.category}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{item.quantity} {item.unit}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setShowEditModal(item)}
                      className="text-brand-navy dark:text-blue-400 hover:underline text-sm"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Inventory Item</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit</label>
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="portions">Portions</option>
                    <option value="lbs">Lbs</option>
                    <option value="units">Units</option>
                    <option value="bottles">Bottles</option>
                    <option value="quarts">Quarts</option>
                    <option value="liters">Liters</option>
                    <option value="heads">Heads</option>
                    <option value="slices">Slices</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min Threshold</label>
                <input
                  type="number"
                  step="0.1"
                  value={newItem.minThreshold}
                  onChange={(e) => setNewItem({ ...newItem, minThreshold: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="protein">Protein</option>
                  <option value="produce">Produce</option>
                  <option value="pantry">Pantry</option>
                  <option value="dairy">Dairy</option>
                  <option value="beverage">Beverage</option>
                  <option value="bakery">Bakery</option>
                  <option value="dessert">Dessert</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 px-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-brand-navy text-white rounded-xl hover:bg-brand-navy/90"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Stock Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Stock: {showEditModal.name}</h2>
              <button
                onClick={() => setShowEditModal(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Current Quantity</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {showEditModal.quantity} {showEditModal.unit}
                </p>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => handleAdjustQuantity(showEditModal.id, -1)}
                  className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  <Minus size={24} />
                </button>
                <button
                  onClick={() => handleAdjustQuantity(showEditModal.id, -5)}
                  className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  -5
                </button>
                <button
                  onClick={() => handleAdjustQuantity(showEditModal.id, -10)}
                  className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  -10
                </button>
                <div className="w-px h-8 bg-gray-300 dark:bg-slate-600"></div>
                <button
                  onClick={() => handleAdjustQuantity(showEditModal.id, 10)}
                  className="px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                >
                  +10
                </button>
                <button
                  onClick={() => handleAdjustQuantity(showEditModal.id, 5)}
                  className="px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                >
                  +5
                </button>
                <button
                  onClick={() => handleAdjustQuantity(showEditModal.id, 1)}
                  className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                >
                  <Plus size={24} />
                </button>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Set Exact Quantity</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    defaultValue={showEditModal.quantity}
                    onBlur={(e) => {
                      const newQty = parseFloat(e.target.value);
                      if (!isNaN(newQty) && newQty >= 0) {
                        updateInventoryQuantity(showEditModal.id, newQty);
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                  <span className="px-3 py-2 text-gray-500 dark:text-gray-400">{showEditModal.unit}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(null)}
                  className="flex-1 py-2 px-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagerInventory;