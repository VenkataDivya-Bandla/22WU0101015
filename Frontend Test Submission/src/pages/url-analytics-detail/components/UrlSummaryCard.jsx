import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UrlSummaryCard = () => {
  const [copySuccess, setCopySuccess] = useState('');

  const urlData = {
    originalUrl: "https://www.example.com/very-long-url-path/with-multiple-parameters?utm_source=social&utm_medium=twitter&utm_campaign=launch",
    shortCode: "abc123",
    shortUrl: "https://linkshort.pro/abc123",
    createdAt: new Date('2025-01-10T09:30:00'),
    expiresAt: new Date('2025-01-11T09:30:00'),
    status: 'active',
    totalClicks: 2952,
    uniqueVisitors: 1847
  };

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard?.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (date) => {
    return date?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10';
      case 'expired': return 'text-destructive bg-destructive/10';
      case 'paused': return 'text-warning bg-warning/10';
      default: return 'text-text-secondary bg-muted';
    }
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const expiry = urlData?.expiresAt;
    const diff = expiry - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">URL Summary</h3>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(urlData?.status)}`}>
          {urlData?.status?.charAt(0)?.toUpperCase() + urlData?.status?.slice(1)}
        </div>
      </div>
      <div className="space-y-6">
        {/* Short URL */}
        <div>
          <label className="text-sm font-medium text-text-secondary mb-2 block">Short URL</label>
          <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
            <Icon name="Link" size={16} className="text-text-secondary flex-shrink-0" />
            <span className="text-sm text-text-primary font-mono flex-1 truncate">{urlData?.shortUrl}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(urlData?.shortUrl, 'short')}
              iconName={copySuccess === 'short' ? 'Check' : 'Copy'}
              className="flex-shrink-0"
            >
              {copySuccess === 'short' ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Original URL */}
        <div>
          <label className="text-sm font-medium text-text-secondary mb-2 block">Original URL</label>
          <div className="flex items-start space-x-2 p-3 bg-muted rounded-lg">
            <Icon name="ExternalLink" size={16} className="text-text-secondary flex-shrink-0 mt-0.5" />
            <span className="text-sm text-text-primary break-all flex-1">{urlData?.originalUrl}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(urlData?.originalUrl, 'original')}
              iconName={copySuccess === 'original' ? 'Check' : 'Copy'}
              className="flex-shrink-0"
            >
              {copySuccess === 'original' ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Short Code */}
        <div>
          <label className="text-sm font-medium text-text-secondary mb-2 block">Short Code</label>
          <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
            <Icon name="Hash" size={16} className="text-text-secondary" />
            <span className="text-sm text-text-primary font-mono">{urlData?.shortCode}</span>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">Created</label>
            <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
              <Icon name="Calendar" size={16} className="text-text-secondary" />
              <span className="text-sm text-text-primary">{formatDate(urlData?.createdAt)}</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">Expires</label>
            <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
              <Icon name="Clock" size={16} className="text-text-secondary" />
              <div className="flex-1">
                <div className="text-sm text-text-primary">{formatDate(urlData?.expiresAt)}</div>
                <div className="text-xs text-warning mt-1">{getTimeRemaining()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-text-primary">{urlData?.totalClicks?.toLocaleString()}</div>
            <div className="text-sm text-text-secondary">Total Clicks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-text-primary">{urlData?.uniqueVisitors?.toLocaleString()}</div>
            <div className="text-sm text-text-secondary">Unique Visitors</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-border">
          <Button variant="outline" fullWidth iconName="Clock">
            Extend Expiration
          </Button>
          <Button variant="outline" fullWidth iconName="Share">
            Share Analytics
          </Button>
          <Button variant="outline" fullWidth iconName="Download">
            Export Data
          </Button>
          <Button variant="destructive" fullWidth iconName="Trash2">
            Delete URL
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UrlSummaryCard;