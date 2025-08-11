import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const AccountPreferencesTab = ({ preferences, onPreferencesChange }) => {
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const dataRetentionOptions = [
    { value: '30', label: '30 days' },
    { value: '90', label: '90 days' },
    { value: '180', label: '6 months' },
    { value: '365', label: '1 year' },
    { value: '730', label: '2 years' },
    { value: 'forever', label: 'Keep forever' }
  ];

  const timezoneOptions = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'it', label: 'Italiano' },
    { value: 'pt', label: 'Português' },
    { value: 'ru', label: 'Русский' },
    { value: 'ja', label: '日本語' },
    { value: 'ko', label: '한국어' },
    { value: 'zh', label: '中文' }
  ];

  const handlePreferenceChange = (key, value) => {
    const updatedPreferences = { ...localPreferences, [key]: value };
    setLocalPreferences(updatedPreferences);
    setHasChanges(true);
  };

  const handleSave = () => {
    onPreferencesChange(localPreferences);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalPreferences(preferences);
    setHasChanges(false);
  };

  const handleDeleteAccount = () => {
    // Mock account deletion
    console.log('Account deletion requested');
    setShowDeleteDialog(false);
  };

  const handleExportData = () => {
    // Mock data export
    const exportData = {
      urls: 'Mock URL data',
      analytics: 'Mock analytics data',
      settings: localPreferences,
      exportDate: new Date()?.toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkshort-data-export-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Bell" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Notification Preferences</h3>
        </div>
        
        <div className="space-y-4">
          <Checkbox
            label="Email notifications"
            description="Receive email updates about your URLs and account"
            checked={localPreferences?.emailNotifications}
            onChange={(e) => handlePreferenceChange('emailNotifications', e?.target?.checked)}
          />
          
          <Checkbox
            label="URL expiration alerts"
            description="Get notified when URLs are about to expire"
            checked={localPreferences?.expirationAlerts}
            onChange={(e) => handlePreferenceChange('expirationAlerts', e?.target?.checked)}
          />
          
          <Checkbox
            label="Weekly analytics summary"
            description="Receive weekly reports of your URL performance"
            checked={localPreferences?.weeklyReports}
            onChange={(e) => handlePreferenceChange('weeklyReports', e?.target?.checked)}
          />
          
          <Checkbox
            label="Security alerts"
            description="Get notified about suspicious activity on your account"
            checked={localPreferences?.securityAlerts}
            onChange={(e) => handlePreferenceChange('securityAlerts', e?.target?.checked)}
          />
          
          <Checkbox
            label="Feature updates"
            description="Be informed about new features and improvements"
            checked={localPreferences?.featureUpdates}
            onChange={(e) => handlePreferenceChange('featureUpdates', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Data Retention Settings */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Database" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Data Retention</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Analytics Data Retention"
            description="How long to keep click analytics data"
            options={dataRetentionOptions}
            value={localPreferences?.analyticsRetention}
            onChange={(value) => handlePreferenceChange('analyticsRetention', value)}
          />
          
          <Select
            label="URL History Retention"
            description="How long to keep expired URL records"
            options={dataRetentionOptions}
            value={localPreferences?.urlHistoryRetention}
            onChange={(value) => handlePreferenceChange('urlHistoryRetention', value)}
          />
        </div>

        <div className="mt-4">
          <Checkbox
            label="Auto-delete expired URLs"
            description="Automatically remove URLs after they expire"
            checked={localPreferences?.autoDeleteExpired}
            onChange={(e) => handlePreferenceChange('autoDeleteExpired', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Localization Settings */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Globe" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Localization</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Language"
            description="Interface language preference"
            options={languageOptions}
            value={localPreferences?.language}
            onChange={(value) => handlePreferenceChange('language', value)}
          />
          
          <Select
            label="Timezone"
            description="Timezone for date and time display"
            options={timezoneOptions}
            value={localPreferences?.timezone}
            onChange={(value) => handlePreferenceChange('timezone', value)}
          />
        </div>

        <div className="mt-4">
          <Checkbox
            label="Use 24-hour time format"
            description="Display time in 24-hour format instead of 12-hour"
            checked={localPreferences?.use24HourFormat}
            onChange={(e) => handlePreferenceChange('use24HourFormat', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Privacy Settings */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Shield" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Privacy & Security</h3>
        </div>
        
        <div className="space-y-4">
          <Checkbox
            label="Make analytics public"
            description="Allow others to view basic analytics for your URLs"
            checked={localPreferences?.publicAnalytics}
            onChange={(e) => handlePreferenceChange('publicAnalytics', e?.target?.checked)}
          />
          
          <Checkbox
            label="Enable two-factor authentication"
            description="Add an extra layer of security to your account"
            checked={localPreferences?.twoFactorAuth}
            onChange={(e) => handlePreferenceChange('twoFactorAuth', e?.target?.checked)}
          />
          
          <Checkbox
            label="Log IP addresses"
            description="Record IP addresses for security and analytics"
            checked={localPreferences?.logIpAddresses}
            onChange={(e) => handlePreferenceChange('logIpAddresses', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Account Management */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="User" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Account Management</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h4 className="font-medium text-text-primary">Export Account Data</h4>
              <p className="text-sm text-text-secondary">Download all your data in JSON format</p>
            </div>
            <Button
              variant="outline"
              onClick={handleExportData}
              iconName="Download"
              iconPosition="left"
            >
              Export Data
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-error/5 border border-error/20 rounded-lg">
            <div>
              <h4 className="font-medium text-error">Delete Account</h4>
              <p className="text-sm text-text-secondary">Permanently delete your account and all data</p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              iconName="Trash2"
              iconPosition="left"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-sm text-text-secondary">
          {hasChanges && (
            <span className="flex items-center space-x-1 text-warning">
              <Icon name="AlertCircle" size={16} />
              <span>You have unsaved changes</span>
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges}
          >
            Reset Changes
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            disabled={!hasChanges}
            iconName="Save"
            iconPosition="left"
          >
            Save Preferences
          </Button>
        </div>
      </div>
      {/* Delete Account Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="AlertTriangle" size={20} className="text-error" />
              <h3 className="text-lg font-semibold text-text-primary">Delete Account</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-text-secondary mb-4">
                Are you sure you want to delete your account? This action cannot be undone and will:
              </p>
              <ul className="text-sm text-text-secondary space-y-1 ml-4">
                <li>• Delete all your shortened URLs</li>
                <li>• Remove all analytics data</li>
                <li>• Cancel any active subscriptions</li>
                <li>• Permanently delete your account</li>
              </ul>
            </div>
            
            <Input
              label="Type 'DELETE' to confirm"
              placeholder="DELETE"
              className="mb-4"
            />
            
            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPreferencesTab;