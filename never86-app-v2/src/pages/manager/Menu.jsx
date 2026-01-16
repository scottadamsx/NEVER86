import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Plus, UtensilsCrossed, X, Trash2, Edit2 } from 'lucide-react';
import { getFieldError } from '../../utils/validation';

function ManagerMenu() {
  const { menuItems, addMenuItem, updateMenuItem, toggleMenuItemAvailable } = useData();
  const { success, error: showError } = useToast();
  const [activeTab, setActiveTab] = useState('view');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [errors, setErrors] = useState({});
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'mains',
    prepTime: '',
    onMenu: true,
    modifiers: []
  });
  const [newModifier, setNewModifier] = useState({ name: '', required: false, options: [] });
  const [newOption, setNewOption] = useState({ name: '', price: '' });

  const categories = ['all', 'appetizers', 'mains', 'sides', 'desserts', 'drinks'];

  const filteredItems = categoryFilter === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === categoryFilter);

  const validateForm = () => {
    const newErrors = {};
    
    const nameError = getFieldError(newItem.name, [
      { required: true, requiredMessage: 'Item name is required' },
      { minLength: 2, minLengthMessage: 'Name must be at least 2 characters' }
    ]);
    if (nameError) newErrors.name = nameError;

    const priceError = getFieldError(newItem.price, [
      { required: true, requiredMessage: 'Price is required' },
      { positive: true, positiveMessage: 'Price must be greater than 0' }
    ]);
    if (priceError) newErrors.price = priceError;

    const prepTimeError = getFieldError(newItem.prepTime, [
      { required: true, requiredMessage: 'Prep time is required' },
      { positive: true, positiveMessage: 'Prep time must be greater than 0' },
      { max: 120, maxMessage: 'Prep time cannot exceed 120 minutes' }
    ]);
    if (prepTimeError) newErrors.prepTime = prepTimeError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateItem = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Please fix the errors in the form');
      return;
    }

    addMenuItem({
      ...newItem,
      price: parseFloat(newItem.price),
      prepTime: parseInt(newItem.prepTime),
      available: true,
      modifiers: newItem.modifiers || []
    });
    
    success('Menu item created successfully');
    setNewItem({
      name: '',
      description: '',
      price: '',
      category: 'mains',
      prepTime: '',
      onMenu: true,
      modifiers: []
    });
    setErrors({});
    setShowCreateModal(false);
  };

  const handleEditItem = (item) => {
    setEditingItem({ ...item, modifiers: item.modifiers || [] });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    updateMenuItem(editingItem.id, editingItem);
    success('Menu item updated');
    setShowEditModal(false);
    setEditingItem(null);
  };

  const addModifierToItem = (itemSetter, item) => {
    if (!newModifier.name || newModifier.options.length === 0) {
      showError('Modifier needs a name and at least one option');
      return;
    }
    itemSetter({ ...item, modifiers: [...(item.modifiers || []), { ...newModifier }] });
    setNewModifier({ name: '', required: false, options: [] });
  };

  const removeModifierFromItem = (itemSetter, item, modIndex) => {
    const updated = [...(item.modifiers || [])];
    updated.splice(modIndex, 1);
    itemSetter({ ...item, modifiers: updated });
  };

  const addOptionToModifier = () => {
    if (!newOption.name) return;
    setNewModifier({
      ...newModifier,
      options: [...newModifier.options, { name: newOption.name, price: parseFloat(newOption.price) || 0 }]
    });
    setNewOption({ name: '', price: '' });
  };

  const removeOptionFromModifier = (optIndex) => {
    const updated = [...newModifier.options];
    updated.splice(optIndex, 1);
    setNewModifier({ ...newModifier, options: updated });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Menu Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-brand-navy text-white px-4 py-2 rounded-xl hover:bg-brand-navy/90 transition-colors"
        >
          <Plus size={20} />
          Create Item
        </button>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => setShowCreateModal(true)}
          className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <Plus className="text-brand-navy dark:text-blue-400 mb-2" size={24} />
          <h3 className="font-semibold text-gray-900 dark:text-white">Create Item</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Add new menu item</p>
        </button>
        <button
          onClick={() => setActiveTab('view')}
          className={`p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left ${
            activeTab === 'view' ? 'bg-brand-navy text-white' : 'bg-white dark:bg-slate-800'
          }`}
        >
          <UtensilsCrossed className={activeTab === 'view' ? 'text-white mb-2' : 'text-brand-navy dark:text-blue-400 mb-2'} size={24} />
          <h3 className={`font-semibold ${activeTab === 'view' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>View All</h3>
          <p className={`text-sm ${activeTab === 'view' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>See all items</p>
        </button>
        <button
          onClick={() => setActiveTab('edit')}
          className={`p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left ${
            activeTab === 'edit' ? 'bg-brand-navy text-white' : 'bg-white dark:bg-slate-800'
          }`}
        >
          <UtensilsCrossed className={activeTab === 'edit' ? 'text-white mb-2' : 'text-brand-navy dark:text-blue-400 mb-2'} size={24} />
          <h3 className={`font-semibold ${activeTab === 'edit' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Edit Menu</h3>
          <p className={`text-sm ${activeTab === 'edit' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>Modify availability</p>
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              categoryFilter === cat
                ? 'bg-brand-navy text-white'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
              <span className="text-lg font-bold text-brand-navy dark:text-blue-400">${item.price.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{item.description}</p>
            {/* Show modifiers */}
            {item.modifiers && item.modifiers.length > 0 && (
              <div className="mb-3 space-y-1">
                {item.modifiers.map((mod, idx) => (
                  <div key={idx} className="text-xs">
                    <span className={`font-medium ${mod.required ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {mod.name}{mod.required ? '*' : ''}:
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                      {mod.options.map(o => o.name).join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between items-center">
              <div className="flex gap-2 flex-wrap">
                {item.onMenu ? (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">On Menu</span>
                ) : (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Off Menu</span>
                )}
                {!item.available && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">86'd</span>
                )}
                {item.modifiers && item.modifiers.some(m => m.required) && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Has Mods</span>
                )}
              </div>
              {activeTab === 'edit' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                  >
                    <Edit2 size={12} className="inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => toggleMenuItemAvailable(item.id)}
                    className={`text-xs px-2 py-1 rounded ${
                      item.available
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {item.available ? '86 It' : 'Restore'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Item Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Menu Item</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4">
              <div>
                <label htmlFor="item-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  id="item-name"
                  type="text"
                  value={newItem.name}
                  onChange={(e) => {
                    setNewItem({ ...newItem, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    errors.name ? 'border-red-500' : 'border-gray-200 dark:border-slate-600'
                  } bg-white dark:bg-slate-700 text-gray-900 dark:text-white`}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  required
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="item-price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price ($) *
                  </label>
                  <input
                    id="item-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newItem.price}
                    onChange={(e) => {
                      setNewItem({ ...newItem, price: e.target.value });
                      if (errors.price) setErrors({ ...errors, price: null });
                    }}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      errors.price ? 'border-red-500' : 'border-gray-200 dark:border-slate-600'
                    } bg-white dark:bg-slate-700 text-gray-900 dark:text-white`}
                    aria-invalid={!!errors.price}
                    aria-describedby={errors.price ? 'price-error' : undefined}
                    required
                  />
                  {errors.price && (
                    <p id="price-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                      {errors.price}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="item-prep-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Prep Time (min) *
                  </label>
                  <input
                    id="item-prep-time"
                    type="number"
                    min="1"
                    max="120"
                    value={newItem.prepTime}
                    onChange={(e) => {
                      setNewItem({ ...newItem, prepTime: e.target.value });
                      if (errors.prepTime) setErrors({ ...errors, prepTime: null });
                    }}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      errors.prepTime ? 'border-red-500' : 'border-gray-200 dark:border-slate-600'
                    } bg-white dark:bg-slate-700 text-gray-900 dark:text-white`}
                    aria-invalid={!!errors.prepTime}
                    aria-describedby={errors.prepTime ? 'prep-time-error' : undefined}
                    required
                  />
                  {errors.prepTime && (
                    <p id="prep-time-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                      {errors.prepTime}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="item-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  id="item-category"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  aria-label="Select menu item category"
                >
                  <option value="appetizers">Appetizers</option>
                  <option value="mains">Mains</option>
                  <option value="sides">Sides</option>
                  <option value="desserts">Desserts</option>
                  <option value="drinks">Drinks</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="onMenu"
                  checked={newItem.onMenu}
                  onChange={(e) => setNewItem({ ...newItem, onMenu: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <label htmlFor="onMenu" className="text-sm text-gray-700 dark:text-gray-300">Add to menu immediately</label>
              </div>

              {/* Modifiers Section */}
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Modifiers</h3>
                
                {/* Existing modifiers */}
                {newItem.modifiers && newItem.modifiers.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {newItem.modifiers.map((mod, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg flex justify-between items-start">
                        <div>
                          <span className="font-medium text-sm">{mod.name}</span>
                          {mod.required && <span className="text-red-500 text-xs ml-1">(Required)</span>}
                          <p className="text-xs text-gray-500">{mod.options.map(o => `${o.name}${o.price > 0 ? ` +$${o.price}` : ''}`).join(', ')}</p>
                        </div>
                        <button type="button" onClick={() => removeModifierFromItem(setNewItem, newItem, idx)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new modifier */}
                <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Modifier name (e.g., Temperature)"
                      value={newModifier.name}
                      onChange={(e) => setNewModifier({ ...newModifier, name: e.target.value })}
                      className="flex-1 px-2 py-1 text-sm rounded border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800"
                    />
                    <label className="flex items-center gap-1 text-xs">
                      <input
                        type="checkbox"
                        checked={newModifier.required}
                        onChange={(e) => setNewModifier({ ...newModifier, required: e.target.checked })}
                      />
                      Required
                    </label>
                  </div>
                  
                  {/* Options */}
                  {newModifier.options.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {newModifier.options.map((opt, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                          {opt.name}{opt.price > 0 && ` +$${opt.price}`}
                          <button type="button" onClick={() => removeOptionFromModifier(idx)} className="hover:text-red-500">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Option name"
                      value={newOption.name}
                      onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
                      className="flex-1 px-2 py-1 text-sm rounded border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800"
                    />
                    <input
                      type="number"
                      placeholder="+$"
                      value={newOption.price}
                      onChange={(e) => setNewOption({ ...newOption, price: e.target.value })}
                      className="w-16 px-2 py-1 text-sm rounded border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800"
                    />
                    <button type="button" onClick={addOptionToModifier} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">+</button>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => addModifierToItem(setNewItem, newItem)}
                    className="w-full py-1 bg-green-500 text-white rounded text-sm mt-2"
                  >
                    Add Modifier
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 px-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-brand-navy text-white rounded-xl hover:bg-brand-navy/90"
                >
                  Create Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit {editingItem.name}</h2>
              <button onClick={() => { setShowEditModal(false); setEditingItem(null); }} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prep Time (min)</label>
                  <input
                    type="number"
                    value={editingItem.prepTime}
                    onChange={(e) => setEditingItem({ ...editingItem, prepTime: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700"
                  />
                </div>
              </div>

              {/* Modifiers Section */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Modifiers</h3>
                
                {editingItem.modifiers && editingItem.modifiers.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {editingItem.modifiers.map((mod, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg flex justify-between items-start">
                        <div>
                          <span className="font-medium text-sm">{mod.name}</span>
                          {mod.required && <span className="text-red-500 text-xs ml-1">(Required)</span>}
                          <p className="text-xs text-gray-500">{mod.options.map(o => `${o.name}${o.price > 0 ? ` +$${o.price}` : ''}`).join(', ')}</p>
                        </div>
                        <button onClick={() => removeModifierFromItem(setEditingItem, editingItem, idx)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new modifier */}
                <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Modifier name"
                      value={newModifier.name}
                      onChange={(e) => setNewModifier({ ...newModifier, name: e.target.value })}
                      className="flex-1 px-2 py-1 text-sm rounded border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800"
                    />
                    <label className="flex items-center gap-1 text-xs">
                      <input
                        type="checkbox"
                        checked={newModifier.required}
                        onChange={(e) => setNewModifier({ ...newModifier, required: e.target.checked })}
                      />
                      Required
                    </label>
                  </div>
                  
                  {newModifier.options.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {newModifier.options.map((opt, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                          {opt.name}{opt.price > 0 && ` +$${opt.price}`}
                          <button onClick={() => removeOptionFromModifier(idx)} className="hover:text-red-500">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Option name"
                      value={newOption.name}
                      onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
                      className="flex-1 px-2 py-1 text-sm rounded border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800"
                    />
                    <input
                      type="number"
                      placeholder="+$"
                      value={newOption.price}
                      onChange={(e) => setNewOption({ ...newOption, price: e.target.value })}
                      className="w-16 px-2 py-1 text-sm rounded border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800"
                    />
                    <button onClick={addOptionToModifier} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">+</button>
                  </div>
                  
                  <button
                    onClick={() => addModifierToItem(setEditingItem, editingItem)}
                    className="w-full py-1 bg-green-500 text-white rounded text-sm mt-2"
                  >
                    Add Modifier
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setShowEditModal(false); setEditingItem(null); }}
                  className="flex-1 py-2 px-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 py-2 px-4 bg-brand-navy text-white rounded-xl"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagerMenu;