function SkeletonLoader({ lines = 3, className = '' }) {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
      ))}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
      <div className="animate-pulse">
        <div className="h-12 bg-gray-100 dark:bg-slate-700"></div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-slate-600 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export default SkeletonLoader;

