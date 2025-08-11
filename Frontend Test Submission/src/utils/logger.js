class CustomLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000; // Prevent memory issues
  }

  createLogEntry(level, message, context = {}) {
    const logEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date()?.toISOString(),
      level,
      message,
      context,
      url: window?.location?.href,
      userAgent: navigator?.userAgent?.substring(0, 100)
    };

    this.logs?.unshift(logEntry);
    
    // Maintain log size limit
    if (this.logs?.length > this.maxLogs) {
      this.logs = this.logs?.slice(0, this.maxLogs);
    }

    // Store in localStorage for persistence
    this.persistLogs();
    
    return logEntry;
  }

  info(message, context) {
    const logEntry = this.createLogEntry('INFO', message, context);
    this.outputToConsole('info', logEntry);
    return logEntry;
  }

  warn(message, context) {
    const logEntry = this.createLogEntry('WARN', message, context);
    this.outputToConsole('warn', logEntry);
    return logEntry;
  }

  error(message, context) {
    const logEntry = this.createLogEntry('ERROR', message, context);
    this.outputToConsole('error', logEntry);
    return logEntry;
  }

  debug(message, context) {
    const logEntry = this.createLogEntry('DEBUG', message, context);
    this.outputToConsole('debug', logEntry);
    return logEntry;
  }

  outputToConsole(level, logEntry) {
    const formattedMessage = `[${logEntry?.timestamp}] ${logEntry?.level}: ${logEntry?.message}`;
    
    if (level === 'error') {
      // Use console methods for production debugging
      if (typeof console !== 'undefined' && console?.error) {
        console.error(formattedMessage, logEntry?.context);
      }
    } else if (level === 'warn') {
      if (typeof console !== 'undefined' && console?.warn) {
        console.warn(formattedMessage, logEntry?.context);
      }
    } else if (level === 'info') {
      if (typeof console !== 'undefined' && console?.info) {
        console.info(formattedMessage, logEntry?.context);
      }
    } else if (level === 'debug') {
      if (typeof console !== 'undefined' && console?.debug) {
        console.debug(formattedMessage, logEntry?.context);
      }
    }
  }

  persistLogs() {
    try {
      const recentLogs = this.logs?.slice(0, 100); // Store only recent 100 logs
      localStorage?.setItem('urlShortener_logs', JSON.stringify(recentLogs));
    } catch (error) {
      // Handle localStorage quota exceeded
      if (error?.name === 'QuotaExceededError') {
        localStorage?.removeItem('urlShortener_logs');
      }
    }
  }

  getLogs(level = null, limit = 50) {
    let filteredLogs = this.logs;
    
    if (level) {
      filteredLogs = this.logs?.filter(log => log?.level === level?.toUpperCase());
    }
    
    return filteredLogs?.slice(0, limit);
  }

  clearLogs() {
    this.logs = [];
    localStorage?.removeItem('urlShortener_logs');
    this.info('Logs cleared');
  }

  exportLogs() {
    const exportData = {
      exported: new Date()?.toISOString(),
      total: this.logs?.length,
      logs: this.logs
    };
    
    return JSON.stringify(exportData, null, 2);
  }
}

// Create singleton instance
const logger = new CustomLogger();

// Initialize logs from localStorage on startup
try {
  const storedLogs = localStorage?.getItem('urlShortener_logs');
  if (storedLogs) {
    const parsedLogs = JSON.parse(storedLogs);
    if (Array.isArray(parsedLogs)) {
      logger.logs = parsedLogs;
    }
  }
} catch (error) {
  logger?.error('Failed to load stored logs', { error: error?.message });
}

// Log API request middleware
export const logApiRequest = (method, url, data = null) => {
  logger?.info(`API Request: ${method?.toUpperCase()} ${url}`, {
    method,
    url,
    requestData: data,
    timestamp: Date.now()
  });
};

// Log API response middleware
export const logApiResponse = (method, url, response, duration) => {
  const success = response?.status >= 200 && response?.status < 300;
  const logLevel = success ? 'info' : 'error';
  
  logger?.[logLevel](`API Response: ${method?.toUpperCase()} ${url} - ${response?.status}`, {
    method,
    url,
    status: response?.status,
    duration: duration ? `${duration}ms` : undefined,
    success
  });
};

// Log UI actions
export const logUIAction = (action, component, details = {}) => {
  logger?.info(`UI Action: ${action} in ${component}`, {
    action,
    component,
    ...details,
    timestamp: Date.now()
  });
};

// Log URL operations
export const logUrlOperation = (operation, data = {}) => {
  logger?.info(`URL Operation: ${operation}`, {
    operation,
    ...data,
    timestamp: Date.now()
  });
};

// Log click events for analytics
export const logClickEvent = (shortcode, originalUrl, clickData = {}) => {
  logger?.info(`Click tracked: ${shortcode} -> ${originalUrl}`, {
    shortcode,
    originalUrl,
    referrer: document?.referrer || 'direct',
    userAgent: navigator?.userAgent?.substring(0, 100),
    timestamp: Date.now(),
    ...clickData
  });
};

// Log errors with context
export const logError = (error, context = {}) => {
  logger?.error(error?.message || 'Unknown error', {
    error: {
      name: error?.name,
      message: error?.message,
      stack: error?.stack?.substring(0, 500)
    },
    ...context
  });
};

// Log validation errors
export const logValidationError = (field, value, errorMessage) => {
  logger?.warn(`Validation Error: ${field}`, {
    field,
    value: typeof value === 'string' ? value?.substring(0, 100) : value,
    error: errorMessage,
    timestamp: Date.now()
  });
};

export default logger;