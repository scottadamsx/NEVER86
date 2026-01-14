import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import MessageCenter from '../MessageCenter';

function Header() {
  const { currentUser, logout } = useAuth();
  const { messages } = useData();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [messageCenterOpen, setMessageCenterOpen] = useState(false);

  // Calculate unread messages for current user (profile-specific)
  const unreadCount = useMemo(() => {
    return messages.filter(msg => {
      const matchesRole = msg.toRole === currentUser?.role;
      const matchesUser = msg.toUserId ? msg.toUserId === currentUser?.id : 
                         (msg.toRole === 'server' ? false : true);
      return matchesRole && matchesUser && !msg.read;
    }).length;
  }, [messages, currentUser?.role, currentUser?.id]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeColor = () => {
    switch (currentUser?.role) {
      case 'manager': return 'bg-brand-navy';
      case 'server': return 'bg-server-primary';
      case 'kitchen': return 'bg-kitchen-primary';
      default: return 'bg-gray-500';
    }
  };

  const getRoleLabel = () => {
    switch (currentUser?.role) {
      case 'manager': return 'Manager Portal';
      case 'server': return 'Server Portal';
      case 'kitchen': return 'Kitchen Portal';
      default: return '';
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-6">
      {/* Left side - Portal Badge */}
      <div className="flex items-center gap-4">
        <span className={`${getRoleBadgeColor()} text-white text-sm px-3 py-1 rounded-full`}>
          {getRoleLabel()}
        </span>
      </div>

      {/* Right side - Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          onClick={() => setMessageCenterOpen(!messageCenterOpen)}
          className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <div className="w-8 h-8 bg-gray-300 dark:bg-slate-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-gray-600 dark:text-gray-300" />
            </div>
            <span className="text-gray-700 dark:text-gray-200 font-medium">
              {currentUser?.displayName}
            </span>
            <ChevronDown size={16} className="text-gray-500" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-1 z-20">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate(`/${currentUser?.role}/settings`);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <Settings size={16} />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Message Center Modal */}
      <MessageCenter
        isOpen={messageCenterOpen}
        onClose={() => setMessageCenterOpen(false)}
      />
    </header>
  );
}

export default Header;