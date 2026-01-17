import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Bell, ChevronDown, LogOut, Settings, User, Menu } from 'lucide-react';
import MessageCenter from '../MessageCenter';

function Header({ onMenuClick, isMobile = false }) {
  const { currentUser, logout } = useAuth();
  const { messages, getUnreadNotificationCount } = useData();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [messageCenterOpen, setMessageCenterOpen] = useState(false);

  // Calculate unread messages for current user (profile-specific)
  const unreadMessageCount = useMemo(() => {
    return messages.filter(msg => {
      const matchesRole = msg.toRole === currentUser?.role;
      const matchesUser = msg.toUserId ? msg.toUserId === currentUser?.id : 
                         (msg.toRole === 'server' ? false : true);
      return matchesRole && matchesUser && !msg.read;
    }).length;
  }, [messages, currentUser?.role, currentUser?.id]);

  // Get unread notification count for current role
  const unreadNotificationCount = getUnreadNotificationCount(currentUser?.role);
  
  // Total unread count (messages + notifications)
  const unreadCount = unreadMessageCount + unreadNotificationCount;

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
    <header className="h-14 sm:h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-3 sm:px-4 md:px-6">
      {/* Left side - Menu button (mobile) and Portal Badge */}
      <div className="flex items-center gap-2 sm:gap-4">
        {isMobile && (
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        )}
        <span className={`${getRoleBadgeColor()} text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full whitespace-nowrap`}>
          {isMobile ? getRoleLabel().replace(' Portal', '') : getRoleLabel()}
        </span>
      </div>

      {/* Right side - Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notification Bell */}
        <button
          onClick={() => setMessageCenterOpen(!messageCenterOpen)}
          className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Notifications"
        >
          <Bell size={isMobile ? 22 : 20} />
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
            className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 touch-manipulation min-h-[44px]"
            aria-label="User menu"
          >
            <div className="w-8 h-8 bg-gray-300 dark:bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-gray-600 dark:text-gray-300" />
            </div>
            {!isMobile && (
              <>
                <span className="text-gray-700 dark:text-gray-200 font-medium text-sm sm:text-base hidden sm:block">
                  {currentUser?.displayName}
                </span>
                <ChevronDown size={16} className="text-gray-500 hidden sm:block" />
              </>
            )}
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className={`absolute ${isMobile ? 'right-2' : 'right-0'} mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-1 z-20`}>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate(`/${currentUser?.role}/settings`);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 touch-manipulation min-h-[44px]"
                >
                  <Settings size={18} />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-3 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-slate-700 touch-manipulation min-h-[44px]"
                >
                  <LogOut size={18} />
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