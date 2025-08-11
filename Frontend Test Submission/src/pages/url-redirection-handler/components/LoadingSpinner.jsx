import React from 'react';
import Icon from '../../../components/AppIcon';

const LoadingSpinner = ({ message = "Redirecting..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-muted rounded-full animate-spin border-t-primary"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon name="Link" size={20} className="text-primary" />
        </div>
      </div>
      <p className="text-text-secondary text-sm font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;