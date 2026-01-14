import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { MessageSquare, Send, User, ClipboardList } from 'lucide-react';
import { formatTime } from '../../utils/timeFormat';

function KitchenChat() {
  const { currentUser } = useAuth();
  const { staff, messages, addMessage } = useData();
  const [selectedChat, setSelectedChat] = useState('servers');
  const [messageText, setMessageText] = useState('');
  const [readMessages, setReadMessages] = useState(new Set());

  const servers = staff.filter(s => s.role === 'server');
  const managers = staff.filter(s => s.role === 'manager');

  const getRecipientInfoForChat = (chatId) => {
    if (chatId === 'servers') {
      return { role: 'server', name: 'Servers' };
    }
    if (chatId.startsWith('manager-')) {
      const managerId = chatId.replace('manager-', '');
      const manager = managers.find(m => m.id === managerId);
      return { role: 'manager', name: manager?.displayName || 'Manager' };
    }
    return null;
  };

  const getConversationForChat = (chatId) => {
    const recipient = getRecipientInfoForChat(chatId);
    if (!recipient) return [];
    return messages.filter(m => {
      const isFromKitchenToRecipient = m.fromRole === 'kitchen' && m.toRole === recipient.role;
      const isFromRecipientToKitchen = m.fromRole === recipient.role && m.toRole === 'kitchen';
      return isFromKitchenToRecipient || isFromRecipientToKitchen;
    }).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  const getUnreadCount = (chatId) => {
    const conversation = getConversationForChat(chatId);
    return conversation.filter(m => !readMessages.has(m.id) && m.fromRole !== 'kitchen').length;
  };

  // Mark messages as read when chat is selected
  useEffect(() => {
    const conversation = getConversation();
    const newReadIds = new Set(conversation.map(m => m.id));
    setReadMessages(prev => new Set([...prev, ...newReadIds]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat, messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    let toRole, toName;
    if (selectedChat === 'servers') {
      toRole = 'server';
      toName = 'Servers';
    } else if (selectedChat.startsWith('manager-')) {
      toRole = 'manager';
      const managerId = selectedChat.replace('manager-', '');
      toName = managers.find(m => m.id === managerId)?.displayName || 'Manager';
    }
    
    if (toRole) {
      addMessage('kitchen', toRole, messageText, currentUser.displayName, toName);
      setMessageText('');
    }
  };

  const getRecipientInfo = () => {
    if (selectedChat === 'servers') {
      return { role: 'server', name: 'Servers' };
    }
    if (selectedChat.startsWith('manager-')) {
      const managerId = selectedChat.replace('manager-', '');
      const manager = managers.find(m => m.id === managerId);
      return { role: 'manager', name: manager?.displayName || 'Manager' };
    }
    return null;
  };

  const getConversation = () => {
    const recipient = getRecipientInfo();
    if (!recipient) return [];
    return messages.filter(m => {
      // Check if message matches the conversation
      const isFromKitchenToRecipient = m.fromRole === 'kitchen' && m.toRole === recipient.role;
      const isFromRecipientToKitchen = m.fromRole === recipient.role && m.toRole === 'kitchen';
      return isFromKitchenToRecipient || isFromRecipientToKitchen;
    }).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Team Chat</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden flex" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Chat List */}
        <div className="w-1/3 border-r border-gray-200 dark:border-slate-700 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-slate-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">Chats</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            <button
              onClick={() => setSelectedChat('servers')}
              className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors relative ${
                selectedChat === 'servers' 
                  ? 'bg-blue-50 dark:bg-blue-900/20' 
                  : getUnreadCount('servers') > 0 
                    ? 'bg-orange-50/50 dark:bg-orange-900/10' 
                    : ''
              } ${
                getUnreadCount('servers') > 0 ? 'border-l-4 border-orange-500' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <ClipboardList className="text-server-primary" size={24} />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Servers</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">All servers</p>
                </div>
                {getUnreadCount('servers') > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {getUnreadCount('servers')}
                  </span>
                )}
              </div>
            </button>
            {managers.map(manager => {
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
                        ? 'bg-orange-50/50 dark:bg-orange-900/10' 
                        : ''
                  } ${
                    unread > 0 ? 'border-l-4 border-orange-500' : ''
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
                  const isMe = message.fromRole === 'kitchen';
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isMe
                            ? 'bg-kitchen-primary text-white'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className={`text-xs mt-1 ${isMe ? 'text-white/70' : 'text-gray-500'}`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-slate-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-kitchen-primary text-white rounded-lg hover:bg-kitchen-primary/90 transition-colors"
                  >
                    <Send size={20} />
                  </button>
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

export default KitchenChat;