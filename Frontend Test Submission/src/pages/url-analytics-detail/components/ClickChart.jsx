import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';


const ClickChart = () => {
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('24h');

  const chartData = {
    '24h': [
      { time: '00:00', clicks: 12, uniqueVisitors: 8 },
      { time: '02:00', clicks: 8, uniqueVisitors: 6 },
      { time: '04:00', clicks: 5, uniqueVisitors: 4 },
      { time: '06:00', clicks: 15, uniqueVisitors: 12 },
      { time: '08:00', clicks: 32, uniqueVisitors: 24 },
      { time: '10:00', clicks: 45, uniqueVisitors: 35 },
      { time: '12:00', clicks: 67, uniqueVisitors: 48 },
      { time: '14:00', clicks: 89, uniqueVisitors: 62 },
      { time: '16:00', clicks: 76, uniqueVisitors: 54 },
      { time: '18:00', clicks: 54, uniqueVisitors: 41 },
      { time: '20:00', clicks: 43, uniqueVisitors: 32 },
      { time: '22:00', clicks: 28, uniqueVisitors: 21 }
    ],
    '7d': [
      { time: 'Mon', clicks: 234, uniqueVisitors: 187 },
      { time: 'Tue', clicks: 456, uniqueVisitors: 342 },
      { time: 'Wed', clicks: 389, uniqueVisitors: 298 },
      { time: 'Thu', clicks: 567, uniqueVisitors: 423 },
      { time: 'Fri', clicks: 678, uniqueVisitors: 512 },
      { time: 'Sat', clicks: 345, uniqueVisitors: 267 },
      { time: 'Sun', calls: 283, uniqueVisitors: 219 }
    ],
    '30d': [
      { time: 'Week 1', clicks: 1234, uniqueVisitors: 987 },
      { time: 'Week 2', clicks: 1567, uniqueVisitors: 1234 },
      { time: 'Week 3', clicks: 1890, uniqueVisitors: 1456 },
      { time: 'Week 4', clicks: 2134, uniqueVisitors: 1678 }
    ]
  };

  const currentData = chartData?.[timeRange];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevated">
          <p className="text-sm font-medium text-text-primary mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry?.color }}
              ></div>
              <span className="text-sm text-text-secondary">{entry?.name}:</span>
              <span className="text-sm font-medium text-text-primary">{entry?.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Click Patterns</h3>
        <div className="flex items-center space-x-2">
          {/* Time Range Selector */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            {['24h', '7d', '30d']?.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-smooth ${
                  timeRange === range
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          {/* Chart Type Selector */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-md transition-smooth ${
                chartType === 'line' ?'bg-primary text-primary-foreground' :'text-text-secondary hover:text-text-primary'
              }`}
              title="Line Chart"
            >
              <Icon name="TrendingUp" size={16} />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-2 rounded-md transition-smooth ${
                chartType === 'bar' ?'bg-primary text-primary-foreground' :'text-text-secondary hover:text-text-primary'
              }`}
              title="Bar Chart"
            >
              <Icon name="BarChart3" size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="h-80 w-full" aria-label="Click Patterns Chart">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={currentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="time" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="var(--color-primary)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
                name="Total Clicks"
              />
              <Line 
                type="monotone" 
                dataKey="uniqueVisitors" 
                stroke="var(--color-accent)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-accent)', strokeWidth: 2 }}
                name="Unique Visitors"
              />
            </LineChart>
          ) : (
            <BarChart data={currentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="time" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="clicks" 
                fill="var(--color-primary)" 
                radius={[4, 4, 0, 0]}
                name="Total Clicks"
              />
              <Bar 
                dataKey="uniqueVisitors" 
                fill="var(--color-accent)" 
                radius={[4, 4, 0, 0]}
                name="Unique Visitors"
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      {/* Chart Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-sm text-text-secondary">Total Clicks</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-accent"></div>
          <span className="text-sm text-text-secondary">Unique Visitors</span>
        </div>
      </div>
    </div>
  );
};

export default ClickChart;