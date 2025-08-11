import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import DefaultSettingsTab from './components/DefaultSettingsTab';
import BulkOperationsTab from './components/BulkOperationsTab';
import AccountPreferencesTab from './components/AccountPreferencesTab';

const URLManagementSettings = () => {
  const [activeTab, setActiveTab] = useState('default');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Mock settings data
  const [defaultSettings, setDefaultSettings] = useState({
    defaultExpiration: '30',
    customExpiration: '',
    allowCustomExpiration: true,
    shortcodePattern: 'alphanumeric',
    shortcodeLength: '5',
    allowCustomShortcode: true,
    caseSensitive: false,
    trackAnalytics: true,
    trackGeography: true,
    trackReferrer: true,
    trackDevice: false
  });

  const [accountPreferences, setAccountPreferences] = useState({
    emailNotifications: true,
    expirationAlerts: true,
    weeklyReports: false,
    securityAlerts: true,
    featureUpdates: false,
    analyticsRetention: '365',
    urlHistoryRetention: '90',
    autoDeleteExpired: false,
    language: 'en',
    timezone: 'America/New_York',
    use24HourFormat: false,
    publicAnalytics: false,
    twoFactorAuth: false,
    logIpAddresses: true
  });

  // Mock URLs data for bulk operations
  const mockUrls = [
    {
      id: 1,
      shortCode: 'abc12',
      originalUrl: 'https://www.example.com/very-long-url-that-needs-shortening',
      status: 'active',
      clicks: 245,
      createdAt: new Date('2025-01-15T10:30:00'),
      expiresAt: new Date('2025-01-15T11:00:00')
    },
    {
      id: 2,
      shortCode: 'def34',
      originalUrl: 'https://www.google.com/search?q=react+url+shortener',
      status: 'active',
      clicks: 89,
      createdAt: new Date('2025-01-14T14:20:00'),
      expiresAt: new Date('2025-01-14T15:20:00')
    },
    {
      id: 3,
      shortCode: 'ghi56',
      originalUrl: 'https://github.com/facebook/react',
      status: 'expired',
      clicks: 156,
      createdAt: new Date('2025-01-13T09:15:00'),
      expiresAt: new Date('2025-01-13T09:45:00')
    },
    {
      id: 4,
      shortCode: 'jkl78',
      originalUrl: 'https://stackoverflow.com/questions/react-hooks',
      status: 'active',
      clicks: 67,
      createdAt: new Date('2025-01-12T16:45:00'),
      expiresAt: new Date('2025-01-12T17:45:00')
    },
    {
      id: 5,
      shortCode: 'mno90',
      originalUrl: 'https://www.npmjs.com/package/react-router-dom',
      status: 'disabled',
      clicks: 23,
      createdAt: new Date('2025-01-11T11:30:00'),
      expiresAt: new Date('2025-01-11T12:30:00')
    }
  ];

  const tabs = [
    {
      id: 'default',
      label: 'Default Settings',
      icon: 'Settings',
      description: 'Configure default URL creation preferences'
    },
    {
      id: 'bulk',
      label: 'Bulk Operations',
      icon: 'Database',
      description: 'Manage multiple URLs at once'
    },
    {
      id: 'account',
      label: 'Account Preferences',
      icon: 'User',
      description: 'Notification and privacy settings'
    }
  ];

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleSettingsChange = (newSettings) => {
    setDefaultSettings(newSettings);
    showSuccess('Default settings saved successfully!');
  };

  const handlePreferencesChange = (newPreferences) => {
    setAccountPreferences(newPreferences);
    showSuccess('Account preferences updated successfully!');
  };

  const handleBulkAction = (actionData) => {
    const { action, urlIds } = actionData;
    let message = '';
    
    switch (action) {
      case 'delete':
        message = `Successfully deleted ${urlIds?.length} URL${urlIds?.length !== 1 ? 's' : ''}`;
        break;
      case 'extend':
        message = `Successfully extended expiration for ${urlIds?.length} URL${urlIds?.length !== 1 ? 's' : ''}`;
        break;
      case 'export':
        message = `Successfully exported ${urlIds?.length} URL${urlIds?.length !== 1 ? 's' : ''} to CSV`;
        break;
      case 'disable':
        message = `Successfully disabled ${urlIds?.length} URL${urlIds?.length !== 1 ? 's' : ''}`;
        break;
      case 'enable':
        message = `Successfully enabled ${urlIds?.length} URL${urlIds?.length !== 1 ? 's' : ''}`;
        break;
      default:
        message = 'Bulk operation completed successfully';
    }
    
    showSuccess(message);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'default':
        return (
          <DefaultSettingsTab
            settings={defaultSettings}
            onSettingsChange={handleSettingsChange}
          />
        );
      case 'bulk':
        return (
          <BulkOperationsTab
            urls={mockUrls}
            onBulkAction={handleBulkAction}
          />
        );
      case 'account':
        return (
          <AccountPreferencesTab
            preferences={accountPreferences}
            onPreferencesChange={handlePreferencesChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>URL Management Settings - LinkShort Pro</title>
        <meta name="description" content="Configure your URL shortening preferences, manage bulk operations, and customize account settings in LinkShort Pro." />
      </Helmet>
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <Icon name="Settings" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary">URL Management Settings</h1>
                <p className="text-text-secondary">Configure your preferences and manage your URLs efficiently</p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-center space-x-2">
              <Icon name="CheckCircle" size={20} className="text-success" />
              <span className="text-success font-medium">{successMessage}</span>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="bg-surface border border-border rounded-lg mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8 px-6" aria-label="Settings tabs">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`
                      flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-smooth
                      ${activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-muted-foreground'
                      }
                    `}
                  >
                    <Icon name={tab?.icon} size={18} />
                    <span className="hidden sm:inline">{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Description */}
            <div className="px-6 py-4 bg-muted/30">
              <p className="text-sm text-text-secondary">
                {tabs?.find(tab => tab?.id === activeTab)?.description}
              </p>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-surface border border-border rounded-lg">
            <div className="p-6">
              {renderTabContent()}
            </div>
          </div>

          {/* Mobile Tab Navigation (Accordion Style) */}
          <div className="sm:hidden mt-6">
            <div className="space-y-2">
              {tabs?.map((tab) => (
                <div key={tab?.id} className="bg-surface border border-border rounded-lg">
                  <button
                    onClick={() => setActiveTab(activeTab === tab?.id ? '' : tab?.id)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon name={tab?.icon} size={20} className="text-primary" />
                      <div>
                        <div className="font-medium text-text-primary">{tab?.label}</div>
                        <div className="text-sm text-text-secondary">{tab?.description}</div>
                      </div>
                    </div>
                    <Icon 
                      name={activeTab === tab?.id ? "ChevronUp" : "ChevronDown"} 
                      size={20} 
                      className="text-text-secondary" 
                    />
                  </button>
                  
                  {activeTab === tab?.id && (
                    <div className="border-t border-border p-4">
                      {renderTabContent()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default URLManagementSettings;