import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DefaultSettingsTab = ({ settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  const expirationOptions = [
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 hour' },
    { value: '120', label: '2 hours' },
    { value: '240', label: '4 hours' },
    { value: '480', label: '8 hours' },
    { value: '720', label: '12 hours' },
    { value: '1440', label: '24 hours' },
    { value: '2880', label: '2 days' },
    { value: '4320', label: '3 days' },
    { value: '10080', label: '7 days' }
  ];

  const shortcodePatternOptions = [
    { value: 'alphanumeric', label: 'Alphanumeric (a-z, 0-9)' },
    { value: 'letters', label: 'Letters only (a-z)' },
    { value: 'numbers', label: 'Numbers only (0-9)' },
    { value: 'mixed', label: 'Mixed case (A-z, 0-9)' }
  ];

  const shortcodeLengthOptions = [
    { value: '4', label: '4 characters' },
    { value: '5', label: '5 characters' },
    { value: '6', label: '6 characters' },
    { value: '7', label: '7 characters' },
    { value: '8', label: '8 characters' }
  ];

  const handleSettingChange = (key, value) => {
    const updatedSettings = { ...localSettings, [key]: value };
    setLocalSettings(updatedSettings);
    setHasChanges(true);
  };

  const handleSave = () => {
    onSettingsChange(localSettings);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalSettings(settings);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* URL Expiration Settings */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Clock" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">URL Expiration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Default Expiration Time"
            description="Default validity period for new URLs"
            options={expirationOptions}
            value={localSettings?.defaultExpiration}
            onChange={(value) => handleSettingChange('defaultExpiration', value)}
          />
          
          <Input
            label="Custom Expiration (minutes)"
            type="number"
            placeholder="Enter custom minutes"
            description="Override with custom expiration time"
            value={localSettings?.customExpiration}
            onChange={(e) => handleSettingChange('customExpiration', e?.target?.value)}
            min="1"
            max="43200"
          />
        </div>

        <div className="mt-4">
          <Checkbox
            label="Allow users to set custom expiration"
            description="Enable custom expiration time input for users"
            checked={localSettings?.allowCustomExpiration}
            onChange={(e) => handleSettingChange('allowCustomExpiration', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Shortcode Generation Settings */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Hash" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Shortcode Generation</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Character Pattern"
            description="Type of characters to use in shortcodes"
            options={shortcodePatternOptions}
            value={localSettings?.shortcodePattern}
            onChange={(value) => handleSettingChange('shortcodePattern', value)}
          />
          
          <Select
            label="Shortcode Length"
            description="Number of characters in generated shortcodes"
            options={shortcodeLengthOptions}
            value={localSettings?.shortcodeLength}
            onChange={(value) => handleSettingChange('shortcodeLength', value)}
          />
        </div>

        <div className="mt-4 space-y-3">
          <Checkbox
            label="Allow custom shortcodes"
            description="Let users specify their own shortcode"
            checked={localSettings?.allowCustomShortcode}
            onChange={(e) => handleSettingChange('allowCustomShortcode', e?.target?.checked)}
          />
          
          <Checkbox
            label="Case sensitive shortcodes"
            description="Differentiate between uppercase and lowercase"
            checked={localSettings?.caseSensitive}
            onChange={(e) => handleSettingChange('caseSensitive', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Analytics Settings */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="BarChart3" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Analytics Preferences</h3>
        </div>
        
        <div className="space-y-3">
          <Checkbox
            label="Track click analytics"
            description="Record click statistics for shortened URLs"
            checked={localSettings?.trackAnalytics}
            onChange={(e) => handleSettingChange('trackAnalytics', e?.target?.checked)}
          />
          
          <Checkbox
            label="Track geographical data"
            description="Record visitor location information"
            checked={localSettings?.trackGeography}
            onChange={(e) => handleSettingChange('trackGeography', e?.target?.checked)}
          />
          
          <Checkbox
            label="Track referrer information"
            description="Record where visitors came from"
            checked={localSettings?.trackReferrer}
            onChange={(e) => handleSettingChange('trackReferrer', e?.target?.checked)}
          />
          
          <Checkbox
            label="Track device information"
            description="Record visitor device and browser details"
            checked={localSettings?.trackDevice}
            onChange={(e) => handleSettingChange('trackDevice', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Live Preview */}
      <div className="bg-muted border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Eye" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Live Preview</h3>
        </div>
        
        <div className="bg-surface border border-border rounded-md p-4">
          <p className="text-sm text-text-secondary mb-2">New URL with current settings:</p>
          <div className="font-mono text-sm bg-muted p-2 rounded border">
            <span className="text-text-secondary">https://linkshort.pro/</span>
            <span className="text-primary font-semibold">
              {localSettings?.shortcodePattern === 'letters' ? 'abcde' : 
               localSettings?.shortcodePattern === 'numbers' ? '12345' : 
               localSettings?.shortcodePattern === 'mixed' ? 'Ab3De' : 'abc12'}
              {localSettings?.shortcodeLength > 5 ? 'f' : ''}
              {localSettings?.shortcodeLength > 6 ? 'g' : ''}
              {localSettings?.shortcodeLength > 7 ? 'h' : ''}
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-2">
            Expires in {expirationOptions?.find(opt => opt?.value === localSettings?.defaultExpiration)?.label || '30 minutes'}
          </p>
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
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DefaultSettingsTab;