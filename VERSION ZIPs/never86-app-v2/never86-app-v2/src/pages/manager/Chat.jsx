import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { MessageSquare, Send, User } from 'lucide-react';
import { formatTime } from '../../utils/timeFormat';

function ManagerChat() {
  const { currentUser } = useAuth();
  const { staff, messages, addMessage } = useData();
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [readMessages, setReadMessages] = useState(new Set());

  const getUnreadCount = (staffMember) => {
    if (!staffMember) return 0;
    const conversation = getConversation(staffMember);
    return conversation.filter(m => !readMessages.has(m.id) && m.fromRole !== 'manager').length;
  };

  // Mark messages as read when staff is selected
  useEffect(() => {
    if (selectedStaff) {
      const conversation = getConversation(selectedStaff);
      const newReadIds = new Set(conversation.map(m => m.id));
      setReadMessages(prev => new Set([...prev, ...newReadIds]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStaff, messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedStaff) return;
    
    // Include userId for proper message filtering
    addMessage('manager', selectedStaff.role, messageText, currentUser.displayName, selectedStaff.displayName, 'chat', currentUser.id, selectedStaff.id);
    setMessageText('');
  };

  const getConversation = (staffMember) => {
    if (!staffMember || !messages) return [];
    try {
      return messages.filter(m => {
        if (!m) return false;
        // For role-based chats (kitchen), match by role only
        if (staffMember.role === 'kitchen') {
          return ((m.fromRole === 'manager' && m.toRole === 'kitchen') || 
                  (m.fromRole === 'kitchen' && m.toRole === 'manager'));
        }
        // For servers and other staff, match by userId for proper filtering
        // Check both directions: manager->staff and staff->manager
        const isManagerToStaff = m.fromRole === 'manager' && m.toRole === staffMember.role && 
                                  (m.toUserId === staffMember.id || (!m.toUserId && m.toName === staffMember.displayName));
        const isStaffToManager = m.fromRole === staffMember.role && m.toRole === 'manager' && 
                                 (m.fromUserId === staffMember.id || (!m.fromUserId && m.fromName === staffMember.displayName));
        return isManagerToStaff || isStaffToManager;
      }).sort((a, b) => {
        try {
          return new Date(a.timestamp) - new Date(b.timestamp);
        } catch {
          return 0;
        }
      });
    } catch (error) {
      console.error('Error getting conversation:', error);
      return [];
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Team Chat</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden flex" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Staff List */}
        <div className="w-1/3 border-r border-gray-200 dark:border-slate-700 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-slate-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">Staff Members</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {staff.filter(s => s && s.id !== currentUser?.id).map(member => {
              if (!member) return null;
              const conversation = getConversation(member);
              const lastMessage = conversation && conversation.length > 0 ? conversation[conversation.length - 1] : null;
              const unread = getUnreadCount(member);
              if (!member) return null;
              
              return (
                <button
                  key={member.id}
                  onClick={() => setSelectedStaff(member)}
                  className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors relative ${
                    selectedStaff?.id === member.id 
                      ? 'bg-blue-50 dark:bg-blue-900/20' 
                      : unread > 0 
                        ? 'bg-blue-50/50 dark:bg-blue-900/10' 
                        : ''
                  } ${
                    unread > 0 ? 'border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <User className="text-gray-500 dark:text-gray-400" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{member.displayName}</p>
                      {lastMessage && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {lastMessage.fromRole === 'manager' ? 'You: ' : `${lastMessage.fromName}: `}
                          {lastMessage.text}
                        </p>
                      )}
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
          {selectedStaff ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                <h2 className="font-semibold text-gray-900 dark:text-white">{selectedStaff.displayName}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">@{selectedStaff.username}</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {getConversation(selectedStaff).map(message => {
                  if (!message) return null;
                  const isMe = message.fromRole === 'manager';
                  return (
                    <div
                      key={message.id || `msg-${Math.random()}`}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isMe
                            ? 'bg-brand-navy text-white'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        <p>{message.text || ''}</p>
                        <p className={`text-xs mt-1 ${isMe ? 'text-white/70' : 'text-gray-500'}`}>
                          {message.timestamp ? formatTime(message.timestamp) : ''}
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
                    className="px-4 py-2 bg-brand-navy text-white rounded-lg hover:bg-brand-navy/90 transition-colors"
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
                <p className="text-gray-500 dark:text-gray-400">Select a staff member to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManagerChat;