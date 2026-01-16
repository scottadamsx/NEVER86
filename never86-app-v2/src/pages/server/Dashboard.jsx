import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { UtensilsCrossed, DollarSign, TrendingUp, AlertCircle, CheckCircle, X, Users } from 'lucide-react';
import { formatTimeElapsed } from '../../utils/timeFormat';
import { serverPerformance } from '../../data/generatedHistoricalData';

function ServerDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { tables, orders, chits, staff, seatTable, getOrderByTable, markChitAsRun, createOrder } = useData();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [showRunFoodModal, setShowRunFoodModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [guestCount, setGuestCount] = useState(2);

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

  // Get server's tables based on their assigned section
  const myTables = useMemo(() => tables.filter(t => t.section === mySection), [tables, mySection]);
  const activeTables = useMemo(() => myTables.filter(t => t.status === 'occupied'), [myTables]);
  
  // Calculate real sales from orders and historical data
  const stats = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayStr = todayStart.toISOString().split('T')[0];
    
    // Get historical performance for today (or most recent day)
    const todayPerf = serverPerformance.find(p => 
      p.serverId === currentUser?.id && p.date === todayStr
    );
    
    // If we have historical data for today, use it
    if (todayPerf) {
      return {
        todaySales: todayPerf.totalSales,
        totalTips: todayPerf.totalTips,
        avgTip: todayPerf.totalSales > 0 ? Math.round((todayPerf.totalTips / todayPerf.totalSales) * 100) : 0,
        takehome: todayPerf.totalTips
      };
    }
    
    // Otherwise, get the most recent historical data for this server
    const recentPerf = serverPerformance
      .filter(p => p.serverId === currentUser?.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    
    if (recentPerf) {
      return {
        todaySales: recentPerf.totalSales,
        totalTips: recentPerf.totalTips,
        avgTip: recentPerf.totalSales > 0 ? Math.round((recentPerf.totalTips / recentPerf.totalSales) * 100) : 0,
        takehome: recentPerf.totalTips
      };
    }
    
    // Fallback to current session orders
    const myOrders = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      const isMyOrder = o.serverId === currentUser?.id || myTables.some(t => t.id === o.tableId);
      return orderDate >= todayStart && isMyOrder;
    });
    
    const completedOrders = myOrders.filter(o => o.status === 'completed');
    const todaySales = completedOrders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + item.price, 0);
    }, 0);
    const totalTips = completedOrders.reduce((sum, order) => sum + (order.tip || 0), 0);
    const avgTip = todaySales > 0 ? Math.round((totalTips / todaySales) * 100) : 0;
    
    return { todaySales, totalTips, avgTip, takehome: totalTips };
  }, [orders, currentUser?.id, myTables]);
  
  const { todaySales = 0, totalTips = 0, avgTip = 0, takehome = 0 } = stats || {};

  // Get tables needing attention (ready chits that haven't been run)
  const readyChits = chits.filter(c => c.status === 'ready' && !c.run);
  const needsAttention = activeTables.filter(t => {
    const hasReadyFood = readyChits.some(c => c.tableNumber === t.number);
    return hasReadyFood;
  });

  // Track check-in timers for food that has been run
  const [checkInTimers, setCheckInTimers] = useState({});

  const getTimeSinceReady = (completedAt) => {
    if (!completedAt) return { minutes: 0, seconds: 0, display: '0s ago' };
    const display = formatTimeElapsed(completedAt, currentTime);
    const diff = Math.floor((currentTime - new Date(completedAt)) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return { minutes, seconds, display };
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getTimeElapsed = (seatedAt) => {
    return formatTimeElapsed(seatedAt, currentTime);
  };

  const handleTableClick = (table) => {
    if (table.status === 'available') {
      setSelectedTable(table);
      setShowSeatModal(true);
    } else if (table.status === 'occupied') {
      // Check if food is ready for this table
      const hasReadyFood = readyChits.some(c => c.tableNumber === table.number);
      if (hasReadyFood) {
        setSelectedTable(table);
        setShowRunFoodModal(true);
      } else {
        navigate('/server/tables');
      }
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
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-server-primary to-server-light rounded-lg p-5 mb-5 text-white">
        <h1 className="text-xl font-semibold mb-0.5">Good evening, {currentUser?.displayName}!</h1>
        <p className="text-white/70 text-sm">{today}</p>
        <p className="text-white/70 text-xs mt-0.5">Section A • {myTables.length} tables assigned</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center">
              <UtensilsCrossed className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Active Tables</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{activeTables.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-md flex items-center justify-center">
              <DollarSign className="text-emerald-600 dark:text-emerald-400" size={20} />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Sales Tonight</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">${todaySales.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-md flex items-center justify-center">
              <TrendingUp className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Avg Tip Tonight</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{avgTip}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-md flex items-center justify-center">
              <DollarSign className="text-yellow-600 dark:text-yellow-400" size={20} />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Takehome</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">${takehome.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Needs Attention */}
      {needsAttention.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2.5">
            <AlertCircle className="text-orange-600" size={18} />
            <h2 className="text-sm font-semibold text-orange-800 dark:text-orange-200">Food Ready to Run</h2>
          </div>
          <div className="space-y-1.5">
            {needsAttention.map(table => {
              const readyChit = readyChits.find(c => c.tableNumber === table.number);
              const timeSinceReady = readyChit ? getTimeSinceReady(readyChit.completedAt) : null;
              return (
                <div key={table.id} className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-md p-2.5">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Table {table.number}</span>
                      {timeSinceReady && (
                        <span className={`text-xs font-semibold ${
                          timeSinceReady.minutes >= 5 ? 'text-red-600' : 'text-orange-600'
                        }`}>
                          Ready {timeSinceReady.display}
                        </span>
                      )}
                    </div>
                    <span className="text-orange-600 text-xs">Food ready for pickup!</span>
                  </div>
                  <button
                    onClick={() => {
                      if (readyChit) {
                        markChitAsRun(readyChit.id);
                        // Start check-in timer
                        setCheckInTimers(prev => ({
                          ...prev,
                          [table.id]: { startTime: new Date().toISOString(), chitId: readyChit.id }
                        }));
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle size={14} />
                    Run Food
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Check-In Needed - Food that was run and needs check-in */}
      {Object.keys(checkInTimers).length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2.5">
            <UtensilsCrossed className="text-blue-600" size={18} />
            <h2 className="text-sm font-semibold text-blue-800 dark:text-blue-200">Check-In Needed</h2>
          </div>
          <div className="space-y-1.5">
            {Object.entries(checkInTimers).map(([tableId, timerData]) => {
              const table = myTables.find(t => t.id === tableId);
              if (!table) return null;

              const timeSinceRun = getTimeSinceReady(timerData.startTime);
              const needsCheckIn = timeSinceRun.minutes >= 2; // Check-in after 2 minutes

              return (
                <div key={tableId} className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-md p-2.5">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Table {table.number}</span>
                      <span className={`text-xs font-semibold ${
                        needsCheckIn ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        Food ran {timeSinceRun.display}
                      </span>
                    </div>
                    <span className="text-blue-600 text-xs">
                      {needsCheckIn ? 'Time to check on them!' : 'Check-in soon'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setCheckInTimers(prev => {
                        const updated = { ...prev };
                        delete updated[tableId];
                        return updated;
                      });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <CheckCircle size={14} />
                    Checked In
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* My Tables Quick View */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-slate-700 mb-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">My Tables Quick View</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {myTables.map(table => {
            const hasReadyFood = readyChits.some(c => c.tableNumber === table.number);
            const order = getOrderByTable(table.id);
            return (
              <button
                key={table.id}
                onClick={() => handleTableClick(table)}
                className={`p-3 rounded-md border text-left transition-all hover:scale-[1.02] ${
                  hasReadyFood
                    ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                    : table.status === 'available'
                    ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                    : table.status === 'occupied'
                    ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 bg-gray-50 dark:bg-slate-700'
                }`}
              >
                <div className="font-semibold text-base text-gray-900 dark:text-white mb-0.5">T{table.number}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 capitalize mb-0.5">{table.status}</div>
                {table.status === 'occupied' && (
                  <>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mb-0.5">{getTimeElapsed(table.seatedAt)}</div>
                    {order && (
                      <div className="text-xs font-semibold text-gray-900 dark:text-white">
                        ${order.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                      </div>
                    )}
                  </>
                )}
                {hasReadyFood && (
                  <div className="text-xs font-semibold text-orange-600 mt-0.5">⚠️ Ready!</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => navigate('/server/tables')}
          className="bg-brand-navy text-white py-3 px-4 rounded-md text-sm font-medium hover:bg-brand-navy/90 transition-colors"
        >
          Seat Table
        </button>
        <button
          onClick={() => navigate('/server/tables')}
          className="bg-server-primary text-white py-3 px-4 rounded-md text-sm font-medium hover:bg-server-primary/90 transition-colors"
        >
          Take Order
        </button>
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

      {/* Run Food Modal */}
      {showRunFoodModal && selectedTable && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Table {selectedTable.number}
              </h2>
              <button
                onClick={() => {
                  setShowRunFoodModal(false);
                  setSelectedTable(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                Food is ready for Table {selectedTable.number}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Would you like to run the food?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigate('/server/tables');
                  setShowRunFoodModal(false);
                  setSelectedTable(null);
                }}
                className="flex-1 py-2 px-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600"
              >
                View Table
              </button>
              <button
                onClick={() => {
                  const readyChit = readyChits.find(c => c.tableNumber === selectedTable.number);
                  if (readyChit) {
                    markChitAsRun(readyChit.id);
                  }
                  setShowRunFoodModal(false);
                  setSelectedTable(null);
                }}
                className="flex-1 py-2 px-4 bg-orange-600 text-white rounded-xl hover:bg-orange-700 flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} />
                Run Food
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServerDashboard;