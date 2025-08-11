import React from 'react';

const RedirectionAnalytics = () => {
  // Analytics data capture utility
  const captureAnalytics = (shortcode, originalUrl) => {
    const analyticsData = {
      shortcode,
      originalUrl,
      timestamp: new Date()?.toISOString(),
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat()?.resolvedOptions()?.timeZone,
      clickId: `click_${Date.now()}_${Math.random()?.toString(36)?.substr(2, 9)}`,
      sessionId: sessionStorage.getItem('linkshort_session') || `session_${Date.now()}`,
      // Mock geographical data (in real app would come from IP geolocation)
      location: {
        country: 'United States',
        region: 'California',
        city: 'San Francisco',
        coordinates: { lat: 37.7749, lng: -122.4194 }
      },
      device: {
        type: /Mobile|Android|iPhone|iPad/?.test(navigator.userAgent) ? 'mobile' : 'desktop',
        os: navigator.platform,
        browser: navigator.userAgent?.split(' ')?.pop()
      }
    };

    // Store analytics data in localStorage for persistence
    const existingAnalytics = JSON.parse(localStorage.getItem('linkshort_analytics') || '[]');
    existingAnalytics?.push(analyticsData);
    
    // Keep only last 1000 analytics entries
    if (existingAnalytics?.length > 1000) {
      existingAnalytics?.splice(0, existingAnalytics?.length - 1000);
    }
    
    localStorage.setItem('linkshort_analytics', JSON.stringify(existingAnalytics));

    // Update click count for the specific shortcode
    const urlMappings = JSON.parse(localStorage.getItem('linkshort_urls') || '[]');
    const updatedMappings = urlMappings?.map(mapping => {
      if (mapping?.shortcode === shortcode) {
        return {
          ...mapping,
          clickCount: (mapping?.clickCount || 0) + 1,
          lastClicked: new Date()?.toISOString()
        };
      }
      return mapping;
    });
    
    localStorage.setItem('linkshort_urls', JSON.stringify(updatedMappings));

    return analyticsData;
  };

  return { captureAnalytics };
};

export default RedirectionAnalytics;