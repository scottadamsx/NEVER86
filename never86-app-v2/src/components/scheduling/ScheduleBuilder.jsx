import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

const ScheduleBuilder = ({ 
  shifts, 
  staff, 
  weekStart,
  onWeekChange,
  recommendations 
}) => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    days.push(date);
  }

  const formatDay = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getShiftsForDay = (date, shiftType) => {
    const dateStr = date.toISOString().split('T')[0];
    return shifts.filter(s => s.date === dateStr && s.shiftType === shiftType);
  };

  const getRecommendation = (date, shift) => {
    const dateStr = date.toISOString().split('T')[0];
    return recommendations?.find(r => r.date === dateStr && r.shift === shift);
  };

  return (
    <Card>
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Schedule Builder
          </CardTitle>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => {
                const newDate = new Date(weekStart);
                newDate.setDate(newDate.getDate() - 7);
                onWeekChange?.(newDate);
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium px-3 min-w-[180px] text-center">
              Week of {formatDay(weekStart)}
            </span>
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => {
                const newDate = new Date(weekStart);
                newDate.setDate(newDate.getDate() + 7);
                onWeekChange?.(newDate);
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Schedule Grid */}
        <div className="overflow-x-auto -mx-6">
          <div className="min-w-[800px] px-6">
            {/* Days Header */}
            <div className="grid grid-cols-7 border-b">
              {days.map((day, i) => (
                <div 
                  key={i}
                  className={`px-3 py-3 text-center border-r last:border-r-0 ${
                    day.toDateString() === new Date().toDateString() ? 'bg-primary/5' : ''
                  }`}
                >
                  <p className="text-xs text-muted-foreground">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <p className="text-lg font-semibold">{day.getDate()}</p>
                </div>
              ))}
            </div>

            {/* Lunch Shift Row */}
            <div className="grid grid-cols-7 border-b">
              {days.map((day, i) => {
                const dayShifts = getShiftsForDay(day, 'lunch');
                const rec = getRecommendation(day, 'lunch');
                const isUnder = rec && dayShifts.length < rec.recommendedServers;

                return (
                  <div key={i} className="border-r last:border-r-0 p-2 min-h-[110px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Lunch</span>
                      {rec && (
                        <Badge variant={isUnder ? 'destructive' : 'success'} className="text-[10px] h-5">
                          {dayShifts.length}/{rec.recommendedServers}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {dayShifts.slice(0, 3).map(shift => (
                        <div 
                          key={shift.id}
                          className="text-xs px-2 py-1 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 truncate"
                        >
                          {shift.staffName?.split(' ')[0] || 'Staff'}
                        </div>
                      ))}
                      {dayShifts.length > 3 && (
                        <div className="text-xs text-muted-foreground pl-2">
                          +{dayShifts.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dinner Shift Row */}
            <div className="grid grid-cols-7">
              {days.map((day, i) => {
                const dayShifts = getShiftsForDay(day, 'dinner');
                const rec = getRecommendation(day, 'dinner');
                const isUnder = rec && dayShifts.length < rec.recommendedServers;

                return (
                  <div key={i} className="border-r last:border-r-0 p-2 min-h-[110px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-primary">Dinner</span>
                      {rec && (
                        <Badge variant={isUnder ? 'destructive' : 'success'} className="text-[10px] h-5">
                          {dayShifts.length}/{rec.recommendedServers}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {dayShifts.slice(0, 4).map(shift => (
                        <div 
                          key={shift.id}
                          className="text-xs px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20 truncate"
                        >
                          {shift.staffName?.split(' ')[0] || 'Staff'}
                        </div>
                      ))}
                      {dayShifts.length > 4 && (
                        <div className="text-xs text-muted-foreground pl-2">
                          +{dayShifts.length - 4} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Smart Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="mt-4 pt-4 border-t flex items-start gap-3 bg-muted/30 -mx-6 px-6 py-4 -mb-6 rounded-b-xl">
            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium mb-1">Smart Recommendations</p>
              <p className="text-sm text-muted-foreground">
                {recommendations[0]?.reasoning || 'Based on historical data, staffing levels look good.'}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduleBuilder;
