import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, subtitle, icon, trend, trendValue, className = "" }) => {
  const getTrendColor = () => {
    if (!trend) return 'text-text-secondary';
    return trend === 'up' ? 'text-success' : 'text-destructive';
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend === 'up' ? 'TrendingUp' : 'TrendingDown';
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 shadow-subtle ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name={icon} size={20} className="text-primary" />
          </div>
          <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            <Icon name={getTrendIcon()} size={16} />
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="text-2xl font-bold text-text-primary">{value}</div>
        {subtitle && (
          <div className="text-sm text-text-secondary">{subtitle}</div>
        )}
      </div>
    </div>
  );
};

export default MetricsCard;