/**
 * COMPREHENSIVE REPORTING & ANALYTICS DASHBOARD
 * 
 * Complete revamp of the reporting system with:
 * - Tab-based navigation (Overview, Revenue, Servers, Menu, Operations)
 * - Custom date range selection
 * - Period-over-period comparisons
 * - Export functionality (CSV)
 * - Detailed breakdowns and insights
 * - Better visualizations with multiple chart types
 * - Actionable insights and recommendations
 * 
 * FEATURES:
 * - Overview: High-level KPIs with trend indicators and comparisons
 * - Revenue: Detailed revenue analysis with day-of-week breakdowns
 * - Servers: Server performance metrics, leaderboards, and comparisons
 * - Menu: Menu item performance, popularity rankings, category analysis
 * - Operations: Table turnover, efficiency metrics, peak hours analysis
 */

import { useState, useMemo } from 'react';
import { 
  DollarSign, Users, Clock, TrendingUp, BarChart3, Calendar,
  Download, FileText, ArrowUpRight, ArrowDownRight, Activity,
  UtensilsCrossed, Target, AlertCircle, CheckCircle, X, Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import KPICard from '../../components/analytics/KPICard';
import ServerLeaderboard from '../../components/analytics/ServerLeaderboard';
import RevenueChart from '../../components/analytics/RevenueChart';
import { 
  historicalOrders, 
  dailySalesSummary, 
  serverPerformance,
  dataSummary 
} from '../../data/generatedHistoricalData';
import { mockStaff, mockMenuItems } from '../../data/mockDataExtended';
import { 
  calculateServerLeaderboard, 
  calculatePeakHours,
  calculateRevenueMetrics,
  calculateMenuPerformance,
  calculateHourlyRevenue
} from '../../lib/analytics/kpiCalculator';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const Analytics = () => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  // Active tab: 'overview', 'revenue', 'servers', 'menu', 'operations'
  const [activeTab, setActiveTab] = useState('overview');
  
  // Date range selection
  const [dateRange, setDateRange] = useState('30'); // days
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [useCustomDates, setUseCustomDates] = useState(false);
  
  // Comparison toggle - show period-over-period comparison
  const [showComparison, setShowComparison] = useState(false);

  // ============================================
  // DATE RANGE CALCULATION
  // ============================================
  
  /**
   * Calculate date range based on selection
   * Returns start and end dates for current period and previous period (for comparison)
   */
  const dateRangeData = useMemo(() => {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999); // End of today
    
    let startDate;
    
    if (useCustomDates && customStartDate && customEndDate) {
      // Custom date range
      startDate = new Date(customStartDate);
      startDate.setHours(0, 0, 0, 0);
      const customEnd = new Date(customEndDate);
      customEnd.setHours(23, 59, 59, 999);
      return {
        startDate,
        endDate: customEnd,
        prevStartDate: null,
        prevEndDate: null,
        daysDiff: Math.ceil((customEnd - startDate) / (1000 * 60 * 60 * 24)) + 1
      };
    } else {
      // Preset date range
      startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));
      startDate.setHours(0, 0, 0, 0);
    }
    
    // Calculate previous period for comparison
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const prevEndDate = new Date(startDate);
    prevEndDate.setDate(prevEndDate.getDate() - 1);
    prevEndDate.setHours(23, 59, 59, 999);
    const prevStartDate = new Date(prevEndDate);
    prevStartDate.setDate(prevStartDate.getDate() - daysDiff + 1);
    prevStartDate.setHours(0, 0, 0, 0);
    
    return {
      startDate,
      endDate,
      prevStartDate,
      prevEndDate,
      daysDiff
    };
  }, [dateRange, useCustomDates, customStartDate, customEndDate]);

  // ============================================
  // DATA FILTERING
  // ============================================
  
  /**
   * Filter orders and sales based on selected date range
   */
  const filteredData = useMemo(() => {
    const { startDate, endDate, prevStartDate, prevEndDate } = dateRangeData;
    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    const filteredOrders = historicalOrders.filter(o => {
      const orderDate = o.createdAt.split('T')[0];
      return orderDate >= startStr && orderDate <= endStr;
    });

    const filteredSales = dailySalesSummary.filter(d => 
      d.date >= startStr && d.date <= endStr
    );

    // Previous period data (for comparison)
    const prevOrders = (showComparison && prevStartDate && prevEndDate) ? historicalOrders.filter(o => {
      const orderDate = o.createdAt.split('T')[0];
      const prevStartStr = prevStartDate.toISOString().split('T')[0];
      const prevEndStr = prevEndDate.toISOString().split('T')[0];
      return orderDate >= prevStartStr && orderDate <= prevEndStr;
    }) : [];

    const prevSales = (showComparison && prevStartDate && prevEndDate) ? dailySalesSummary.filter(d => {
      const prevStartStr = prevStartDate.toISOString().split('T')[0];
      const prevEndStr = prevEndDate.toISOString().split('T')[0];
      return d.date >= prevStartStr && d.date <= prevEndStr;
    }) : [];

    return { 
      orders: filteredOrders, 
      sales: filteredSales,
      prevOrders,
      prevSales
    };
  }, [dateRangeData, showComparison]);

  // ============================================
  // KPI CALCULATIONS
  // ============================================
  
  /**
   * Calculate comprehensive KPIs for the selected period
   * Includes period-over-period comparison if enabled
   */
  const kpis = useMemo(() => {
    const { orders, sales, prevOrders, prevSales } = filteredData;
    const { startDate, endDate, prevStartDate, prevEndDate } = dateRangeData;
    
    // Use the enhanced revenue metrics calculator
    const revenueMetrics = calculateRevenueMetrics(
      orders, 
      sales, 
      startDate, 
      endDate,
      showComparison && prevStartDate ? prevStartDate : null,
      showComparison && prevEndDate ? prevEndDate : null
    );

    return {
      ...revenueMetrics,
      // Additional calculated metrics
      totalOrders: orders.length,
      avgTipPercent: revenueMetrics.avgTipPercent
    };
  }, [filteredData, dateRangeData, showComparison]);

  // ============================================
  // ADDITIONAL METRICS
  // ============================================
  
  // Server leaderboard with enhanced metrics
  const leaderboard = useMemo(() => {
    const base = calculateServerLeaderboard(filteredData.orders, mockStaff);
    // Add average check and tip percentage
    return base.map(server => {
      const serverOrders = filteredData.orders.filter(o => o.serverId === server.id);
      const totalRevenue = serverOrders.reduce((sum, o) => {
        const orderTotal = o.total || (o.items ? o.items.reduce((s, item) => s + item.price, 0) : 0);
        return sum + orderTotal;
      }, 0);
      const totalTips = serverOrders.reduce((sum, o) => sum + (o.tip || 0), 0);
      
      return {
        ...server,
        avgCheck: server.tables > 0 ? Math.round((totalRevenue / server.tables) * 100) / 100 : 0,
        tipPercent: totalRevenue > 0 ? Math.round((totalTips / totalRevenue) * 100 * 10) / 10 : 0,
        totalSales: totalRevenue,
        totalTips: totalTips
      };
    });
  }, [filteredData]);

  // Peak hours with revenue data
  const peakHours = useMemo(() => {
    const { startDate, endDate } = dateRangeData;
    return calculateHourlyRevenue(filteredData.orders, startDate, endDate);
  }, [filteredData, dateRangeData]);

  // Menu item performance
  const menuPerformance = useMemo(() => {
    const { startDate, endDate } = dateRangeData;
    return calculateMenuPerformance(filteredData.orders, mockMenuItems, startDate, endDate);
  }, [filteredData, dateRangeData]);

  // Revenue by day of week (already calculated in kpis.revenueByDay)
  const revenueByDay = kpis.revenueByDay || {};

  // ============================================
  // SAFE DATA VARIABLES (for null/undefined safety)
  // ============================================
  
  // Ensure arrays are always defined and are actual arrays
  const safeSales = Array.isArray(filteredData.sales) ? filteredData.sales : [];
  const safeLeaderboard = Array.isArray(leaderboard) ? leaderboard : [];
  const safeMenuPerformance = Array.isArray(menuPerformance) ? menuPerformance : [];
  const safePeakHours = Array.isArray(peakHours) ? peakHours : [];

  // ============================================
  // EXPORT FUNCTIONALITY
  // ============================================
  
  /**
   * Export report data to CSV
   * Creates a downloadable CSV file with all key metrics
   */
  const handleExportCSV = () => {
    const { startDate, endDate } = dateRangeData;
    
    // Create CSV content
    let csv = 'NEVER86 Analytics Report\n';
    csv += `Period: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}\n`;
    csv += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    // KPIs Section
    csv += 'KEY PERFORMANCE INDICATORS\n';
    csv += 'Metric,Value\n';
    csv += `Total Revenue,$${kpis.totalRevenue.toLocaleString()}\n`;
    csv += `Total Tips,$${kpis.totalTips.toLocaleString()}\n`;
    csv += `Total Tables,${kpis.totalTables}\n`;
    csv += `Total Orders,${kpis.totalOrders}\n`;
    csv += `Average Check,$${kpis.avgCheck}\n`;
    csv += `Average Tip %,${kpis.avgTipPercent}%\n`;
    csv += `Average Turnover,${kpis.avgTurnover} min\n`;
    csv += `Average Guests per Table,${kpis.avgGuestsPerTable}\n`;
    csv += `Average Daily Revenue,$${kpis.avgDailyRevenue}\n`;
    csv += `Average Daily Tables,${kpis.avgDailyTables}\n\n`;
    
    // Comparison Section (if enabled)
    if (showComparison && kpis.previousPeriod) {
      csv += 'PERIOD COMPARISON\n';
      csv += 'Metric,Current,Previous,Change,Change %\n';
      csv += `Revenue,$${kpis.totalRevenue},$${kpis.previousPeriod.totalRevenue},$${kpis.previousPeriod.revenueChange},${kpis.previousPeriod.revenueChangePercent.toFixed(1)}%\n`;
      csv += `Tables,${kpis.totalTables},${kpis.previousPeriod.totalTables},${kpis.previousPeriod.tablesChange},${kpis.previousPeriod.tablesChangePercent.toFixed(1)}%\n`;
      csv += `Avg Check,$${kpis.avgCheck},$${kpis.previousPeriod.avgCheck},$${kpis.previousPeriod.avgCheckChange},${kpis.previousPeriod.avgCheckChangePercent.toFixed(1)}%\n\n`;
    }
    
    // Top Servers Section
    csv += 'TOP SERVERS\n';
    csv += 'Rank,Name,Revenue,Tables,Tips,Avg Check,Tip %\n';
    safeLeaderboard.slice(0, 10).forEach((server, idx) => {
      csv += `${idx + 1},${server.name},$${server.revenue.toFixed(2)},${server.tables},$${server.tips.toFixed(2)},$${server.avgCheck},${server.tipPercent}%\n`;
    });
    csv += '\n';
    
    // Top Menu Items Section
    csv += 'TOP MENU ITEMS\n';
    csv += 'Rank,Item,Category,Quantity Sold,Total Revenue,Avg Price\n';
    safeMenuPerformance.slice(0, 10).forEach((item, idx) => {
      csv += `${idx + 1},${item.name},${item.category},${item.quantitySold},$${item.totalRevenue.toFixed(2)},$${item.avgPrice}\n`;
    });
    
    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `never86-report-${startDate.toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ============================================
  // RENDER FUNCTIONS FOR EACH TAB
  // ============================================
  
  /**
   * Render Overview Tab
   * Shows high-level KPIs, trends, and key insights
   */
  const renderOverview = () => (
    <>
      {/* Enhanced KPI Cards with Comparisons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard 
          title="Total Revenue"
          value={`$${(kpis.totalRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
          trend={kpis.previousPeriod?.revenueChangePercent >= 0 ? 'up' : kpis.previousPeriod?.revenueChangePercent < 0 ? 'down' : 'neutral'}
          trendValue={kpis.previousPeriod ? Math.abs(kpis.previousPeriod.revenueChangePercent) : undefined}
          subtitle={showComparison && kpis.previousPeriod 
            ? `${kpis.previousPeriod.revenueChange >= 0 ? '+' : ''}$${(kpis.previousPeriod.revenueChange || 0).toFixed(0)} vs previous`
            : `${dateRangeData.daysDiff} day total`}
        />
        <KPICard 
          title="Total Tips"
          value={`$${(kpis.totalTips || 0).toLocaleString()}`}
          icon={TrendingUp}
          trend="up"
          subtitle={`${kpis.avgTipPercent || 0}% of revenue`}
        />
        <KPICard 
          title="Tables Served"
          value={(kpis.totalTables || 0).toLocaleString()}
          icon={Users}
          trend={kpis.previousPeriod?.tablesChangePercent >= 0 ? 'up' : kpis.previousPeriod?.tablesChangePercent < 0 ? 'down' : 'neutral'}
          trendValue={kpis.previousPeriod ? Math.abs(kpis.previousPeriod.tablesChangePercent) : undefined}
          subtitle={showComparison && kpis.previousPeriod 
            ? `${(kpis.previousPeriod.tablesChange || 0) >= 0 ? '+' : ''}${kpis.previousPeriod.tablesChange || 0} vs previous`
            : `${kpis.avgGuestsPerTable || 0} avg guests/table`}
        />
        <KPICard 
          title="Avg Check"
          value={`$${(kpis.avgCheck || 0).toFixed(2)}`}
          icon={BarChart3}
          trend={kpis.previousPeriod?.avgCheckChangePercent >= 0 ? 'up' : kpis.previousPeriod?.avgCheckChangePercent < 0 ? 'down' : 'neutral'}
          trendValue={kpis.previousPeriod ? Math.abs(kpis.previousPeriod.avgCheckChangePercent) : undefined}
          subtitle={showComparison && kpis.previousPeriod 
            ? `${(kpis.previousPeriod.avgCheckChange || 0) >= 0 ? '+' : ''}$${(kpis.previousPeriod.avgCheckChange || 0).toFixed(2)} vs previous`
            : 'Per table average'}
        />
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KPICard 
          title="Avg Turnover"
          value={`${kpis.avgTurnover || 0} min`}
          icon={Clock}
          trend="down"
          subtitle="Lower is better"
        />
        <KPICard 
          title="Daily Revenue"
          value={`$${(kpis.avgDailyRevenue || 0).toLocaleString()}`}
          icon={Activity}
          subtitle="Average per day"
        />
        <KPICard 
          title="Total Orders"
          value={(kpis.totalOrders || 0).toLocaleString()}
          icon={FileText}
          subtitle={`${(kpis.avgDailyTables || 0).toFixed(1)} tables/day avg`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RevenueChart 
            data={safeSales.slice(-30)}
            title="Revenue & Tips Trend"
          />
        </div>
        <ServerLeaderboard 
          servers={safeLeaderboard.slice(0, 5).map(s => ({
            serverId: s.id,
            name: s.name,
            totalSales: s.revenue,
            totalTips: s.tips,
            tableCount: s.tables,
            averageCheck: s.avgCheck
          }))}
          title="Top Servers"
        />
      </div>

      {/* Peak Hours with Revenue */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Peak Hours Analysis</CardTitle>
          <CardDescription>Order volume and revenue by hour of day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto mb-4">
            <div className="flex gap-2 min-w-max">
              {safePeakHours.length > 0 ? safePeakHours.map(hour => {
                const maxRevenue = Math.max(...safePeakHours.map(h => h.revenue || 0));
                const height = maxRevenue > 0 ? ((hour.revenue || 0) / maxRevenue) * 100 : 0;
                
                return (
                  <div key={hour.hour} className="flex flex-col items-center min-w-[60px]">
                    <div className="h-32 w-full flex items-end relative">
                      <div 
                        className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t transition-all"
                        style={{ height: `${height}%` }}
                        title={`$${hour.revenue.toFixed(0)} - ${hour.orders} orders`}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 text-center whitespace-nowrap">
                      {hour.label}
                    </span>
                    <span className="text-xs font-medium text-primary mt-0.5">
                      ${(hour.revenue || 0) > 0 ? (hour.revenue || 0).toFixed(0) : '0'}
                    </span>
                  </div>
                );
              }) : (
                <div className="w-full text-center text-muted-foreground py-8">
                  No data available
                </div>
              )}
            </div>
          </div>
          {safePeakHours.length > 0 && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Peak Hour</p>
                <p className="text-lg font-semibold">
                  {safePeakHours.reduce((max, h) => (h.revenue || 0) > (max.revenue || 0) ? h : max, safePeakHours[0])?.label || 'N/A'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-lg font-semibold">
                  {safePeakHours.reduce((sum, h) => sum + (h.orders || 0), 0)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Hourly Avg</p>
                <p className="text-lg font-semibold">
                  ${Math.round(safePeakHours.reduce((sum, h) => sum + (h.revenue || 0), 0) / 24)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );

  /**
   * Render Revenue Tab
   * Detailed revenue analysis with day-of-week breakdowns and trends
   */
  const renderRevenue = () => {
    // Convert revenueByDay object to chart data with proper day order
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const revenueByDayChart = dayOrder.map(day => {
      const data = revenueByDay[day] || { revenue: 0, tables: 0, avgRevenue: 0 };
      return {
        day: day.substring(0, 3), // Short form: Mon, Tue, etc.
        fullDay: day,
        revenue: data.revenue || 0,
        tables: data.tables || 0,
        avgRevenue: data.avgRevenue || 0
      };
    });

    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue by Day of Week */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Day of Week</CardTitle>
              <CardDescription>Average revenue per day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueByDayChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Bar dataKey="avgRevenue" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Daily Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Revenue Trend</CardTitle>
              <CardDescription>Revenue over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={safeSales.slice(-30)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip 
                    formatter={(value) => `$${value.toLocaleString()}`}
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <Line type="monotone" dataKey="totalRevenue" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="totalTips" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Breakdown Table */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>Detailed revenue metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-semibold">Metric</th>
                    <th className="text-right p-3 text-sm font-semibold">Value</th>
                    {showComparison && kpis.previousPeriod && (
                      <>
                        <th className="text-right p-3 text-sm font-semibold">Previous</th>
                        <th className="text-right p-3 text-sm font-semibold">Change</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Total Revenue</td>
                    <td className="p-3 text-right font-semibold">${kpis.totalRevenue.toLocaleString()}</td>
                    {showComparison && kpis.previousPeriod && (
                      <>
                        <td className="p-3 text-right">${kpis.previousPeriod.totalRevenue.toLocaleString()}</td>
                        <td className={`p-3 text-right font-semibold ${kpis.previousPeriod.revenueChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {kpis.previousPeriod.revenueChange >= 0 ? '+' : ''}${kpis.previousPeriod.revenueChange.toFixed(2)}
                          <span className="ml-2 text-sm">
                            ({kpis.previousPeriod.revenueChangePercent >= 0 ? '+' : ''}{kpis.previousPeriod.revenueChangePercent.toFixed(1)}%)
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Total Tips</td>
                    <td className="p-3 text-right font-semibold">${kpis.totalTips.toLocaleString()}</td>
                    {showComparison && kpis.previousPeriod && (
                      <>
                        <td className="p-3 text-right">-</td>
                        <td className="p-3 text-right">-</td>
                      </>
                    )}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Average Check</td>
                    <td className="p-3 text-right font-semibold">${kpis.avgCheck.toFixed(2)}</td>
                    {showComparison && kpis.previousPeriod && (
                      <>
                        <td className="p-3 text-right">${kpis.previousPeriod.avgCheck.toFixed(2)}</td>
                        <td className={`p-3 text-right font-semibold ${kpis.previousPeriod.avgCheckChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {kpis.previousPeriod.avgCheckChange >= 0 ? '+' : ''}${kpis.previousPeriod.avgCheckChange.toFixed(2)}
                          <span className="ml-2 text-sm">
                            ({kpis.previousPeriod.avgCheckChangePercent >= 0 ? '+' : ''}{kpis.previousPeriod.avgCheckChangePercent.toFixed(1)}%)
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Average Daily Revenue</td>
                    <td className="p-3 text-right font-semibold">${kpis.avgDailyRevenue.toLocaleString()}</td>
                    {showComparison && kpis.previousPeriod && (
                      <>
                        <td className="p-3 text-right">-</td>
                        <td className="p-3 text-right">-</td>
                      </>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </>
    );
  };

  /**
   * Render Servers Tab
   * Server performance metrics, leaderboards, and detailed comparisons
   */
  const renderServers = () => (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Server Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Server Leaderboard</CardTitle>
            <CardDescription>Top performers by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {safeLeaderboard.slice(0, 10).map((server, index) => (
                <div key={server.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{server.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {server.tables} tables · ${server.avgCheck.toFixed(0)} avg
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${server.revenue.toFixed(0)}</p>
                    <p className="text-sm text-emerald-600">${server.tips.toFixed(0)} tips</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Server Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Server Performance</CardTitle>
            <CardDescription>Revenue comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={safeLeaderboard.slice(0, 8)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(v) => `$${v}`} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Server Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Server Statistics</CardTitle>
          <CardDescription>Complete performance breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-semibold">Server</th>
                  <th className="text-right p-3 text-sm font-semibold">Revenue</th>
                  <th className="text-right p-3 text-sm font-semibold">Tables</th>
                  <th className="text-right p-3 text-sm font-semibold">Tips</th>
                  <th className="text-right p-3 text-sm font-semibold">Avg Check</th>
                  <th className="text-right p-3 text-sm font-semibold">Tip %</th>
                </tr>
              </thead>
              <tbody>
                {safeLeaderboard.map((server) => (
                  <tr key={server.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{server.name}</td>
                    <td className="p-3 text-right">${server.revenue.toFixed(2)}</td>
                    <td className="p-3 text-right">{server.tables}</td>
                    <td className="p-3 text-right text-emerald-600">${server.tips.toFixed(2)}</td>
                    <td className="p-3 text-right">${server.avgCheck.toFixed(2)}</td>
                    <td className="p-3 text-right">{server.tipPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );

  /**
   * Render Menu Tab
   * Menu item performance, popularity rankings, and category analysis
   */
  const renderMenu = () => {
    // Calculate category totals
    const categoryStats = {};
    if (safeMenuPerformance.length > 0) {
      safeMenuPerformance.forEach(item => {
        if (!categoryStats[item.category]) {
          categoryStats[item.category] = { quantity: 0, revenue: 0, items: 0 };
        }
        categoryStats[item.category].quantity += item.quantitySold || 0;
        categoryStats[item.category].revenue += item.totalRevenue || 0;
        categoryStats[item.category].items += 1;
      });
    }

    const categoryChartData = Object.entries(categoryStats).map(([category, stats]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      revenue: stats.revenue,
      quantity: stats.quantity
    }));

    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Category Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Category</CardTitle>
              <CardDescription>Total revenue per menu category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    dataKey="revenue"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][index % 6]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Items Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Menu Items</CardTitle>
              <CardDescription>By quantity sold</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={safeMenuPerformance.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantitySold" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Menu Item Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Menu Item Performance</CardTitle>
            <CardDescription>Complete breakdown of all menu items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-semibold">Item</th>
                    <th className="text-left p-3 text-sm font-semibold">Category</th>
                    <th className="text-right p-3 text-sm font-semibold">Price</th>
                    <th className="text-right p-3 text-sm font-semibold">Quantity Sold</th>
                    <th className="text-right p-3 text-sm font-semibold">Total Revenue</th>
                    <th className="text-right p-3 text-sm font-semibold">Avg Price</th>
                  </tr>
                </thead>
                <tbody>
                  {safeMenuPerformance.map((item) => (
                    <tr key={item.menuItemId} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">{item.name}</td>
                      <td className="p-3">
                        <Badge variant="secondary" className="capitalize">{item.category}</Badge>
                      </td>
                      <td className="p-3 text-right">${item.price.toFixed(2)}</td>
                      <td className="p-3 text-right">{item.quantitySold}</td>
                      <td className="p-3 text-right font-semibold">${item.totalRevenue.toFixed(2)}</td>
                      <td className="p-3 text-right">${item.avgPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </>
    );
  };

  /**
   * Render Operations Tab
   * Table turnover, efficiency metrics, and operational insights
   */
  const renderOperations = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Table Turnover</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">{kpis.avgTurnover}</p>
              <p className="text-sm text-muted-foreground">Average minutes</p>
              <p className="text-xs text-muted-foreground mt-2">
                Target: &lt;60 min
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Guests per Table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">{kpis.avgGuestsPerTable}</p>
              <p className="text-sm text-muted-foreground">Average guests</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Daily Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">{kpis.avgDailyTables.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Average per day</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Peak Hours with Operations Data */}
      <Card>
        <CardHeader>
          <CardTitle>Operational Efficiency</CardTitle>
          <CardDescription>Peak hours and order distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {safePeakHours.length > 0 ? safePeakHours.map(hour => {
                const maxOrders = Math.max(...safePeakHours.map(h => h.orders || 0));
                const height = maxOrders > 0 ? ((hour.orders || 0) / maxOrders) * 100 : 0;
                
                return (
                  <div key={hour.hour} className="flex flex-col items-center min-w-[60px]">
                    <div className="h-32 w-full flex items-end">
                      <div 
                        className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t transition-all"
                        style={{ height: `${height}%` }}
                        title={`${hour.orders} orders - $${hour.revenue.toFixed(0)} revenue`}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 text-center whitespace-nowrap">
                      {hour.label}
                    </span>
                    <span className="text-xs font-medium text-primary mt-0.5">
                      {hour.orders || 0} orders
                    </span>
                  </div>
                );
              }) : (
                <div className="w-full text-center text-muted-foreground py-8">
                  No data available
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );

  return (
    <div className="max-w-full">
      {/* ============================================
          HEADER WITH CONTROLS
          ============================================ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics & Reporting</h1>
          <p className="text-slate-400">Comprehensive performance metrics and insights</p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {/* Date Range Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            {!useCustomDates ? (
              <select
                value={dateRange}
                onChange={(e) => {
                  setDateRange(e.target.value);
                  setUseCustomDates(false);
                }}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="60">Last 60 days</option>
                <option value="84">All time (12 weeks)</option>
                <option value="custom">Custom Range</option>
              </select>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white w-40"
                />
                <span className="text-slate-400">to</span>
                <Input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white w-40"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setUseCustomDates(false);
                    setCustomStartDate('');
                    setCustomEndDate('');
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            {dateRange === 'custom' && !useCustomDates && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setUseCustomDates(true);
                  const today = new Date().toISOString().split('T')[0];
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  setCustomEndDate(today);
                  setCustomStartDate(weekAgo.toISOString().split('T')[0]);
                }}
              >
                <Calendar className="w-4 h-4 mr-1" />
                Set Dates
              </Button>
            )}
          </div>

          {/* Comparison Toggle */}
          <Button
            variant={showComparison ? "default" : "outline"}
            size="sm"
            onClick={() => setShowComparison(!showComparison)}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Compare
          </Button>

          {/* Export Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
          >
            <Download className="w-4 h-4 mr-1" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* ============================================
          TAB NAVIGATION
          ============================================ */}
      <div className="flex gap-2 mb-6 border-b border-slate-700 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'revenue', label: 'Revenue', icon: DollarSign },
          { id: 'servers', label: 'Servers', icon: Users },
          { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
          { id: 'operations', label: 'Operations', icon: Activity }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ============================================
          TAB CONTENT
          ============================================ */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'revenue' && renderRevenue()}
      {activeTab === 'servers' && renderServers()}
      {activeTab === 'menu' && renderMenu()}
      {activeTab === 'operations' && renderOperations()}
    </div>
  );
};

export default Analytics;
