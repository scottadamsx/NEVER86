import { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Star, PieChart } from 'lucide-react';
import KPICard from '../../components/analytics/KPICard';
import { mockMenuItems } from '../../data/mockDataExtended';
import { historicalOrders, timePunches } from '../../data/generatedHistoricalData';
import { generateProfitabilitySummary } from '../../lib/analytics/profitabilityCalculator';
import { calculateLaborCosts } from '../../lib/dataGeneration/schedulingGenerator';
import { restaurantConfig } from '../../lib/dataGeneration/config';

const Profitability = () => {
  const [sortBy, setSortBy] = useState('grossMargin');
  const [sortAsc, setSortAsc] = useState(false);

  // Calculate profitability data
  const profitData = useMemo(() => {
    // Calculate labor costs
    const laborWithCosts = timePunches.map(punch => ({
      ...punch,
      laborCost: punch.hoursWorked * restaurantConfig.laborCostPerHour
    }));

    return generateProfitabilitySummary(mockMenuItems, historicalOrders, laborWithCosts);
  }, []);

  // Sort menu items
  const sortedItems = useMemo(() => {
    return [...profitData.menuItems].sort((a, b) => {
      const diff = a[sortBy] - b[sortBy];
      return sortAsc ? diff : -diff;
    });
  }, [profitData.menuItems, sortBy, sortAsc]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  const recommendationIcons = {
    increase_price: { icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    promote: { icon: Star, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    review: { icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    maintain: { icon: TrendingUp, color: 'text-slate-400', bg: 'bg-slate-700' }
  };

  return (
    <div className="max-w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Profitability</h1>
          <p className="text-slate-400">Cost analysis and menu performance</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <KPICard 
            title="Total Revenue"
            value={`$${profitData.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
          />
          <KPICard 
            title="Total COGS"
            value={`$${profitData.totalCOGS.toLocaleString()}`}
            subtitle="Cost of Goods Sold"
          />
          <KPICard 
            title="Labor Cost"
            value={`$${profitData.totalLaborCost.toLocaleString()}`}
          />
          <KPICard 
            title="Food Cost %"
            value={`${profitData.foodCostPercent}%`}
            trend={profitData.foodCostPercent > 35 ? 'down' : 'up'}
            subtitle="Target: <35%"
          />
          <KPICard 
            title="Prime Cost %"
            value={`${profitData.primeCost.primeCostPercent}%`}
            trend={profitData.primeCost.isHealthy ? 'up' : 'down'}
            subtitle={`Target: <${profitData.primeCost.target}%`}
          />
        </div>

        {/* Insights */}
        {profitData.insights.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {profitData.insights.map((insight, i) => (
              <div 
                key={i}
                className={`rounded-xl border p-4 ${
                  insight.type === 'critical' 
                    ? 'bg-rose-500/10 border-rose-500/30' 
                    : insight.type === 'warning'
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-emerald-500/10 border-emerald-500/30'
                }`}
              >
                <h4 className="font-medium text-white mb-1">{insight.title}</h4>
                <p className="text-sm text-slate-300">{insight.message}</p>
                {insight.items && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {insight.items.slice(0, 3).map((item, j) => (
                      <span key={j} className="text-xs px-2 py-1 bg-slate-800/50 rounded text-slate-300">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Menu Profitability Table */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-700">
            <h3 className="font-semibold text-white">Menu Item Profitability</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-850">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase">Item</th>
                  <th 
                    className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('sellingPrice')}
                  >
                    Price {sortBy === 'sellingPrice' && (sortAsc ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('ingredientCost')}
                  >
                    COGS {sortBy === 'ingredientCost' && (sortAsc ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('grossMargin')}
                  >
                    Margin {sortBy === 'grossMargin' && (sortAsc ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('quantitySold')}
                  >
                    Sold {sortBy === 'quantitySold' && (sortAsc ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('contributionMargin')}
                  >
                    Contribution {sortBy === 'contributionMargin' && (sortAsc ? '↑' : '↓')}
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {sortedItems.map(item => {
                  const rec = recommendationIcons[item.recommendation];
                  const Icon = rec.icon;
                  
                  return (
                    <tr key={item.menuItemId} className="hover:bg-slate-750">
                      <td className="px-5 py-3">
                        <div>
                          <p className="text-white font-medium">{item.itemName}</p>
                          <p className="text-xs text-slate-400 capitalize">{item.category}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-300">${item.sellingPrice.toFixed(2)}</td>
                      <td className="px-5 py-3 text-slate-300">${item.ingredientCost.toFixed(2)}</td>
                      <td className="px-5 py-3">
                        <span className={`font-medium ${
                          item.grossMargin >= 70 ? 'text-emerald-400' :
                          item.grossMargin >= 60 ? 'text-slate-300' :
                          'text-rose-400'
                        }`}>
                          {item.grossMargin.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-300">{item.quantitySold}</td>
                      <td className="px-5 py-3 text-emerald-400 font-medium">
                        ${item.contributionMargin.toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded ${rec.bg}`}>
                          <Icon className={`w-3 h-3 ${rec.color}`} />
                          <span className={`text-xs font-medium capitalize ${rec.color}`}>
                            {item.recommendation.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};

export default Profitability;
