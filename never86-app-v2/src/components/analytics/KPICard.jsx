import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

const KPICard = ({ 
  title, 
  value, 
  subtitle,
  trend = 'neutral', 
  trendValue,
  icon: Icon,
  onClick,
  className = ''
}) => {
  const trendConfig = {
    up: { color: 'text-emerald-600 dark:text-emerald-400', Icon: TrendingUp },
    down: { color: 'text-rose-600 dark:text-rose-400', Icon: TrendingDown },
    neutral: { color: 'text-muted-foreground', Icon: Minus }
  };

  const TrendIcon = trendConfig[trend].Icon;

  return (
    <Card 
      className={`overflow-hidden transition-all hover:shadow-md ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          {Icon && (
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="w-4 h-4 text-primary" />
            </div>
          )}
        </div>
        
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold tracking-tight">{value}</span>
          {trendValue !== undefined && (
            <div className={`flex items-center gap-1 text-sm ${trendConfig[trend].color} mb-0.5`}>
              <TrendIcon className="w-3.5 h-3.5" />
              <span className="font-medium">{Math.abs(trendValue)}%</span>
            </div>
          )}
        </div>
        
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1.5">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default KPICard;
