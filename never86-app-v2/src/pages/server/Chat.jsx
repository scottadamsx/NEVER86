import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { MessageSquare, Send, User, ChefHat, ClipboardList, AlertTriangle, Package, Search } from 'lucide-react';
import { formatTime } from '../../utils/timeFormat';

function ServerChat() {
  const { currentUser } = useAuth();
  const { staff, messages, addMessage, menuItems } = useData();
  const [selectedChat, setSelectedChat] = useState('kitchen');
  const [messageText, setMessageText] = useState('');
  const [readMessages, setReadMessages] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const messagesEndRef = useRef(null);

  const kitchenStaff = staff.filter(s => s.role === 'kitchen');
  const otherServers = staff.filter(s => s.role === 'server' && s.id !== currentUser?.id);
  const managers = staff.filter(s => s.role === 'manager');

  const getRecipientInfoForChat = (chatId) => {
    if (chatId === 'kitchen') {
      return { role: 'kitchen', name: 'Kitchen' };
    }
    if (chatId.startsWith('manager-')) {
      const managerId = chatId.replace('manager-', '');
      const manager = managers.find(m => m.id === managerId);
      if (manager) {
        return { role: 'manager', name: manager.displayName };
      }
    }
    if (chatId.startsWith('server-')) {
      const serverId = chatId.replace('server-', '');
      const server = otherServers.find(s => s.id === serverId);
      if (server) {
        return { role: 'server', name: server.displayName };
      }
    }
    return null;
  };

  // Get unread count for a chat
  const getUnreadCount = (chatId) => {
    const recipient = getRecipientInfoForChat(chatId);
    if (!recipient) return 0;
    let conversation;
    if (chatId.startsWith('server-')) {
      // For server-to-server, filter by userId
      const serverId = chatId.replace('server-', '');
      conversation = messages.filter(m => {
        return (m.fromRole === 'server' && m.toRole === 'server' && 
                ((m.fromUserId === currentUser.id && m.toUserId === serverId) ||
                 (m.fromUserId === serverId && m.toUserId === currentUser.id)));
      });
    } else if (chatId.startsWith('manager-')) {
      // For manager chats, filter by userId
      const managerId = chatId.replace('manager-', '');
      conversation = messages.filter(m => 
        ((m.fromRole === 'server' && m.toRole === 'manager' && m.fromUserId === currentUser.id && m.toUserId === managerId) || 
         (m.fromRole === 'manager' && m.toRole === 'server' && m.fromUserId === managerId && m.toUserId === currentUser.id))
      );
    } else {
      // For role-based chats (kitchen)
      conversation = messages.filter(m => 
        ((m.fromRole === 'server' && m.toRole === recipient.role && m.fromUserId === currentUser.id) || 
         (m.fromRole === recipient.role && m.toRole === 'server' && m.toUserId === currentUser.id))
      );
    }
    return conversation.filter(m => !readMessages.has(m.id) && m.fromRole !== 'server').length;
  };

  // Mark messages as read when chat is selected
  useEffect(() => {
    const conversation = getConversation();
    const newReadIds = new Set(conversation.map(m => m.id));
    setReadMessages(prev => new Set([...prev, ...newReadIds]));
  }, [selectedChat, messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedChat]);

  const handle86Request = (itemName) => {
    let toRole = 'kitchen';
    let toName = 'Kitchen';
    let toUserId = null;

    if (selectedChat.startsWith('manager-')) {
      toRole = 'manager';
      const managerId = selectedChat.replace('manager-', '');
      const manager = managers.find(m => m.id === managerId);
      toName = manager?.displayName || 'Manager';
      toUserId = managerId;
    }

    const messageContent = `86 Request: We're out of ${itemName}`;
    addMessage('server', toRole, messageContent, currentUser.displayName, toName, '86-request', currentUser.id, toUserId);
    setShowQuickActions(false);
  };

  const handleSendMessage = (e, messageType = 'chat') => {
    e.preventDefault();
    if (!messageText.trim()) return;

    let toRole, toName, toUserId = null;
    if (selectedChat === 'kitchen') {
      toRole = 'kitchen';
      toName = 'Kitchen';
      toUserId = null; // Kitchen is role-based
    } else if (selectedChat.startsWith('manager-')) {
      toRole = 'manager';
      const managerId = selectedChat.replace('manager-', '');
      const manager = managers.find(m => m.id === managerId);
      toName = manager?.displayName || 'Manager';
      toUserId = managerId; // Manager-specific
    } else if (selectedChat.startsWith('server-')) {
      toRole = 'server';
      const serverId = selectedChat.replace('server-', '');
      const server = otherServers.find(s => s.id === serverId);
      toName = server?.displayName || 'Server';
      toUserId = serverId; // Server-specific
    }

    if (toRole) {
      addMessage('server', toRole, messageText, currentUser.displayName, toName, messageType, currentUser.id, toUserId);
      setMessageText('');
      setShowQuickActions(false);
    }
  };

  const getRecipientInfo = () => {
    return getRecipientInfoForChat(selectedChat);
  };

  const getConversation = () => {
    const recipient = getRecipientInfo();
    if (!recipient) return [];
    
    if (selectedChat.startsWith('server-')) {
      // For server-to-server, filter by userId
      const serverId = selectedChat.replace('server-', '');
      return messages.filter(m => {
        return (m.fromRole === 'server' && m.toRole === 'server' && 
                ((m.fromUserId === currentUser.id && m.toUserId === serverId) ||
                 (m.fromUserId === serverId && m.toUserId === currentUser.id)));
      }).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } else if (selectedChat.startsWith('manager-')) {
      // For manager chats, filter by userId
      const managerId = selectedChat.replace('manager-', '');
      return messages.filter(m => 
        ((m.fromRole === 'server' && m.toRole === 'manager' && m.fromUserId === currentUser.id && m.toUserId === managerId) || 
         (m.fromRole === 'manager' && m.toRole === 'server' && m.fromUserId === managerId && m.toUserId === currentUser.id))
      ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } else {
      // For role-based chats (kitchen) - no userId filtering
      return messages.filter(m => 
        ((m.fromRole === 'server' && m.toRole === recipient.role && m.fromUserId === currentUser.id) || 
         (m.fromRole === recipient.role && m.toRole === 'server' && m.toUserId === currentUser.id))
      ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }
  };

  // Filter chats based on search
  const filteredChats = {
    kitchen: searchQuery ? (selectedChat === 'kitchen' || 'kitchen'.includes(searchQuery.toLowerCase())) : true,
    managers: managers.filter(m => !searchQuery || m.displayName.toLowerCase().includes(searchQuery.toLowerCase())),
    servers: otherServers.filter(s => !searchQuery || s.displayName.toLowerCase().includes(searchQuery.toLowerCase()))
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Team Chat</h1>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden flex" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Chat List */}
        <div className="w-1/3 border-r border-gray-200 dark:border-slate-700 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-slate-700">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Chats</h2>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
              />
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {filteredChats.kitchen && (
              <button
                onClick={() => setSelectedChat('kitchen')}
                className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors relative ${
                  selectedChat === 'kitchen'
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : getUnreadCount('kitchen') > 0
                      ? 'bg-blue-50/50 dark:bg-blue-900/10'
                      : ''
                } ${
                  getUnreadCount('kitchen') > 0 ? 'border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <ChefHat className="text-kitchen-primary" size={24} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">Kitchen</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">All kitchen staff</p>
                  </div>
                  {getUnreadCount('kitchen') > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {getUnreadCount('kitchen')}
                    </span>
                  )}
                </div>
              </button>
            )}
            {filteredChats.managers.map(manager => {
              const chatId = `manager-${manager.id}`;
              const unread = getUnreadCount(chatId);
              return (
                <button
                  key={manager.id}
                  onClick={() => setSelectedChat(chatId)}
                  className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors relative ${
                    selectedChat === chatId 
                      ? 'bg-blue-50 dark:bg-blue-900/20' 
                      : unread > 0 
                        ? 'bg-blue-50/50 dark:bg-blue-900/10' 
                        : ''
                  } ${
                    unread > 0 ? 'border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <User className="text-brand-navy" size={20} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{manager.displayName}</p>
                    </div>
                    {unread > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unread}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
            {filteredChats.servers.map(server => {
              const chatId = `server-${server.id}`;
              const unread = getUnreadCount(chatId);
              return (
                <button
                  key={server.id}
                  onClick={() => setSelectedChat(chatId)}
                  className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors relative ${
                    selectedChat === chatId 
                      ? 'bg-blue-50 dark:bg-blue-900/20' 
                      : unread > 0 
                        ? 'bg-blue-50/50 dark:bg-blue-900/10' 
                        : ''
                  } ${
                    unread > 0 ? 'border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ClipboardList className="text-server-primary" size={20} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{server.displayName}</p>
                    </div>
                    {unread > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unread}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {getRecipientInfo() ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {getRecipientInfo()?.name}
                </h2>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {getConversation().map(message => {
                  const isMe = message.fromRole === 'server' && message.fromName === currentUser.displayName;
                  const is86Request = message.type === '86-request';
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          is86Request
                            ? 'bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-500 text-gray-900 dark:text-white'
                            : isMe
                              ? 'bg-server-primary text-white'
                              : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        {is86Request && (
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle size={14} className="text-orange-600" />
                            <span className="text-xs font-semibold text-orange-600">86 REQUEST</span>
                          </div>
                        )}
                        <p>{message.text}</p>
                        <p className={`text-xs mt-1 ${isMe ? 'text-white/70' : 'text-gray-500'}`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="border-t border-gray-200 dark:border-slate-700">
                {/* Quick Actions */}
                {showQuickActions && selectedChat === 'kitchen' && (
                  <div className="p-3 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Quick 86 Items</p>
                    <div className="flex flex-wrap gap-2">
                      {menuItems.slice(0, 6).map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handle86Request(item.name)}
                          className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 text-sm flex items-center gap-1"
                        >
                          <AlertTriangle size={12} />
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4">
                  <div className="flex gap-2">
                    {selectedChat === 'kitchen' && (
                      <button
                        type="button"
                        onClick={() => setShowQuickActions(!showQuickActions)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          showQuickActions
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200'
                        }`}
                        title="86 Request"
                      >
                        <AlertTriangle size={20} />
                      </button>
                    )}
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-server-primary text-white rounded-lg hover:bg-server-primary/90 transition-colors"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="mx-auto text-gray-300 dark:text-slate-600 mb-4" size={48} />
                <p className="text-gray-500 dark:text-gray-400">Select someone to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServerChat;