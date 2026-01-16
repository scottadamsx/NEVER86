import { useState, useEffect } from 'react';
import { Clock, LogIn, LogOut, Coffee, User } from 'lucide-react';

const TimeClock = ({ 
  currentUser, 
  currentPunch,
  onClockIn,
  onClockOut,
  onStartBreak,
  onEndBreak
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnBreak, setIsOnBreak] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  const formatDuration = (startTime) => {
    if (!startTime) return '--:--:--';
    const start = new Date(startTime);
    const diff = currentTime - start;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isClockedIn = !!currentPunch && !currentPunch.clockOutTime;

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      {/* Current Time Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-8 text-center">
        <p className="text-indigo-200 text-sm mb-1">Current Time</p>
        <p className="text-4xl font-mono font-bold text-white">
          {formatTime(currentTime)}
        </p>
        <p className="text-indigo-200 text-sm mt-2">
          {currentTime.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-slate-700 flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-slate-400" />
        </div>
        <div>
          <p className="font-medium text-white">{currentUser?.displayName || 'Guest'}</p>
          <p className="text-sm text-slate-400 capitalize">{currentUser?.role || 'Staff'}</p>
        </div>
      </div>

      {/* Shift Status */}
      {isClockedIn && (
        <div className="px-6 py-4 border-b border-slate-700 bg-slate-850">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Shift Duration</p>
              <p className="text-2xl font-mono font-semibold text-emerald-400">
                {formatDuration(currentPunch.clockInTime)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Clocked In</p>
              <p className="text-sm text-white">
                {new Date(currentPunch.clockInTime).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-6 space-y-3">
        {!isClockedIn ? (
          <button
            onClick={onClockIn}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <LogIn className="w-5 h-5" />
            Clock In
          </button>
        ) : (
          <>
            <button
              onClick={onClockOut}
              className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Clock Out
            </button>
            
            <button
              onClick={isOnBreak ? onEndBreak : onStartBreak}
              className={`w-full py-3 border rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
                isOnBreak 
                  ? 'border-amber-500 text-amber-400 hover:bg-amber-500/10' 
                  : 'border-slate-600 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Coffee className="w-4 h-4" />
              {isOnBreak ? 'End Break' : 'Start Break'}
            </button>
          </>
        )}
      </div>

      {/* Today's Summary */}
      <div className="px-6 py-4 border-t border-slate-700 bg-slate-850">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Today's Hours</p>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Worked</span>
          <span className="font-mono text-white">
            {isClockedIn ? formatDuration(currentPunch.clockInTime) : '00:00:00'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TimeClock;
