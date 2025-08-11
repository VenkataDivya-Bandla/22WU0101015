import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsOverview = ({ urls }) => {
  const totalUrls = urls?.length;
  const totalClicks = urls?.reduce((sum, url) => sum + url?.clickCount, 0);
  const activeUrls = urls?.filter(url => new Date(url.expiresAt) > new Date())?.length;
  const expiredUrls = totalUrls - activeUrls;

  const stats = [
    {
      id: 'total-urls',
      label: 'Total URLs',
      value: totalUrls,
      maxValue: 5,
      icon: 'Link',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      id: 'total-clicks',
      label: 'Total Clicks',
      value: totalClicks,
      icon: 'MousePointerClick',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      id: 'active-urls',
      label: 'Active URLs',
      value: activeUrls,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      id: 'expired-urls',
      label: 'Expired URLs',
      value: expiredUrls,
      icon: 'XCircle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats?.map((stat) => (
        <div key={stat?.id} className="bg-card rounded-lg border border-border p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">{stat?.label}</p>
              <div className="flex items-baseline space-x-1">
                <p className="text-2xl font-bold text-text-primary">{stat?.value}</p>
                {stat?.maxValue && (
                  <p className="text-sm text-text-secondary">/ {stat?.maxValue}</p>
                )}
              </div>
            </div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${stat?.bgColor}`}>
              <Icon name={stat?.icon} size={20} className={stat?.color} />
            </div>
          </div>
          
          {stat?.maxValue && (
            <div className="mt-3">
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stat?.value / stat?.maxValue) * 100}%` }}
                />
              </div>
              <p className="text-xs text-text-secondary mt-1">
                {stat?.maxValue - stat?.value} remaining
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;