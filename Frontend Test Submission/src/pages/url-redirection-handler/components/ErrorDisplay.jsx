import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ErrorDisplay = ({ type, shortcode, onRetry }) => {
  const errorConfigs = {
    notFound: {
      icon: 'AlertCircle',
      title: 'Shortcode Not Found',
      message: `The shortcode "${shortcode}" does not exist or has been removed.`,
      color: 'text-error'
    },
    expired: {
      icon: 'Clock',
      title: 'Link Expired',
      message: `The shortcode "${shortcode}" has expired and is no longer valid.`,
      color: 'text-warning'
    },
    invalid: {
      icon: 'XCircle',
      title: 'Invalid Shortcode',
      message: `The shortcode "${shortcode}" is not in a valid format.`,
      color: 'text-error'
    },
    networkError: {
      icon: 'Wifi',
      title: 'Connection Error',
      message: 'Unable to process the redirection. Please check your connection.',
      color: 'text-error'
    }
  };

  const config = errorConfigs?.[type] || errorConfigs?.notFound;

  return (
    <div className="text-center space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className={`p-4 rounded-full bg-muted ${config?.color}`}>
          <Icon name={config?.icon} size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-text-primary">
            {config?.title}
          </h2>
          <p className="text-text-secondary max-w-md mx-auto">
            {config?.message}
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="default"
          iconName="Home"
          iconPosition="left"
          asChild
        >
          <Link to="/url-shortener-dashboard">
            Go to Dashboard
          </Link>
        </Button>
        
        {onRetry && (
          <Button
            variant="outline"
            iconName="RefreshCw"
            iconPosition="left"
            onClick={onRetry}
          >
            Try Again
          </Button>
        )}
        
        <Button
          variant="ghost"
          iconName="Plus"
          iconPosition="left"
          asChild
        >
          <Link to="/url-shortener-dashboard">
            Create New Link
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ErrorDisplay;