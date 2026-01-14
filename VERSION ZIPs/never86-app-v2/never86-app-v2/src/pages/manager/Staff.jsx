import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { X, Plus, User } from 'lucide-react';

function ManagerStaff() {
  const { staff, addStaffMember, updateStaffMember } = useData();
  const [filter, setFilter] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    username: '',
    displayName: '',
    role: 'server',
    section: '',
    station: ''
  });

  const filteredStaff = filter === 'all' 
    ? staff 
    : staff.filter(s => s.role === filter);

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'manager': return 'bg-brand-navy text-white';
      case 'server': return 'bg-server-primary text-white';
      case 'kitchen': return 'bg-kitchen-primary text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    addStaffMember({
      ...newStaff,
      displayName: newStaff.displayName || newStaff.username.charAt(0).toUpperCase() + newStaff.username.slice(1)
    });
    setNewStaff({
      username: '',
      displayName: '',
      role: 'server',
      section: '',
      station: ''
    });
    setShowAddModal(false);
  };

  const handleEditStaff = (e) => {
    e.preventDefault();
    if (selectedStaff) {
      updateStaffMember(selectedStaff.id, {
        username: newStaff.username,
        displayName: newStaff.displayName,
        section: newStaff.section || null,
        station: newStaff.station || null
      });
      setShowEditModal(false);
      setSelectedStaff(null);
    }
  };

  const handleEditClick = () => {
    if (selectedStaff) {
      setNewStaff({
        username: selectedStaff.username,
        displayName: selectedStaff.displayName,
        section: selectedStaff.section || '',
        station: selectedStaff.station || '',
        role: selectedStaff.role
      });
      setShowEditModal(true);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Management</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-brand-navy text-white px-4 py-2 rounded-xl hover:bg-brand-navy/90 transition-colors"
        >
          <Plus size={20} />
          Add Staff
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'manager', 'server', 'kitchen'].map((role) => (
          <button
            key={role}
            onClick={() => setFilter(role)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === role
                ? 'bg-brand-navy text-white'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}s
          </button>
        ))}
      </div>

      {/* Staff List */}
      <div className="space-y-3">
        {filteredStaff.map((member) => (
          <div
            key={member.id}
            onClick={() => setSelectedStaff(member)}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <User className="text-gray-500 dark:text-gray-400" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{member.displayName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{member.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm ${getRoleBadgeColor(member.role)}`}>
                  {member.role}
                </span>
                {member.section && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">Section {member.section}</span>
                )}
                {member.station && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">{member.station}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Staff Detail Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedStaff.displayName}</h2>
              <button
                onClick={() => setSelectedStaff(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <User className="text-gray-500 dark:text-gray-400" size={40} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                <span className="text-gray-500 dark:text-gray-400">Username</span>
                <span className="font-medium text-gray-900 dark:text-white">@{selectedStaff.username}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                <span className="text-gray-500 dark:text-gray-400">Role</span>
                <span className={`px-3 py-1 rounded-full text-sm ${getRoleBadgeColor(selectedStaff.role)}`}>
                  {selectedStaff.role}
                </span>
              </div>
              {selectedStaff.section && (
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                  <span className="text-gray-500 dark:text-gray-400">Section</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedStaff.section}</span>
                </div>
              )}
              {selectedStaff.station && (
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                  <span className="text-gray-500 dark:text-gray-400">Station</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedStaff.station}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                <span className="font-medium text-green-600">{selectedStaff.status}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500 dark:text-gray-400">Started</span>
                <span className="font-medium text-gray-900 dark:text-white">{selectedStaff.createdAt}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedStaff(null)}
                className="flex-1 py-2 px-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={handleEditClick}
                className="flex-1 py-2 px-4 bg-brand-navy text-white rounded-xl hover:bg-brand-navy/90 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Staff Member</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                <input
                  type="text"
                  value={newStaff.username}
                  onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
                <input
                  type="text"
                  value={newStaff.displayName}
                  onChange={(e) => setNewStaff({ ...newStaff, displayName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="Optional - defaults to username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value, section: e.target.value === 'server' ? newStaff.section : '', station: e.target.value === 'kitchen' ? newStaff.station : '' })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="manager">Manager</option>
                  <option value="server">Server</option>
                  <option value="kitchen">Kitchen</option>
                </select>
              </div>
              {newStaff.role === 'server' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section</label>
                  <select
                    value={newStaff.section}
                    onChange={(e) => setNewStaff({ ...newStaff, section: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Section</option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              )}
              {newStaff.role === 'kitchen' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Station</label>
                  <select
                    value={newStaff.station}
                    onChange={(e) => setNewStaff({ ...newStaff, station: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Station</option>
                    <option value="grill">Grill</option>
                    <option value="saute">Saute</option>
                    <option value="salad">Salad</option>
                    <option value="pastry">Pastry</option>
                  </select>
                </div>
              )}
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
                  Add Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {showEditModal && selectedStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Staff: {selectedStaff.displayName}</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedStaff(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleEditStaff} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                <input
                  type="text"
                  value={newStaff.username}
                  onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
                <input
                  type="text"
                  value={newStaff.displayName}
                  onChange={(e) => setNewStaff({ ...newStaff, displayName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              {selectedStaff.role === 'server' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section</label>
                  <select
                    value={newStaff.section}
                    onChange={(e) => setNewStaff({ ...newStaff, section: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="">No Section</option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              )}
              {selectedStaff.role === 'kitchen' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Station</label>
                  <select
                    value={newStaff.station}
                    onChange={(e) => setNewStaff({ ...newStaff, station: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="">No Station</option>
                    <option value="grill">Grill</option>
                    <option value="saute">Saute</option>
                    <option value="salad">Salad</option>
                    <option value="pastry">Pastry</option>
                  </select>
                </div>
              )}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedStaff(null);
                  }}
                  className="flex-1 py-2 px-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-brand-navy text-white rounded-xl hover:bg-brand-navy/90"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagerStaff;