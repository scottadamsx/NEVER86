import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MessageSquare, ChefHat, AlertTriangle, UserPlus, Calendar, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatTime } from '../utils/timeFormat';

function MessageCenter({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { messages, markMessageAsRead, markAllMessagesAsRead, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useData();
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Filter messages for current user (profile-specific)
  const myMessages = useMemo(() => {
    return messages.filter(msg => {
      const matchesRole = msg.toRole === currentUser?.role;
      // For server-to-server messages, filter by userId; for role-based, allow if toUserId is null or matches
      const matchesUser = msg.toUserId ? msg.toUserId === currentUser?.id : 
                         (msg.toRole === 'server' ? false : true); // If toUserId exists and is server role, must match
      return matchesRole && matchesUser && !msg.read;
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [messages, currentUser?.role, currentUser?.id]);

  // Filter notifications for current user's role
  const myNotifications = useMemo(() => {
    return notifications.filter(n => 
      (n.forRole === currentUser?.role || n.forRole === 'all') && !n.read
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [notifications, currentUser?.role]);

  // Combined items (messages + notifications)
  const allItems = useMemo(() => {
    const msgItems = myMessages.map(m => ({ ...m, itemType: 'message' }));
    const notifItems = myNotifications.map(n => ({ ...n, itemType: 'notification', timestamp: n.createdAt }));
    return [...msgItems, ...notifItems].sort((a, b) => 
      new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt)
    );
  }, [myMessages, myNotifications]);

  // Group messages by type
  const messagesByType = useMemo(() => {
    return {
      all: allItems,
      chat: myMessages.filter(m => m.type === 'chat'),
      '86-request': myMessages.filter(m => m.type === '86-request'),
      'server-request': myMessages.filter(m => m.type === 'server-request'),
      notifications: myNotifications
    };
  }, [allItems, myMessages, myNotifications]);

  const handleMessageClick = (item) => {
    if (item.itemType === 'notification') {
      markNotificationAsRead(item.id);
      if (item.link) {
        navigate(item.link);
      }
    } else {
      markMessageAsRead(item.id);
      // Navigate to appropriate page based on message type
      if (item.type === 'chat') {
        navigate(`/${currentUser?.role}/chat`);
      } else if (item.type === '86-request') {
        navigate(`/${currentUser?.role}/menu`);
      }
    }
    onClose();
  };

  const handleMarkAllRead = () => {
    markAllMessagesAsRead(currentUser?.role, currentUser?.id);
    markAllNotificationsAsRead(currentUser?.role);
  };

  const getMessageIcon = (item) => {
    if (item.itemType === 'notification') {
      switch (item.type) {
        case 'time_off_request':
          return <Calendar className="text-purple-600" size={20} />;
        default:
          return <Bell className="text-blue-600" size={20} />;
      }
    }
    switch (item.type) {
      case '86-request':
        return <AlertTriangle className="text-orange-600" size={20} />;
      case 'server-request':
        return <UserPlus className="text-blue-600" size={20} />;
      case 'chat':
      default:
        return <MessageSquare className="text-gray-600" size={20} />;
    }
  };

  const getMessageTypeLabel = (item) => {
    if (item.itemType === 'notification') {
      return item.title || 'Notification';
    }
    switch (item.type) {
      case '86-request':
        return '86 Request';
      case 'server-request':
        return 'Server Request';
      case 'chat':
      default:
        return 'Message';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed right-4 top-16 w-96 max-h-[600px] bg-white dark:bg-slate-800 rounded-xl shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Messages</h2>
          <div className="flex items-center gap-2">
            {myMessages.length > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 p-3 border-b border-gray-200 dark:border-slate-700 overflow-x-auto">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200'
            }`}
          >
            All ({messagesByType.all.length})
          </button>
          <button
            onClick={() => setSelectedFilter('notifications')}
            className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedFilter === 'notifications'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200'
            }`}
          >
            Alerts ({messagesByType.notifications.length})
          </button>
          <button
            onClick={() => setSelectedFilter('chat')}
            className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedFilter === 'chat'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200'
            }`}
          >
            Chats ({messagesByType.chat.length})
          </button>
          <button
            onClick={() => setSelectedFilter('86-request')}
            className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedFilter === '86-request'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200'
            }`}
          >
            86 Requests ({messagesByType['86-request'].length})
          </button>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-3">
          {messagesByType[selectedFilter].length > 0 ? (
            <div className="space-y-2">
              {messagesByType[selectedFilter].map(item => (
                <button
                  key={item.id}
                  onClick={() => handleMessageClick(item)}
                  className={`w-full text-left p-3 rounded-lg border-l-4 transition-colors ${
                    item.itemType === 'notification' 
                      ? 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 border-purple-500'
                      : 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border-blue-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getMessageIcon(item)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {item.itemType === 'notification' ? item.title : item.fromName}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(item.timestamp || item.createdAt)}
                        </span>
                      </div>
                      <p className={`text-xs mb-1 ${item.itemType === 'notification' ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'}`}>
                        {getMessageTypeLabel(item)}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                        {item.itemType === 'notification' ? item.message : item.text}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Bell className="text-gray-300 dark:text-slate-600 mb-3" size={48} />
              <p className="text-gray-500 dark:text-gray-400 text-center">
                No {selectedFilter !== 'all' ? selectedFilter : ''} notifications
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-slate-700">
          <button
            onClick={() => {
              navigate(`/${currentUser?.role}/chat`);
              onClose();
            }}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View All Messages
          </button>
        </div>
      </div>
    </>
  );
}

export default MessageCenter;
