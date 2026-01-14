import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Clock, Send, CheckCircle } from 'lucide-react';
import { formatTimeElapsed } from '../../utils/timeFormat';

function KitchenOrders() {
  const { chits, markChitItemDone, sendChitToFloor } = useData();
  const [activeTab, setActiveTab] = useState('active');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeChits = chits.filter(c => c.status === 'pending');
  const completedChits = chits.filter(c => c.status === 'ready');

  const displayedChits = activeTab === 'active' ? activeChits : completedChits;

  const getTimeElapsed = (createdAt) => {
    return formatTimeElapsed(createdAt, currentTime);
  };

  const getChitProgress = (chit) => {
    const done = chit.items.filter(i => i.done).length;
    return { done, total: chit.items.length };
  };

  const isChitComplete = (chit) => {
    return chit.items.every(i => i.done);
  };

  const handleItemClick = (chitId, itemId) => {
    markChitItemDone(chitId, itemId);
  };

  const handleSendToFloor = (chitId) => {
    sendChitToFloor(chitId);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'active'
                ? 'bg-kitchen-primary text-white'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            Active ({activeChits.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-kitchen-primary text-white'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            History ({completedChits.length})
          </button>
        </div>
      </div>

      {displayedChits.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 shadow-sm text-center">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {activeTab === 'active' ? 'All Caught Up!' : 'No History Yet'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {activeTab === 'active' ? 'No pending orders right now.' : 'Completed orders will appear here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedChits.map(chit => {
            const progress = getChitProgress(chit);
            const complete = isChitComplete(chit);

            return (
              <div
                key={chit.id}
                className={`rounded-xl overflow-hidden shadow-sm transition-all ${
                  complete
                    ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
                    : 'bg-white dark:bg-slate-800 border-2 border-red-400'
                }`}
              >
                {/* Chit Header */}
                <div className={`px-4 py-3 ${complete ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-lg">TABLE {chit.tableNumber}</span>
                      <span className="ml-2 text-white/80 text-sm">• {chit.serverName}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock size={14} />
                      <span>{getTimeElapsed(chit.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Chit Items */}
                <div className="p-4 space-y-2">
                  {chit.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => !item.done && activeTab === 'active' && handleItemClick(chit.id, item.id)}
                      disabled={item.done || activeTab === 'history'}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                        item.done
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className={`font-medium ${item.done ? 'line-through' : ''}`}>
                            {item.name}
                          </span>
                          {item.modifications && (
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                              ({item.modifications})
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">G{item.guestNumber}</span>
                      </div>
                      {item.notes && (
                        <div className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                          Note: {item.notes}
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Chit Footer */}
                <div className={`px-4 py-3 border-t ${complete ? 'border-green-200 dark:border-green-800' : 'border-gray-200 dark:border-slate-700'}`}>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {progress.done}/{progress.total} done
                    </div>
                    {activeTab === 'active' && (
                      <button
                        onClick={() => handleSendToFloor(chit.id)}
                        disabled={!complete}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          complete
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <Send size={16} />
                        Send to Floor
                      </button>
                    )}
                    {activeTab === 'history' && (
                      <span className="text-sm text-green-600 font-medium">Delivered ✓</span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className={`h-2 ${complete ? 'bg-green-500' : 'bg-red-500'}`}>
                  <div
                    className="h-full bg-green-400 transition-all"
                    style={{ width: `${(progress.done / progress.total) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default KitchenOrders;