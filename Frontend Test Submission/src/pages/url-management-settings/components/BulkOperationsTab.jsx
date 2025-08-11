import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BulkOperationsTab = ({ urls, onBulkAction }) => {
  const [selectedUrls, setSelectedUrls] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [newExpiration, setNewExpiration] = useState('60');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const bulkActionOptions = [
    { value: '', label: 'Select an action...' },
    { value: 'delete', label: 'Delete URLs' },
    { value: 'extend', label: 'Extend Expiration' },
    { value: 'export', label: 'Export to CSV' },
    { value: 'disable', label: 'Disable URLs' },
    { value: 'enable', label: 'Enable URLs' }
  ];

  const expirationOptions = [
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 hour' },
    { value: '120', label: '2 hours' },
    { value: '240', label: '4 hours' },
    { value: '480', label: '8 hours' },
    { value: '1440', label: '24 hours' },
    { value: '2880', label: '2 days' },
    { value: '10080', label: '7 days' }
  ];

  const statusFilterOptions = [
    { value: 'all', label: 'All URLs' },
    { value: 'active', label: 'Active URLs' },
    { value: 'expired', label: 'Expired URLs' },
    { value: 'disabled', label: 'Disabled URLs' }
  ];

  const filteredUrls = urls?.filter(url => {
    const matchesSearch = url?.originalUrl?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         url?.shortCode?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesStatus = filterStatus === 'all' || url?.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUrls(filteredUrls?.map(url => url?.id));
    } else {
      setSelectedUrls([]);
    }
  };

  const handleSelectUrl = (urlId, checked) => {
    if (checked) {
      setSelectedUrls([...selectedUrls, urlId]);
    } else {
      setSelectedUrls(selectedUrls?.filter(id => id !== urlId));
    }
  };

  const handleBulkAction = () => {
    if (!bulkAction || selectedUrls?.length === 0) return;

    if (bulkAction === 'delete' || bulkAction === 'disable') {
      setShowConfirmDialog(true);
    } else {
      executeBulkAction();
    }
  };

  const executeBulkAction = () => {
    const actionData = {
      action: bulkAction,
      urlIds: selectedUrls,
      newExpiration: bulkAction === 'extend' ? newExpiration : null
    };
    
    onBulkAction(actionData);
    setSelectedUrls([]);
    setBulkAction('');
    setShowConfirmDialog(false);
  };

  const handleImportCSV = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      // Mock CSV import functionality
      console.log('Importing CSV file:', file?.name);
      // In real implementation, would parse CSV and create URLs
    }
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'text-success bg-success/10', label: 'Active' },
      expired: { color: 'text-error bg-error/10', label: 'Expired' },
      disabled: { color: 'text-text-secondary bg-muted', label: 'Disabled' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.active;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Search" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Search & Filter</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Search URLs"
            type="search"
            placeholder="Search by URL or shortcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
          />
          
          <Select
            label="Filter by Status"
            options={statusFilterOptions}
            value={filterStatus}
            onChange={setFilterStatus}
          />
        </div>
      </div>
      {/* Bulk Actions */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Settings" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Bulk Operations</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Select
            label="Select Action"
            options={bulkActionOptions}
            value={bulkAction}
            onChange={setBulkAction}
          />
          
          {bulkAction === 'extend' && (
            <Select
              label="New Expiration"
              options={expirationOptions}
              value={newExpiration}
              onChange={setNewExpiration}
            />
          )}
          
          <div className="flex items-end">
            <Button
              variant="default"
              onClick={handleBulkAction}
              disabled={!bulkAction || selectedUrls?.length === 0}
              iconName="Play"
              iconPosition="left"
              className="w-full"
            >
              Execute Action
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            {selectedUrls?.length} of {filteredUrls?.length} URLs selected
          </span>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Upload"
              iconPosition="left"
              onClick={() => document.getElementById('csv-import')?.click()}
            >
              Import CSV
            </Button>
            <input
              id="csv-import"
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
            
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={() => onBulkAction({ action: 'export', urlIds: selectedUrls })}
              disabled={selectedUrls?.length === 0}
            >
              Export Selected
            </Button>
          </div>
        </div>
      </div>
      {/* URL List */}
      <div className="bg-surface border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">URL Management</h3>
            <span className="text-sm text-text-secondary">
              {filteredUrls?.length} URLs found
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left">
                  <Checkbox
                    checked={selectedUrls?.length === filteredUrls?.length && filteredUrls?.length > 0}
                    onChange={(e) => handleSelectAll(e?.target?.checked)}
                  />
                </th>
                <th className="p-3 text-left text-sm font-medium text-text-secondary">Short URL</th>
                <th className="p-3 text-left text-sm font-medium text-text-secondary">Original URL</th>
                <th className="p-3 text-left text-sm font-medium text-text-secondary">Status</th>
                <th className="p-3 text-left text-sm font-medium text-text-secondary">Clicks</th>
                <th className="p-3 text-left text-sm font-medium text-text-secondary">Expires</th>
                <th className="p-3 text-left text-sm font-medium text-text-secondary">Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredUrls?.map((url) => (
                <tr key={url?.id} className="border-b border-border hover:bg-muted/50">
                  <td className="p-3">
                    <Checkbox
                      checked={selectedUrls?.includes(url?.id)}
                      onChange={(e) => handleSelectUrl(url?.id, e?.target?.checked)}
                    />
                  </td>
                  <td className="p-3">
                    <div className="font-mono text-sm text-primary">
                      linkshort.pro/{url?.shortCode}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm text-text-primary truncate max-w-xs" title={url?.originalUrl}>
                      {url?.originalUrl}
                    </div>
                  </td>
                  <td className="p-3">
                    {getStatusBadge(url?.status)}
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-text-primary">{url?.clicks}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-text-secondary">
                      {formatDate(url?.expiresAt)}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-text-secondary">
                      {formatDate(url?.createdAt)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUrls?.length === 0 && (
            <div className="p-8 text-center">
              <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-text-secondary">No URLs found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="AlertTriangle" size={20} className="text-warning" />
              <h3 className="text-lg font-semibold text-text-primary">Confirm Action</h3>
            </div>
            
            <p className="text-text-secondary mb-6">
              Are you sure you want to {bulkAction} {selectedUrls?.length} selected URL{selectedUrls?.length !== 1 ? 's' : ''}? 
              This action cannot be undone.
            </p>
            
            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={executeBulkAction}
              >
                Confirm {bulkAction}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkOperationsTab;