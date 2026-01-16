import { ShoppingCart, Check, X, AlertTriangle } from 'lucide-react';

const ReorderQueue = ({ notifications, onApprove, onDismiss }) => {
  const urgencyBadge = {
    critical: 'bg-rose-500 text-white',
    urgent: 'bg-amber-500 text-white',
    soon: 'bg-yellow-500/20 text-yellow-400'
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-slate-400" />
          <h3 className="font-semibold text-white">Reorder Queue</h3>
        </div>
        <span className="text-sm text-slate-400">
          {notifications.length} pending
        </span>
      </div>

      {notifications.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="text-slate-400">No pending reorders</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-700/50">
          {notifications.map(notification => (
            <div key={notification.id} className="px-5 py-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-white">{notification.itemName}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${urgencyBadge[notification.urgency]}`}>
                      {notification.urgency}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{notification.reason}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div>
                  <span className="text-sm text-slate-400">Recommend: </span>
                  <span className="text-white font-medium">
                    {notification.recommendedQuantity} {notification.unit}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDismiss?.(notification.id)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                  <button
                    onClick={() => onApprove?.(notification.id)}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReorderQueue;
