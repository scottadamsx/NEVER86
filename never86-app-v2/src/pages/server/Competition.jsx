import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Trophy, Target, Gift, TrendingUp, Star, Award } from 'lucide-react';

function ServerCompetition() {
  const { currentUser } = useAuth();
  const { orders, staff, menuItems } = useData();
  const [activeTab, setActiveTab] = useState('leaderboard');

  // Mock competition data - in real app, this would come from backend
  const competitions = useMemo(() => [
    {
      id: 'comp-1',
      name: 'Weekly Sales Champion',
      type: 'sales',
      period: 'week',
      description: 'Highest total sales this week',
      reward: '$50 Gift Card',
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      active: true
    },
    {
      id: 'comp-2',
      name: 'Ribeye Specialist',
      type: 'product',
      productId: 'menu-1',
      productName: 'Ribeye Steak',
      period: 'month',
      description: 'Sell the most Ribeye Steaks this month',
      reward: '$75 Restaurant Credit',
      target: 20,
      endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      active: true
    },
    {
      id: 'comp-3',
      name: 'Review Collector',
      type: 'reviews',
      period: 'month',
      description: 'Get the most Google reviews this month',
      reward: 'Extra Day Off',
      target: 10,
      endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      active: true
    }
  ], []);

  // Calculate server stats for competitions
  const serverStats = useMemo(() => {
    const servers = staff.filter(s => s.role === 'server');
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date();
    monthStart.setMonth(monthStart.getMonth() - 1);

    return servers.map(server => {
      // Sales stats
      const weekOrders = orders.filter(o => 
        o.serverId === server.id && 
        o.status === 'completed' && 
        new Date(o.closedAt || o.createdAt) >= weekStart
      );
      const weekSales = weekOrders.reduce((sum, order) => 
        sum + order.items.reduce((itemSum, item) => itemSum + item.price, 0), 0
      );

      const monthOrders = orders.filter(o => 
        o.serverId === server.id && 
        o.status === 'completed' && 
        new Date(o.closedAt || o.createdAt) >= monthStart
      );
      const monthSales = monthOrders.reduce((sum, order) => 
        sum + order.items.reduce((itemSum, item) => itemSum + item.price, 0), 0
      );

      // Product-specific sales
      const ribeyeSales = monthOrders.reduce((sum, order) => {
        const ribeyeItems = order.items.filter(item => item.menuItemId === 'menu-1');
        return sum + ribeyeItems.length;
      }, 0);

      // Mock review count (in real app, this would come from review system)
      const reviewCount = Math.floor(Math.random() * 15);

      return {
        id: server.id,
        name: server.displayName,
        weekSales,
        monthSales,
        ribeyeSales,
        reviewCount,
        isCurrentUser: server.id === currentUser?.id
      };
    });
  }, [orders, staff, currentUser?.id]);

  // Leaderboard for sales
  const salesLeaderboard = useMemo(() => {
    return [...serverStats]
      .sort((a, b) => b.weekSales - a.weekSales)
      .map((server, index) => ({ ...server, rank: index + 1 }));
  }, [serverStats]);

  // Product sales leaderboard
  const productLeaderboard = useMemo(() => {
    return [...serverStats]
      .sort((a, b) => b.ribeyeSales - a.ribeyeSales)
      .map((server, index) => ({ ...server, rank: index + 1 }));
  }, [serverStats]);

  // Review leaderboard
  const reviewLeaderboard = useMemo(() => {
    return [...serverStats]
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .map((server, index) => ({ ...server, rank: index + 1 }));
  }, [serverStats]);

  const currentUserStats = serverStats.find(s => s.isCurrentUser);

  const getRankBadge = (rank) => {
    if (rank === 1) return <Trophy className="text-yellow-500" size={24} />;
    if (rank === 2) return <Trophy className="text-gray-400" size={24} />;
    if (rank === 3) return <Trophy className="text-orange-600" size={24} />;
    return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Competitions & Rewards</h1>

      {/* Active Competitions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {competitions.map(comp => {
          const userStat = currentUserStats;
          let progress = 0;
          let currentValue = 0;

          if (comp.type === 'sales') {
            currentValue = comp.period === 'week' ? userStat?.weekSales || 0 : userStat?.monthSales || 0;
            const topSales = comp.period === 'week' 
              ? Math.max(...serverStats.map(s => s.weekSales))
              : Math.max(...serverStats.map(s => s.monthSales));
            progress = topSales > 0 ? (currentValue / topSales) * 100 : 0;
          } else if (comp.type === 'product') {
            currentValue = userStat?.ribeyeSales || 0;
            progress = comp.target > 0 ? Math.min((currentValue / comp.target) * 100, 100) : 0;
          } else if (comp.type === 'reviews') {
            currentValue = userStat?.reviewCount || 0;
            progress = comp.target > 0 ? Math.min((currentValue / comp.target) * 100, 100) : 0;
          }

          return (
            <div key={comp.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{comp.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{comp.description}</p>
                </div>
                <Gift className="text-yellow-500" size={24} />
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Your Progress</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {comp.type === 'product' || comp.type === 'reviews' 
                      ? `${currentValue}/${comp.target}`
                      : `$${currentValue.toFixed(0)}`}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-server-primary h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-slate-700">
                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{comp.reward}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {Math.ceil((comp.endDate - new Date()) / (1000 * 60 * 60 * 24))} days left
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm mb-6">
        <div className="flex border-b border-gray-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'leaderboard'
                ? 'border-b-2 border-server-primary text-server-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            Leaderboards
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'goals'
                ? 'border-b-2 border-server-primary text-server-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            My Goals
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'rewards'
                ? 'border-b-2 border-server-primary text-server-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            Rewards
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'leaderboard' && (
            <div className="space-y-6">
              {/* Sales Leaderboard */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp size={20} />
                  Weekly Sales Leaderboard
                </h3>
                <div className="space-y-2">
                  {salesLeaderboard.map(server => (
                    <div
                      key={server.id}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        server.isCurrentUser
                          ? 'bg-server-primary/10 border-2 border-server-primary'
                          : 'bg-gray-50 dark:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {getRankBadge(server.rank)}
                        <div>
                          <p className={`font-medium ${server.isCurrentUser ? 'text-server-primary' : 'text-gray-900 dark:text-white'}`}>
                            {server.name} {server.isCurrentUser && '(You)'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ${server.weekSales.toFixed(2)} in sales
                          </p>
                        </div>
                      </div>
                      {server.rank <= 3 && (
                        <Award className="text-yellow-500" size={20} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Leaderboard */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Target size={20} />
                  Ribeye Steak Sales
                </h3>
                <div className="space-y-2">
                  {productLeaderboard.map(server => (
                    <div
                      key={server.id}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        server.isCurrentUser
                          ? 'bg-server-primary/10 border-2 border-server-primary'
                          : 'bg-gray-50 dark:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {getRankBadge(server.rank)}
                        <div>
                          <p className={`font-medium ${server.isCurrentUser ? 'text-server-primary' : 'text-gray-900 dark:text-white'}`}>
                            {server.name} {server.isCurrentUser && '(You)'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {server.ribeyeSales} sold
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Leaderboard */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Star size={20} />
                  Google Reviews
                </h3>
                <div className="space-y-2">
                  {reviewLeaderboard.map(server => (
                    <div
                      key={server.id}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        server.isCurrentUser
                          ? 'bg-server-primary/10 border-2 border-server-primary'
                          : 'bg-gray-50 dark:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {getRankBadge(server.rank)}
                        <div>
                          <p className={`font-medium ${server.isCurrentUser ? 'text-server-primary' : 'text-gray-900 dark:text-white'}`}>
                            {server.name} {server.isCurrentUser && '(You)'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {server.reviewCount} reviews
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="space-y-4">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Track your progress toward competition goals</p>
              {competitions.map(comp => {
                const userStat = currentUserStats;
                let currentValue = 0;
                let target = null;

                if (comp.type === 'sales') {
                  currentValue = comp.period === 'week' ? userStat?.weekSales || 0 : userStat?.monthSales || 0;
                } else if (comp.type === 'product') {
                  currentValue = userStat?.ribeyeSales || 0;
                  target = comp.target;
                } else if (comp.type === 'reviews') {
                  currentValue = userStat?.reviewCount || 0;
                  target = comp.target;
                }

                return (
                  <div key={comp.id} className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{comp.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{comp.description}</p>
                      </div>
                      <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{comp.reward}</span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {target ? `${currentValue}/${target}` : `$${currentValue.toFixed(0)}`}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                        <div
                          className="bg-server-primary h-2 rounded-full transition-all"
                          style={{ 
                            width: `${target 
                              ? Math.min((currentValue / target) * 100, 100)
                              : 0}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'rewards' && (
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Your earned rewards and benefits</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-6 border-2 border-yellow-200 dark:border-yellow-800">
                  <Gift className="text-yellow-600 dark:text-yellow-400 mb-3" size={32} />
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Gift Cards</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Earn gift cards by winning competitions</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
                  <Award className="text-blue-600 dark:text-blue-400 mb-3" size={32} />
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Restaurant Credit</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Use credit for meals and drinks</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-800">
                  <Star className="text-green-600 dark:text-green-400 mb-3" size={32} />
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Work Benefits</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Extra days off, flexible scheduling</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-6 border-2 border-purple-200 dark:border-purple-800">
                  <Trophy className="text-purple-600 dark:text-purple-400 mb-3" size={32} />
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Recognition</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Featured on leaderboards and announcements</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServerCompetition;



