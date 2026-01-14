import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { DollarSign, Users, TrendingUp, UtensilsCrossed } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatTime } from '../../utils/timeFormat';

function ManagerSales() {
  const { tables, staff, orders } = useData();
  const [timeFilter, setTimeFilter] = useState('today');

  const activeTables = tables.filter(t => t.status === 'occupied').length;
  const activeServers = staff.filter(s => s.role === 'server' && s.status === 'active').length;

  // Calculate sales based on time filter
  const getSalesData = () => {
    const now = new Date();
    let startDate;
    
    switch (timeFilter) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && order.status === 'completed';
    });

    const totalSales = filteredOrders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + item.price, 0);
    }, 0);

    const totalTips = filteredOrders.reduce((sum, order) => sum + (order.tip || 0), 0);
    const avgTip = totalSales > 0 ? ((totalTips / totalSales) * 100).toFixed(1) : 0;

    return { totalSales, avgTip, filteredOrders };
  };

  const { totalSales, avgTip, filteredOrders } = getSalesData();
  const todaySales = totalSales;

  // Calculate real server stats
  const serverStatsMap = new Map();
  
  filteredOrders.forEach(order => {
    const server = staff.find(s => s.id === order.serverId);
    if (server) {
      const orderTotal = order.items.reduce((sum, item) => sum + item.price, 0);
      const tip = order.tip || 0;
      
      if (!serverStatsMap.has(server.id)) {
        serverStatsMap.set(server.id, {
          id: server.id,
          name: server.name,
          sales: 0,
          tips: 0,
          orderCount: 0
        });
      }
      
      const stats = serverStatsMap.get(server.id);
      stats.sales += orderTotal;
      stats.tips += tip;
      stats.orderCount += 1;
    }
  });

  const serverStats = Array.from(serverStatsMap.values())
    .map(server => ({
      ...server,
      avgTip: server.sales > 0 ? ((server.tips / server.sales) * 100).toFixed(1) : 0
    }))
    .sort((a, b) => b.sales - a.sales);

  // Table history from completed orders
  const tableHistory = filteredOrders
    .map(order => {
      const table = tables.find(t => t.id === order.tableId);
      const server = staff.find(s => s.id === order.serverId);
      const orderTotal = order.items.reduce((sum, item) => sum + item.price, 0);
      const tipPercent = orderTotal > 0 ? Math.round((order.tip / orderTotal) * 100) : 0;
      const closedDate = new Date(order.closedAt || order.createdAt);
      
      return {
        id: order.id,
        table: table?.number || '?',
        server: server?.name || 'Unknown',
        time: formatTime(closedDate),
        date: closedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        total: orderTotal,
        tip: order.tip || 0,
        tipPercent,
        closedAt: order.closedAt,
        guestCount: order.guestCount || 0
      };
    })
    .sort((a, b) => new Date(b.closedAt || 0) - new Date(a.closedAt || 0));

  // Chart data preparation
  const chartData = useMemo(() => {
    if (filteredOrders.length === 0) return [];

    const grouped = {};
    filteredOrders.forEach(order => {
      const orderDate = new Date(order.closedAt || order.createdAt);
      let key;
      
      if (timeFilter === 'today') {
        // For chart grouping, use 24-hour format without am/pm
        const hours = orderDate.getHours();
        const minutes = orderDate.getMinutes();
        key = `${hours}:${minutes.toString().padStart(2, '0')}`;
      } else if (timeFilter === 'week') {
        key = orderDate.toLocaleDateString('en-US', { weekday: 'short' });
      } else {
        key = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }

      if (!grouped[key]) {
        grouped[key] = { time: key, sales: 0, tips: 0, orders: 0 };
      }
      
      const orderTotal = order.items.reduce((sum, item) => sum + item.price, 0);
      grouped[key].sales += orderTotal;
      grouped[key].tips += order.tip || 0;
      grouped[key].orders += 1;
    });

    return Object.values(grouped).sort((a, b) => {
      // Simple sort - in production, parse dates properly
      return a.time.localeCompare(b.time);
    });
  }, [filteredOrders, timeFilter]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Overview</h1>
        <select 
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
              <DollarSign className="text-emerald-600 dark:text-emerald-400" size={24} />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${todaySales.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <UtensilsCrossed className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Active Tables</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeTables}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Avg Tip %</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgTip}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <Users className="text-orange-600 dark:text-orange-400" size={24} />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Servers Active</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeServers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sales Over Time</h2>
        <SalesChart filteredOrders={filteredOrders} timeFilter={timeFilter} />
      </div>

      {/* Server Leaderboard */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">🏆 Server Leaderboard</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Rank</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Server</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Sales</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Tips</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Avg %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {serverStats.length > 0 ? (
              serverStats.map((server, index) => (
                <tr key={server.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4">
                    <span className="text-xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{server.name}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">${server.sales.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">${server.tips.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{server.avgTip}%</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No server stats for this period
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table History */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden mt-6">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">📋 Table History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Table</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Server</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Guests</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Time</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Total</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Tip</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Tip %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {tableHistory.length > 0 ? (
                tableHistory.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">Table {order.table}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{order.server}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{order.guestCount}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {order.time}
                      {timeFilter !== 'today' && (
                        <span className="text-xs ml-1">• {order.date}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-green-600 dark:text-green-400">${order.tip.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{order.tipPercent}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No table history for this period
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Sales Chart Component
function SalesChart({ filteredOrders, timeFilter }) {
  const chartData = useMemo(() => {
    if (filteredOrders.length === 0) return [];

    const grouped = {};
    filteredOrders.forEach(order => {
      const orderDate = new Date(order.closedAt || order.createdAt);
      let key;
      
      if (timeFilter === 'today') {
        // For chart grouping, use 24-hour format without am/pm
        const hours = orderDate.getHours();
        const minutes = orderDate.getMinutes();
        key = `${hours}:${minutes.toString().padStart(2, '0')}`;
      } else if (timeFilter === 'week') {
        key = orderDate.toLocaleDateString('en-US', { weekday: 'short' });
      } else {
        key = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }

      if (!grouped[key]) {
        grouped[key] = { time: key, sales: 0, tips: 0, orders: 0 };
      }
      
      const orderTotal = order.items.reduce((sum, item) => sum + item.price, 0);
      grouped[key].sales += orderTotal;
      grouped[key].tips += order.tip || 0;
      grouped[key].orders += 1;
    });

    return Object.values(grouped).sort((a, b) => {
      return a.time.localeCompare(b.time);
    });
  }, [filteredOrders, timeFilter]);

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-lg">
        <p className="text-gray-400">No sales data available for this period</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-slate-600" />
          <XAxis 
            dataKey="time" 
            className="text-gray-600 dark:text-gray-400"
            stroke="currentColor"
          />
          <YAxis 
            className="text-gray-600 dark:text-gray-400"
            stroke="currentColor"
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--tw-color-slate-800)', 
              border: '1px solid var(--tw-color-slate-700)',
              borderRadius: '0.5rem'
            }}
            formatter={(value) => [`$${value.toFixed(2)}`, 'Sales']}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="sales" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Sales"
            dot={{ fill: '#3b82f6', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ManagerSales;