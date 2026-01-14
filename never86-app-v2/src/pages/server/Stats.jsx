import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { DollarSign, TrendingUp, Receipt, Wallet } from 'lucide-react';
import { formatTime } from '../../utils/timeFormat';

function ServerStats() {
  const { currentUser } = useAuth();
  const { tables, orders } = useData();
  const [timeFilter, setTimeFilter] = useState('tonight');

  // Get server's tables (for demo, using section A)
  const myTables = useMemo(() => tables.filter(t => t.section === 'A'), [tables]);

  // Calculate date range based on filter
  const startDate = useMemo(() => {
    const now = new Date();
    let date;
    
    switch (timeFilter) {
      case 'tonight':
        date = new Date(now);
        date.setHours(0, 0, 0, 0);
        break;
      case 'week':
        date = new Date(now);
        date.setDate(now.getDate() - 7);
        break;
      case 'month':
        date = new Date(now);
        date.setMonth(now.getMonth() - 1);
        break;
      default:
        date = new Date(now);
        date.setHours(0, 0, 0, 0);
    }
    return date;
  }, [timeFilter]);
  
  // Calculate stats - memoized to update when orders change
  const stats = useMemo(() => {
    // Filter orders for the selected time period that belong to this server
    const myOrders = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      // Match by serverId OR by table assignment (section A)
      // Check if table is in section A
      const table = tables.find(t => t.id === o.tableId);
      const isMyOrder = 
        o.serverId === currentUser?.id || 
        (table && table.section === 'A');
      return orderDate >= startDate && isMyOrder;
    });

    // Calculate stats from completed orders only
    const completedOrders = myOrders.filter(o => o.status === 'completed');
    
    const totalSales = completedOrders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + item.price, 0);
    }, 0);
    
    const tipsEarned = completedOrders.reduce((sum, order) => sum + (order.tip || 0), 0);
    
    const salesForTipCalc = completedOrders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + item.price, 0);
    }, 0);
    
    const avgTip = salesForTipCalc > 0 ? Math.round((tipsEarned / salesForTipCalc) * 100) : 0;
    
    // Tip out calculations (15% to kitchen, 10% to host/expo)
    const tipOutKitchen = tipsEarned * 0.15;
    const tipOutHostExpo = tipsEarned * 0.10;
    const takeHome = tipsEarned - tipOutKitchen - tipOutHostExpo;

    // Order history from completed orders
    const orderHistory = completedOrders
      .map(order => {
        const table = tables.find(t => t.id === order.tableId);
        const orderTotal = order.items.reduce((sum, item) => sum + item.price, 0);
        const tipPercent = orderTotal > 0 ? Math.round((order.tip / orderTotal) * 100) : 0;
        const closedDate = new Date(order.closedAt || order.createdAt);
        
        return {
          id: order.id,
          table: table?.number || '?',
          time: formatTime(closedDate),
          date: closedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          total: orderTotal,
          tip: order.tip || 0,
          tipPercent,
          closedAt: order.closedAt
        };
      })
      .sort((a, b) => new Date(b.closedAt || 0) - new Date(a.closedAt || 0));

    return { totalSales, tipsEarned, avgTip, tipOutKitchen, tipOutHostExpo, takeHome, orderHistory };
  }, [orders, orders.length, currentUser?.id, myTables, startDate, tables]);

  const { totalSales, tipsEarned, avgTip, tipOutKitchen, tipOutHostExpo, takeHome, orderHistory } = stats;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Stats</h1>
        <select 
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
        >
          <option value="tonight">Tonight</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <DollarSign className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalSales.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Receipt className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Tips Earned</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${tipsEarned.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Tip Average</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgTip}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
              <Wallet className="text-emerald-600 dark:text-emerald-400" size={24} />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Take Home</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${takeHome.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tip Out Breakdown */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">💸 Tip Out Breakdown</h2>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
            <span className="text-gray-600 dark:text-gray-400">Tips Earned</span>
            <span className="font-medium text-gray-900 dark:text-white">${tipsEarned.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
            <span className="text-gray-600 dark:text-gray-400">Kitchen (15%)</span>
            <span className="font-medium text-red-600">-${tipOutKitchen.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200 dark:border-slate-700">
            <span className="text-gray-600 dark:text-gray-400">Host/Expo (10%)</span>
            <span className="font-medium text-red-600">-${tipOutHostExpo.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 text-lg font-bold">
            <span className="text-gray-900 dark:text-white">Take Home</span>
            <span className="text-emerald-600">${takeHome.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Order History</h2>
          <button className="text-server-primary hover:underline text-sm">View All</button>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-slate-700">
          {orderHistory.length > 0 ? (
            orderHistory.map((order) => (
              <div key={order.id} className="p-4 flex justify-between items-center">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Table {order.table}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">• {order.time}</span>
                  {timeFilter !== 'tonight' && (
                    <span className="text-gray-400 dark:text-gray-500 text-xs ml-2">• {order.date}</span>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900 dark:text-white">${order.total.toFixed(2)}</div>
                  <div className="text-sm text-green-600">Tip: ${order.tip.toFixed(2)} ({order.tipPercent}%)</div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No completed orders for this period
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServerStats;