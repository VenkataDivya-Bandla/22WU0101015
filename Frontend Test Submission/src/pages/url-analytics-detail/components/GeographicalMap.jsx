import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const GeographicalMap = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);

  const geographicalData = [
    { country: "United States", code: "US", clicks: 1247, percentage: 42.3, color: "#2563EB" },
    { country: "United Kingdom", code: "UK", clicks: 892, percentage: 30.2, color: "#10B981" },
    { country: "Canada", code: "CA", clicks: 456, percentage: 15.4, color: "#F59E0B" },
    { country: "Australia", code: "AU", clicks: 234, percentage: 7.9, color: "#EF4444" },
    { country: "Germany", code: "DE", clicks: 123, percentage: 4.2, color: "#8B5CF6" }
  ];

  const handleCountryHover = (country) => {
    setSelectedCountry(country);
  };

  const handleCountryLeave = () => {
    setSelectedCountry(null);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Geographical Distribution</h3>
        <Icon name="Globe" size={20} className="text-text-secondary" />
      </div>
      {/* World Map Placeholder */}
      <div className="relative bg-muted rounded-lg p-8 mb-6 min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <Icon name="MapPin" size={48} className="text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">Interactive World Map</p>
          <p className="text-sm text-text-secondary mt-2">
            {selectedCountry ? `Viewing: ${selectedCountry?.country}` : 'Hover over countries below to view details'}
          </p>
        </div>
      </div>
      {/* Country Statistics */}
      <div className="space-y-3">
        {geographicalData?.map((country, index) => (
          <div
            key={country?.code}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-smooth cursor-pointer"
            onMouseEnter={() => handleCountryHover(country)}
            onMouseLeave={handleCountryLeave}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: country?.color }}
              ></div>
              <div>
                <div className="font-medium text-text-primary">{country?.country}</div>
                <div className="text-sm text-text-secondary">{country?.code}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-text-primary">{country?.clicks?.toLocaleString()}</div>
              <div className="text-sm text-text-secondary">{country?.percentage}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeographicalMap;