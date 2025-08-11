import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
  const location = useLocation();

  const breadcrumbMap = {
    '/url-shortener-dashboard': {
      label: 'Dashboard',
      icon: 'LayoutDashboard'
    },
    '/url-analytics-detail': {
      label: 'Analytics Detail',
      icon: 'BarChart3',
      parent: '/url-shortener-dashboard'
    },
    '/url-redirection-handler': {
      label: 'Redirection Handler',
      icon: 'ArrowRight'
    },
    '/url-management-settings': {
      label: 'Settings',
      icon: 'Settings'
    }
  };

  const currentPath = location?.pathname;
  const currentBreadcrumb = breadcrumbMap?.[currentPath];

  if (!currentBreadcrumb) {
    return null;
  }

  const breadcrumbItems = [];

  // Add parent breadcrumb if exists
  if (currentBreadcrumb?.parent) {
    const parentBreadcrumb = breadcrumbMap?.[currentBreadcrumb?.parent];
    if (parentBreadcrumb) {
      breadcrumbItems?.push({
        label: parentBreadcrumb?.label,
        path: currentBreadcrumb?.parent,
        icon: parentBreadcrumb?.icon,
        isActive: false
      });
    }
  }

  // Add current breadcrumb
  breadcrumbItems?.push({
    label: currentBreadcrumb?.label,
    path: currentPath,
    icon: currentBreadcrumb?.icon,
    isActive: true
  });

  // Don't show breadcrumb for single-level pages without parent
  if (breadcrumbItems?.length === 1 && !currentBreadcrumb?.parent) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems?.map((item, index) => (
          <li key={item?.path} className="flex items-center space-x-2">
            {index > 0 && (
              <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
            )}
            {item?.isActive ? (
              <span className="flex items-center space-x-1 text-text-primary font-medium">
                <Icon name={item?.icon} size={14} />
                <span>{item?.label}</span>
              </span>
            ) : (
              <Link
                to={item?.path}
                className="flex items-center space-x-1 hover:text-text-primary transition-smooth"
              >
                <Icon name={item?.icon} size={14} />
                <span>{item?.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;