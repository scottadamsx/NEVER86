import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Users, UtensilsCrossed, Package, DollarSign } from 'lucide-react';

function ManagerDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { tables, staff, getLowInventory, orders } = useData();

  const activeTables = tables.filter(t => t.status === 'occupied').length;
  const activeStaff = staff.filter(s => s.status === 'active').length;
  const lowStockItems = getLowInventory().length;

  // Calculate today's sales from completed orders
  const todaysSales = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const completedToday = orders.filter(o => {
      const orderDate = new Date(o.closedAt || o.createdAt);
      return o.status === 'completed' && orderDate >= todayStart;
    });

    return completedToday.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + item.price, 0);
    }, 0);
  }, [orders]);

  // Calculate server leaderboard
  const serverLeaderboard = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const servers = staff.filter(s => s.role === 'server');
    const serverStats = servers.map(server => {
      const serverOrders = orders.filter(o => {
        const orderDate = new Date(o.closedAt || o.createdAt);
        return o.serverId === server.id && o.status === 'completed' && orderDate >= todayStart;
      });

      const totalSales = serverOrders.reduce((sum, order) => {
        return sum + order.items.reduce((itemSum, item) => itemSum + item.price, 0);
      }, 0);

      return {
        id: server.id,
        name: server.displayName,
        sales: totalSales
      };
    });

    return serverStats.sort((a, b) => b.sales - a.sales).slice(0, 3);
  }, [staff, orders]);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 rounded-lg p-6 mb-6 text-white shadow-sm border border-slate-800 dark:border-slate-800">
        <h1 className="text-2xl font-semibold mb-1">Welcome back, {currentUser?.displayName}!</h1>
        <p className="text-slate-400 text-sm">{today}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-950 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Active Tables</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{activeTables}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950 rounded-lg flex items-center justify-center">
              <UtensilsCrossed className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-950 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Staff On Floor</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{activeStaff}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 dark:bg-green-950 rounded-lg flex items-center justify-center">
              <Users className="text-green-600 dark:text-green-400" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-950 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Low Stock Items</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{lowStockItems}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950 rounded-lg flex items-center justify-center">
              <Package className="text-orange-600 dark:text-orange-400" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-950 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Today's Sales</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">${todaysSales.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950 rounded-lg flex items-center justify-center">
              <DollarSign className="text-emerald-600 dark:text-emerald-400" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-950 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/manager/floor')}
              className="group p-4 bg-slate-50 dark:bg-slate-900 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            >
              <UtensilsCrossed className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 mb-2 transition-colors" size={20} />
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">View Floor</p>
            </button>
            <button
              onClick={() => navigate('/manager/staff')}
              className="group p-4 bg-slate-50 dark:bg-slate-900 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            >
              <Users className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 mb-2 transition-colors" size={20} />
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Add Staff</p>
            </button>
            <button
              onClick={() => navigate('/manager/inventory')}
              className="group p-4 bg-slate-50 dark:bg-slate-900 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            >
              <Package className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 mb-2 transition-colors" size={20} />
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Check Inventory</p>
            </button>
            <button
              onClick={() => navigate('/manager/menu')}
              className="group p-4 bg-slate-50 dark:bg-slate-900 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            >
              <UtensilsCrossed className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 mb-2 transition-colors" size={20} />
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Edit Menu</p>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-950 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Server Leaderboard</h2>
          <div className="space-y-3">
            {serverLeaderboard.length > 0 ? (
              serverLeaderboard.map((server, index) => {
                const medals = ['🥇', '🥈', '🥉'];
                const bgColors = [
                  'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900',
                  'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800',
                  'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900'
                ];

                return (
                  <div key={server.id} className={`flex items-center justify-between p-3 ${bgColors[index]} rounded-lg border`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{medals[index]}</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{server.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">${server.sales.toFixed(2)}</span>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-center py-4 text-sm">No sales data yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;