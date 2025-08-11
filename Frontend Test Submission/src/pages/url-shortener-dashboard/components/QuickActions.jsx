import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuickActions = ({ onQuickCreate, urlCount, maxUrls = 5 }) => {
  const canCreateMore = urlCount < maxUrls;

  const quickActions = [
    {
      id: 'quick-create',
      label: 'Quick Create',
      description: 'Create URL with default settings',
      icon: 'Zap',
      variant: 'default',
      disabled: !canCreateMore,
      onClick: onQuickCreate
    },
    {
      id: 'bulk-import',
      label: 'Bulk Import',
      description: 'Import multiple URLs from file',
      icon: 'Upload',
      variant: 'outline',
      disabled: !canCreateMore
    },
    {
      id: 'export-data',
      label: 'Export Data',
      description: 'Download your URL data',
      icon: 'Download',
      variant: 'outline'
    },
    {
      id: 'analytics',
      label: 'View Analytics',
      description: 'See detailed performance metrics',
      icon: 'BarChart3',
      variant: 'outline'
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Zap" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-text-primary">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickActions?.map((action) => (
          <div key={action?.id} className="group">
            <Button
              variant={action?.variant}
              size="sm"
              fullWidth
              disabled={action?.disabled}
              onClick={action?.onClick}
              iconName={action?.icon}
              iconPosition="left"
              iconSize={16}
              className="h-auto py-3 flex-col items-start text-left"
            >
              <span className="font-medium">{action?.label}</span>
              <span className="text-xs opacity-75 mt-1 group-hover:opacity-100 transition-opacity">
                {action?.description}
              </span>
            </Button>
          </div>
        ))}
      </div>
      {!canCreateMore && (
        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-md">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <p className="text-sm text-warning font-medium">
              URL Limit Reached
            </p>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            You've reached the maximum of {maxUrls} concurrent URLs. Delete some expired URLs to create new ones.
          </p>
        </div>
      )}
    </div>
  );
};

export default QuickActions;