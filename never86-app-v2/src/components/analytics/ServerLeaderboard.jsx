import { Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';

const ServerLeaderboard = ({ servers, metric = 'totalSales', title = 'Top Performers' }) => {
  const formatValue = (server) => {
    switch (metric) {
      case 'totalSales':
        return `$${server.totalSales.toLocaleString()}`;
      case 'totalTips':
        return `$${server.totalTips.toLocaleString()}`;
      case 'averageCheck':
        return `$${server.averageCheck.toFixed(2)}`;
      case 'tableCount':
        return `${server.tableCount} tables`;
      default:
        return server[metric];
    }
  };

  const getMedal = (index) => {
    const medals = ['🥇', '🥈', '🥉'];
    return medals[index] || null;
  };

  const getRankBg = (index) => {
    if (index === 0) return 'bg-amber-500/10';
    if (index === 1) return 'bg-slate-400/10';
    if (index === 2) return 'bg-orange-600/10';
    return '';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="w-5 h-5 text-amber-500" />
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2">
          {servers.map((server, index) => (
            <div 
              key={server.serverId}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-muted/50 ${getRankBg(index)}`}
            >
              <span className="w-8 text-lg text-center">
                {getMedal(index) || <span className="text-muted-foreground text-sm font-medium">#{index + 1}</span>}
              </span>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{server.name}</p>
                <p className="text-sm text-muted-foreground">
                  {server.tableCount} tables · ${server.averageCheck.toFixed(0)} avg
                </p>
              </div>
              
              <Badge variant="success" className="font-semibold">
                {formatValue(server)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServerLeaderboard;
