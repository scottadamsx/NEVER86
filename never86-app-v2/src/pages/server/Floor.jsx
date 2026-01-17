import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { X } from 'lucide-react';
import { formatTimeElapsed } from '../../utils/timeFormat';

// Section colors for visual distinction
const SECTION_COLORS = {
  A: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
  B: { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800', text: 'text-purple-600 dark:text-purple-400', dot: 'bg-purple-500' },
  C: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
  D: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
};

function ServerFloor() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { tables, chits, staff, seatTable, createOrder } = useData();
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

  // Get current user's section from staff data
  const mySection = useMemo(() => {
    const serverStaff = staff.find(s => s.id === currentUser?.id);
    return serverStaff?.section || 'A';
  }, [staff, currentUser?.id]);

  // Get servers assigned to each section
  const sectionServers = useMemo(() => {
    const sections = {};
    staff.filter(s => s.role === 'server' && s.section).forEach(server => {
      if (!sections[server.section]) {
        sections[server.section] = [];
      }
      sections[server.section].push(server);
    });
    return sections;
  }, [staff]);

  // Get unique sections that have servers assigned
  const activeSections = useMemo(() => {
    return [...new Set(staff.filter(s => s.role === 'server' && s.section).map(s => s.section))].sort();
  }, [staff]);

  const readyChits = chits.filter(c => c.status === 'ready' && !c.run);

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

  const getServerForSection = (section) => {
    const servers = sectionServers[section] || [];
    return servers.length > 0 ? servers[0].displayName : 'Unassigned';
  };

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
      createOrder(selectedTable.id, currentUser.id, guestCount);
      setShowSeatModal(false);
      setSelectedTable(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">The Floor</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowMySection(true)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              showMySection
                ? 'bg-server-primary text-white'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            My Section
          </button>
          <button
            onClick={() => setShowMySection(false)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !showMySection
                ? 'bg-server-primary text-white'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            Show All
          </button>
        </div>
      </div>

      {/* Section Legend */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-3 mb-4 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex flex-wrap gap-4 items-center">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Sections:</span>
          {activeSections.map(section => {
            const colors = SECTION_COLORS[section] || SECTION_COLORS.A;
            const servers = sectionServers[section] || [];
            return (
              <div key={section} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${colors.dot}`}></div>
                <span className={`text-sm font-medium ${colors.text}`}>
                  Section {section}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({servers.map(s => s.displayName.split(' ')[0]).join(', ') || 'Unassigned'})
                </span>
              </div>
            );
          })}
          <div className="ml-auto flex gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 bg-green-500 rounded"></div>
              <span className="text-gray-500 dark:text-gray-400">Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded"></div>
              <span className="text-gray-500 dark:text-gray-400">Occupied</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 bg-orange-500 rounded"></div>
              <span className="text-gray-500 dark:text-gray-400">Attention</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floor Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 shadow-sm">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
          {tables.map((table) => {
            const isMine = isMyTable(table);
            const dimmed = showMySection && !isMine;
            const sectionColors = SECTION_COLORS[table.section] || SECTION_COLORS.A;
            const hasReadyFood = readyChits.some(c => c.tableNumber === table.number);

            return (
              <button
                key={table.id}
                onClick={() => handleTableClick(table)}
                disabled={dimmed}
                className={`p-2.5 sm:p-3 rounded-lg border-2 transition-all relative touch-manipulation min-h-[80px] ${
                  dimmed
                    ? 'bg-gray-100 dark:bg-slate-700 border-gray-200 dark:border-slate-600 opacity-40 cursor-not-allowed'
                    : hasReadyFood
                    ? 'bg-orange-100 border-orange-500 text-orange-700 hover:scale-105'
                    : table.status === 'available'
                    ? `${sectionColors.bg} ${sectionColors.border} ${sectionColors.text} hover:scale-105`
                    : table.status === 'occupied'
                    ? `${sectionColors.bg} border-blue-500 text-blue-700 hover:scale-105`
                    : table.status === 'reserved'
                    ? 'bg-gray-100 border-gray-400 text-gray-600 hover:scale-105'
                    : `${sectionColors.bg} ${sectionColors.border} hover:scale-105`
                }`}
              >
                {/* Section indicator dot */}
                {!dimmed && (
                  <div className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${sectionColors.dot}`}></div>
                )}
                <div className="text-xl font-bold">{table.number}</div>
                <div className="text-xs opacity-75">{table.seats} seats</div>
                {/* Priority: Food Ready > Occupied > Available > Reserved */}
                {hasReadyFood && !dimmed ? (
                  <div className="text-xs font-semibold text-orange-600 mt-0.5">⚠️ Ready!</div>
                ) : table.status === 'occupied' && !dimmed ? (
                  <>
                    <div className="text-xs mt-0.5 font-medium text-blue-600">{getTimeElapsed(table.seatedAt)}</div>
                    <div className="text-xs text-gray-500">{table.guestCount} guests</div>
                  </>
                ) : table.status === 'available' && !dimmed ? (
                  <div className="text-xs mt-0.5 text-green-600 font-medium">Available</div>
                ) : table.status === 'reserved' && !dimmed ? (
                  <div className="text-xs mt-0.5 text-gray-500 font-medium">Reserved</div>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Modal */}
      {selectedTable && !showSeatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 w-full max-w-sm shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Table {selectedTable.number}
              </h2>
              <button
                onClick={() => setSelectedTable(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1.5 border-b border-gray-200 dark:border-slate-700">
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                <span className="font-medium text-gray-900 dark:text-white capitalize">{selectedTable.status}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-200 dark:border-slate-700">
                <span className="text-gray-500 dark:text-gray-400">Section</span>
                <span className="font-medium text-gray-900 dark:text-white">{selectedTable.section}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-200 dark:border-slate-700">
                <span className="text-gray-500 dark:text-gray-400">Server</span>
                <span className="font-medium text-gray-900 dark:text-white">{getServerForSection(selectedTable.section)}</span>
              </div>
              {selectedTable.status === 'occupied' && (
                <>
                  <div className="flex justify-between py-1.5 border-b border-gray-200 dark:border-slate-700">
                    <span className="text-gray-500 dark:text-gray-400">Guests</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedTable.guestCount}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-200 dark:border-slate-700">
                    <span className="text-gray-500 dark:text-gray-400">Time Seated</span>
                    <span className="font-medium text-gray-900 dark:text-white">{getTimeElapsed(selectedTable.seatedAt)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setSelectedTable(null)}
                className="flex-1 py-2 px-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-slate-600"
              >
                Close
              </button>
              {selectedTable.status === 'available' && isMyTable(selectedTable) && (
                <button 
                  onClick={() => setShowSeatModal(true)}
                  className="flex-1 py-2 px-3 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                >
                  Seat Table
                </button>
              )}
              {selectedTable.status === 'occupied' && isMyTable(selectedTable) && (
                <button 
                  onClick={() => navigate(`/server/tables`)}
                  className="flex-1 py-2 px-3 bg-server-primary text-white rounded-lg text-sm hover:bg-server-primary/90"
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
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 w-full max-w-sm shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Seat Table {selectedTable.number}
              </h2>
              <button
                onClick={() => {
                  setShowSeatModal(false);
                  setSelectedTable(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Guests
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <button
                    key={num}
                    onClick={() => setGuestCount(num)}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors ${
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
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowSeatModal(false);
                  setSelectedTable(null);
                }}
                className="flex-1 py-2 px-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSeatTable}
                className="flex-1 py-2 px-3 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
              >
                Seat {guestCount} Guests
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServerFloor;
