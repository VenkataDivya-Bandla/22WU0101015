import logger, { logUrlOperation, logError } from './logger';

const STORAGE_KEY = 'urlShortener_urls';
const CLICKS_KEY = 'urlShortener_clicks';

class UrlStorageManager {
  constructor() {
    this.urls = new Map();
    this.clicks = new Map();
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      // Load URLs
      const storedUrls = localStorage?.getItem(STORAGE_KEY);
      if (storedUrls) {
        const parsed = JSON.parse(storedUrls);
        Object.entries(parsed)?.forEach(([shortcode, data]) => {
          this.urls?.set(shortcode?.toLowerCase(), {
            ...data,
            createdAt: new Date(data?.createdAt),
            expiresAt: new Date(data?.expiresAt)
          });
        });
      }

      // Load clicks
      const storedClicks = localStorage?.getItem(CLICKS_KEY);
      if (storedClicks) {
        const parsed = JSON.parse(storedClicks);
        Object.entries(parsed)?.forEach(([shortcode, clicks]) => {
          this.clicks?.set(shortcode?.toLowerCase(), clicks?.map(click => ({
            ...click,
            timestamp: new Date(click?.timestamp)
          })));
        });
      }

      logUrlOperation('Storage loaded', { 
        urlCount: this.urls?.size, 
        totalClicks: this.getTotalClicksCount() 
      });
    } catch (error) {
      logError(error, { context: 'loadFromStorage' });
    }
  }

  saveToStorage() {
    try {
      // Save URLs
      const urlsObj = {};
      this.urls?.forEach((data, shortcode) => {
        urlsObj[shortcode] = data;
      });
      localStorage?.setItem(STORAGE_KEY, JSON.stringify(urlsObj));

      // Save clicks
      const clicksObj = {};
      this.clicks?.forEach((clicks, shortcode) => {
        clicksObj[shortcode] = clicks;
      });
      localStorage?.setItem(CLICKS_KEY, JSON.stringify(clicksObj));
    } catch (error) {
      logError(error, { context: 'saveToStorage' });
    }
  }

  createUrl(urlData) {
    const shortcode = urlData?.shortcode?.toLowerCase();
    
    console.log('UrlStorage: Creating URL with data:', urlData);
    console.log('UrlStorage: Normalized shortcode:', shortcode);
    
    if (this.urls?.has(shortcode)) {
      console.error('UrlStorage: Shortcode already exists:', shortcode);
      throw new Error('Shortcode already exists');
    }

    const urlEntry = {
      ...urlData,
      createdAt: new Date(urlData?.createdAt),
      expiresAt: new Date(urlData?.expiresAt),
      clickCount: 0
    };

    console.log('UrlStorage: Storing URL entry:', urlEntry);

    this.urls?.set(shortcode, urlEntry);
    this.clicks?.set(shortcode, []);
    this.saveToStorage();

    logUrlOperation('URL created', { shortcode, originalUrl: urlData?.originalUrl });
    return urlEntry;
  }

  getUrl(shortcode) {
    console.log('UrlStorage: Getting URL for shortcode:', shortcode);
    console.log('UrlStorage: All stored URLs:', Array.from(this.urls.entries()));
    
    const url = this.urls?.get(shortcode?.toLowerCase());
    console.log('UrlStorage: Retrieved URL:', url);
    
    if (!url) return null;

    // Check if URL has expired
    if (new Date() > url?.expiresAt) {
      console.log('UrlStorage: URL expired for shortcode:', shortcode);
      logUrlOperation('URL access attempted - expired', { shortcode });
      return { ...url, expired: true };
    }

    return url;
  }

  getAllUrls() {
    const urls = [];
    this.urls?.forEach((urlData, shortcode) => {
      const clicks = this.clicks?.get(shortcode) || [];
      urls?.push({
        ...urlData,
        shortcode,
        clickCount: clicks?.length,
        clicks
      });
    });

    return urls?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));
  }

  deleteUrl(shortcode) {
    const normalizedShortcode = shortcode?.toLowerCase();
    const deleted = this.urls?.delete(normalizedShortcode);
    this.clicks?.delete(normalizedShortcode);
    
    if (deleted) {
      this.saveToStorage();
      logUrlOperation('URL deleted', { shortcode });
    }
    
    return deleted;
  }

  trackClick(shortcode, clickData = {}) {
    const normalizedShortcode = shortcode?.toLowerCase();
    const url = this.getUrl(normalizedShortcode);
    
    if (!url || url?.expired) {
      return false;
    }

    const click = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      referrer: document?.referrer || 'direct',
      userAgent: navigator?.userAgent?.substring(0, 100),
      location: this.getApproximateLocation(),
      ...clickData
    };

    if (!this.clicks?.has(normalizedShortcode)) {
      this.clicks?.set(normalizedShortcode, []);
    }
    
    this.clicks?.get(normalizedShortcode)?.push(click);
    this.saveToStorage();

    logUrlOperation('Click tracked', { 
      shortcode, 
      referrer: click?.referrer,
      location: click?.location 
    });

    return true;
  }

  getApproximateLocation() {
    // Simple location approximation based on timezone
    const timezone = Intl.DateTimeFormat()?.resolvedOptions()?.timeZone;
    const locationMap = {
      'Asia/Kolkata': 'India',
      'Asia/Delhi': 'Delhi, India',
      'Asia/Mumbai': 'Mumbai, India',
      'Asia/Bangalore': 'Bangalore, India',
      'Asia/Chennai': 'Chennai, India',
      'Asia/Hyderabad': 'Hyderabad, India',
      'America/New_York': 'New York, USA',
      'America/Los_Angeles': 'California, USA',
      'Europe/London': 'London, UK',
      'Europe/Paris': 'Paris, France'
    };
    
    return locationMap?.[timezone] || timezone?.split('/')?.[1] || 'Unknown';
  }

  getClickStats(shortcode) {
    const normalizedShortcode = shortcode?.toLowerCase();
    const clicks = this.clicks?.get(normalizedShortcode) || [];
    
    const referrerStats = {};
    const locationStats = {};
    const hourlyStats = new Array(24)?.fill(0);
    
    clicks?.forEach(click => {
      // Referrer stats
      const referrer = new URL(click?.referrer || 'http://direct')?.hostname || 'direct';
      referrerStats[referrer] = (referrerStats?.[referrer] || 0) + 1;
      
      // Location stats
      locationStats[click?.location || 'Unknown'] = (locationStats?.[click?.location || 'Unknown'] || 0) + 1;
      
      // Hourly stats
      const hour = new Date(click?.timestamp)?.getHours();
      hourlyStats[hour]++;
    });

    return {
      total: clicks?.length,
      unique: new Set(clicks?.map(c => c?.userAgent))?.size,
      referrerStats,
      locationStats,
      hourlyStats,
      recentClicks: clicks?.slice(0, 10)
    };
  }

  getTotalClicksCount() {
    let total = 0;
    this.clicks?.forEach(clicks => {
      total += clicks?.length;
    });
    return total;
  }

  shortcodeExists(shortcode) {
    return this.urls?.has(shortcode?.toLowerCase());
  }

  generateUniqueShortcode() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'; // Only lowercase and numbers
    let attempts = 0;
    const maxAttempts = 100;
    
    while (attempts < maxAttempts) {
      let result = '';
      for (let i = 0; i < 6; i++) {
        result += chars?.charAt(Math.floor(Math.random() * chars?.length));
      }
      
      if (!this.shortcodeExists(result)) {
        return result;
      }
      attempts++;
    }
    
    throw new Error('Unable to generate unique shortcode');
  }

  clearExpiredUrls() {
    const now = new Date();
    let clearedCount = 0;
    
    for (const [shortcode, urlData] of this.urls?.entries()) {
      if (now > urlData?.expiresAt) {
        this.urls?.delete(shortcode);
        this.clicks?.delete(shortcode);
        clearedCount++;
      }
    }
    
    if (clearedCount > 0) {
      this.saveToStorage();
      logUrlOperation('Expired URLs cleared', { count: clearedCount });
    }
    
    return clearedCount;
  }

  exportData() {
    return {
      urls: Object.fromEntries(this.urls),
      clicks: Object.fromEntries(this.clicks),
      exported: new Date()?.toISOString()
    };
  }

  // Debug function to check what's stored
  debugStorage() {
    console.log('=== URL Storage Debug ===');
    console.log('All stored URLs:');
    this.urls?.forEach((urlData, shortcode) => {
      console.log(`Shortcode: ${shortcode} -> ${urlData.originalUrl}`);
    });
    console.log('All stored clicks:');
    this.clicks?.forEach((clicks, shortcode) => {
      console.log(`Shortcode: ${shortcode} -> ${clicks.length} clicks`);
    });
    console.log('=== End Debug ===');
  }
}

// Create singleton instance
const urlStorage = new UrlStorageManager();

// Periodic cleanup of expired URLs (every 5 minutes)
setInterval(() => {
  urlStorage?.clearExpiredUrls();
}, 5 * 60 * 1000);

export default urlStorage;