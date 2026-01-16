import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  LayoutDashboard,
  Map,
  Users,
  Package,
  UtensilsCrossed,
  MessageSquare,
  Settings,
  ClipboardList,
  Receipt,
  TrendingUp,
  Trophy,
  Calendar,
  DollarSign,
  PieChart
} from 'lucide-react';

const managerNav = [
  { to: '/manager/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/manager/floor', icon: Map, label: 'Floor Plan' },
  { to: '/manager/schedule', icon: Calendar, label: 'Schedule' },
  { to: '/manager/staff', icon: Users, label: 'Staff' },
  { to: '/manager/inventory', icon: Package, label: 'Inventory' },
  { to: '/manager/menu', icon: UtensilsCrossed, label: 'Menu' },
  { to: '/manager/analytics', icon: PieChart, label: 'Analytics' },
  { to: '/manager/profitability', icon: DollarSign, label: 'Profitability' },
  { to: '/manager/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/manager/settings', icon: Settings, label: 'Settings' },
];

const serverNav = [
  { to: '/server/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/server/floor', icon: Map, label: 'The Floor' },
  { to: '/server/tables', icon: ClipboardList, label: 'My Tables' },
  { to: '/server/stats', icon: TrendingUp, label: 'My Stats' },
  { to: '/server/competition', icon: Trophy, label: 'Competitions' },
  { to: '/server/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/server/settings', icon: Settings, label: 'Settings' },
];

const kitchenNav = [
  { to: '/kitchen/orders', icon: ClipboardList, label: 'Orders' },
  { to: '/kitchen/inventory', icon: Package, label: 'Inventory' },
  { to: '/kitchen/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/kitchen/settings', icon: Settings, label: 'Settings' },
];

function Sidebar({ expanded, onMouseEnter, onMouseLeave }) {
  const { currentUser } = useAuth();
  const { getUnreadMessageCount } = useData();

  const unreadMessages = getUnreadMessageCount(currentUser?.id);

  const getNavItems = () => {
    switch (currentUser?.role) {
      case 'manager': return managerNav;
      case 'server': return serverNav;
      case 'kitchen': return kitchenNav;
      default: return [];
    }
  };

  const getRoleColor = () => {
    switch (currentUser?.role) {
      case 'manager': return 'bg-brand-navy';
      case 'server': return 'bg-server-primary';
      case 'kitchen': return 'bg-kitchen-primary';
      default: return 'bg-brand-navy';
    }
  };

  const navItems = getNavItems();

  return (
    <aside
      className={`fixed left-0 top-0 h-full ${getRoleColor()} text-white transition-all duration-300 z-40 ${
        expanded ? 'w-56' : 'w-16'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/10">
        <span className="font-black text-2xl tracking-tight whitespace-nowrap">
          {expanded ? (
            <>
              <span className="text-white">NEVER</span>
              <span style={{ color: '#4169E1' }}>86</span>
            </>
          ) : (
            <span style={{ color: '#4169E1' }}>86</span>
          )}
        </span>
      </div>

      {/* Navigation */}
      <nav className="mt-4 px-2">
        {navItems.map((item) => {
          const isChat = item.label === 'Chat';
          const showBadge = isChat && unreadMessages > 0;
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-colors relative ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <div className="relative flex-shrink-0">
                <item.icon size={20} />
                {showBadge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
              </div>
              <span
                className={`whitespace-nowrap transition-opacity duration-300 flex items-center gap-2 ${
                  expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                }`}
              >
                {item.label}
                {showBadge && expanded && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;