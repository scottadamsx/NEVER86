import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { X } from 'lucide-react';
import { formatTimeElapsed } from '../../utils/timeFormat';

function ServerFloor() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { tables, chits, seatTable, createOrder } = useData();
  const [showMySection, setShowMySection] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [guestCount, setGuestCount] = useState(2);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // For demo, server is assigned to section A
  const mySection = 'A';
  const readyChits = chits.filter(c => c.status === 'ready');

  const getStatusColor = (table) => {
    const hasReadyFood = readyChits.some(c => c.tableNumber === table.number);
    if (hasReadyFood) return 'bg-orange-100 border-orange-500 text-orange-700';
    
    switch (table.status) {
      case 'available': return 'bg-green-100 border-green-500 text-green-700';
      case 'occupied': return 'bg-blue-100 border-blue-500 text-blue-700';
      case 'reserved': return 'bg-gray-100 border-gray-500 text-gray-700';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const isMyTable = (table) => table.section === mySection;

  const getTimeElapsed = (seatedAt) => {
    return formatTimeElapsed(seatedAt, currentTime);
  };

  const handleTableClick = (table) => {
    if (showMySection && !isMyTable(table)) return;
    setSelectedTable(table);
    if (table.status === 'available' && isMyTable(table)) {
      setShowSeatModal(true);
    }
  };

  const handleSeatTable = () => {
    if (selectedTable) {
      seatTable(selectedTable.id, guestCount, currentUser.id);
      // Create an order for the table
      createOrder(selectedTable.id, currentUser.id, guestCount);
      setShowSeatModal(false);
      setSelectedTable(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">The Floor</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowMySection(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showMySection
                ? 'bg-server-primary text-white'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            My Section
          </button>
          <button
            onClick={() => setShowMySection(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !showMySection
                ? 'bg-server-primary text-white'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            Show All
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-sm mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-300">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-300">Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-300">Attention</span>
        </div>
        {showMySection && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded opacity-50"></div>
            <span className="text-gray-600 dark:text-gray-300">Not my section</span>
          </div>
        )}
      </div>

      {/* Floor Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-5 gap-4">
          {tables.map((table) => {
            const isMine = isMyTable(table);
            const dimmed = showMySection && !isMine;

            return (
              <button
                key={table.id}
                onClick={() => handleTableClick(table)}
                disabled={dimmed}
                className={`p-4 rounded-xl border-2 transition-all ${
                  dimmed
                    ? 'bg-gray-100 dark:bg-slate-700 border-gray-200 dark:border-slate-600 opacity-40 cursor-not-allowed'
                    : `${getStatusColor(table)} hover:scale-105`
                }`}
              >
                <div className="text-2xl font-bold">{table.number}</div>
                <div className="text-sm opacity-75">{table.seats} seats</div>
                {table.status === 'occupied' && !dimmed && (
                  <div className="text-xs mt-1">{getTimeElapsed(table.seatedAt)}</div>
                )}
                {isMine && !dimmed && (
                  <div className="text-xs mt-1 font-medium">Mine</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Modal */}
      {selectedTable && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Table {selectedTable.number}
              </h2>
              <button
                onClick={() => setSelectedTable(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                <span className="font-medium text-gray-900 dark:text-white capitalize">{selectedTable.status}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                <span className="text-gray-500 dark:text-gray-400">Section</span>
                <span className="font-medium text-gray-900 dark:text-white">{selectedTable.section}</span>
              </div>
              {selectedTable.status === 'occupied' && (
                <>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                    <span className="text-gray-500 dark:text-gray-400">Guests</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedTable.guestCount}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
                    <span className="text-gray-500 dark:text-gray-400">Time Seated</span>
                    <span className="font-medium text-gray-900 dark:text-white">{getTimeElapsed(selectedTable.seatedAt)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedTable(null)}
                className="flex-1 py-2 px-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600"
              >
                Close
              </button>
              {selectedTable.status === 'available' && isMyTable(selectedTable) && (
                <button 
                  onClick={() => {
                    setShowSeatModal(true);
                  }}
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-xl hover:bg-green-700"
                >
                  Seat Table
                </button>
              )}
              {selectedTable.status === 'occupied' && isMyTable(selectedTable) && (
                <button 
                  onClick={() => navigate(`/server/tables`)}
                  className="flex-1 py-2 px-4 bg-server-primary text-white rounded-xl hover:bg-server-primary/90"
                >
                  Take Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Guests
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
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
                className="flex-1 py-2 px-4 bg-green-600 text-white rounded-xl hover:bg-green-700"
              >
                Seat Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServerFloor;