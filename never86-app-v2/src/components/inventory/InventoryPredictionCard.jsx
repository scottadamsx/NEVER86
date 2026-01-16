import { AlertTriangle, TrendingDown, Package, Clock } from 'lucide-react';

const InventoryPredictionCard = ({ prediction, onReorder }) => {
  const urgencyStyles = {
    critical: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      badge: 'bg-rose-500 text-white',
      icon: 'text-rose-500'
    },
    urgent: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      badge: 'bg-amber-500 text-white',
      icon: 'text-amber-500'
    },
    soon: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      badge: 'bg-yellow-500 text-slate-900',
      icon: 'text-yellow-500'
    },
    ok: {
      bg: 'bg-slate-800',
      border: 'border-slate-700',
      badge: 'bg-emerald-500/20 text-emerald-400',
      icon: 'text-emerald-500'
    }
  };

  const style = urgencyStyles[prediction.reorderUrgency] || urgencyStyles.ok;

  return (
    <div className={`rounded-xl border p-4 ${style.bg} ${style.border}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Package className={`w-5 h-5 ${style.icon}`} />
          <h4 className="font-medium text-white">{prediction.itemName}</h4>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${style.badge}`}>
          {prediction.reorderUrgency}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-slate-400 mb-1">Current Stock</p>
          <p className="text-lg font-semibold text-white">
            {prediction.currentStock} <span className="text-sm text-slate-400">{prediction.unit}</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Daily Usage</p>
          <p className="text-lg font-semibold text-white">
            {prediction.averageDailyUsage} <span className="text-sm text-slate-400">{prediction.unit}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-slate-400" />
        <span className="text-sm text-slate-300">
          {prediction.predictedDaysUntilOut 
            ? `${prediction.predictedDaysUntilOut} days until empty`
            : 'Usage data unavailable'}
        </span>
      </div>

      {prediction.reorderUrgency !== 'ok' && (
        <button
          onClick={() => onReorder?.(prediction)}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Reorder {prediction.recommendedReorderQuantity} {prediction.unit}
        </button>
      )}
    </div>
  );
};

export default InventoryPredictionCard;
