import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ClickHistoryTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  const itemsPerPage = 10;

  const clickHistory = [
    {
      id: 1,
      timestamp: new Date('2025-01-11T14:30:25'),
      source: 'twitter.com',
      location: 'New York, US',
      device: 'Desktop',
      browser: 'Chrome',
      ip: '192.168.1.1'
    },
    {
      id: 2,
      timestamp: new Date('2025-01-11T13:45:12'),
      source: 'linkedin.com',
      location: 'London, UK',
      device: 'Mobile',
      browser: 'Safari',
      ip: '192.168.1.2'
    },
    {
      id: 3,
      timestamp: new Date('2025-01-11T12:20:08'),
      source: 'facebook.com',
      location: 'Toronto, CA',
      device: 'Tablet',
      browser: 'Firefox',
      ip: '192.168.1.3'
    },
    {
      id: 4,
      timestamp: new Date('2025-01-11T11:15:33'),
      source: 'direct',
      location: 'Sydney, AU',
      device: 'Desktop',
      browser: 'Edge',
      ip: '192.168.1.4'
    },
    {
      id: 5,
      timestamp: new Date('2025-01-11T10:05:17'),
      source: 'google.com',
      location: 'Berlin, DE',
      device: 'Mobile',
      browser: 'Chrome',
      ip: '192.168.1.5'
    },
    {
      id: 6,
      timestamp: new Date('2025-01-11T09:30:45'),
      source: 'reddit.com',
      location: 'Paris, FR',
      device: 'Desktop',
      browser: 'Firefox',
      ip: '192.168.1.6'
    },
    {
      id: 7,
      timestamp: new Date('2025-01-11T08:45:22'),
      source: 'instagram.com',
      location: 'Tokyo, JP',
      device: 'Mobile',
      browser: 'Safari',
      ip: '192.168.1.7'
    },
    {
      id: 8,
      timestamp: new Date('2025-01-11T07:20:11'),
      source: 'youtube.com',
      location: 'Mumbai, IN',
      device: 'Tablet',
      browser: 'Chrome',
      ip: '192.168.1.8'
    }
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...clickHistory]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    if (sortField === 'timestamp') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(sortedData?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData?.slice(startIndex, startIndex + itemsPerPage);

  const formatTimestamp = (timestamp) => {
    return timestamp?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeviceIcon = (device) => {
    switch (device?.toLowerCase()) {
      case 'desktop': return 'Monitor';
      case 'mobile': return 'Smartphone';
      case 'tablet': return 'Tablet';
      default: return 'Monitor';
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return 'ArrowUpDown';
    return sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Click History</h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Download">
              Export
            </Button>
            <Button variant="outline" size="sm" iconName="RefreshCw">
              Refresh
            </Button>
          </div>
        </div>
      </div>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('timestamp')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-secondary hover:text-text-primary transition-smooth"
                >
                  <span>Timestamp</span>
                  <Icon name={getSortIcon('timestamp')} size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('source')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-secondary hover:text-text-primary transition-smooth"
                >
                  <span>Source</span>
                  <Icon name={getSortIcon('source')} size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('location')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-secondary hover:text-text-primary transition-smooth"
                >
                  <span>Location</span>
                  <Icon name={getSortIcon('location')} size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('device')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-secondary hover:text-text-primary transition-smooth"
                >
                  <span>Device</span>
                  <Icon name={getSortIcon('device')} size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-text-secondary">Browser</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData?.map((click, index) => (
              <tr key={click?.id} className={`border-b border-border hover:bg-muted/50 transition-smooth ${index % 2 === 0 ? 'bg-background' : 'bg-card'}`}>
                <td className="p-4">
                  <div className="text-sm text-text-primary">{formatTimestamp(click?.timestamp)}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="ExternalLink" size={14} className="text-text-secondary" />
                    <span className="text-sm text-text-primary">{click?.source}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="MapPin" size={14} className="text-text-secondary" />
                    <span className="text-sm text-text-primary">{click?.location}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name={getDeviceIcon(click?.device)} size={14} className="text-text-secondary" />
                    <span className="text-sm text-text-primary">{click?.device}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-text-primary">{click?.browser}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="md:hidden p-4 space-y-4">
        {paginatedData?.map((click) => (
          <div key={click?.id} className="bg-muted rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-primary">{formatTimestamp(click?.timestamp)}</span>
              <div className="flex items-center space-x-1">
                <Icon name={getDeviceIcon(click?.device)} size={14} className="text-text-secondary" />
                <span className="text-xs text-text-secondary">{click?.device}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="ExternalLink" size={14} className="text-text-secondary" />
              <span className="text-sm text-text-primary">{click?.source}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={14} className="text-text-secondary" />
                <span className="text-sm text-text-primary">{click?.location}</span>
              </div>
              <span className="text-xs text-text-secondary">{click?.browser}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="p-4 border-t border-border flex items-center justify-between">
        <div className="text-sm text-text-secondary">
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedData?.length)} of {sortedData?.length} clicks
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            iconName="ChevronLeft"
          >
            Previous
          </Button>
          <span className="text-sm text-text-primary px-3 py-1 bg-muted rounded">
            {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            iconName="ChevronRight"
            iconPosition="right"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClickHistoryTable;