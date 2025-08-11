import React, { useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Routes from './Routes';
import urlStorage from './utils/urlStorage';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ]?.join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  useEffect(() => {
    // Debug: Show what's currently stored
    console.log('App: Debugging storage...');
    urlStorage?.debugStorage();
    
    // Handle direct URL access for shortcodes
    const path = window.location.pathname;
    const shortcode = path.substring(1); // Remove leading slash
    
    console.log('App: Current path:', path);
    console.log('App: Extracted shortcode:', shortcode);
    
    // Check if this looks like a shortcode (not empty, not a known route, no file extension)
    if (shortcode && 
        shortcode.length > 0 && 
        !shortcode.includes('.') && 
        shortcode !== 'statistics' && 
        shortcode !== 'test-redirect.html' &&
        shortcode !== 'test-fix.html' &&
        shortcode !== 'debug.html' &&
        shortcode !== 'redirect.html') {
      
      console.log('App: Detected potential shortcode:', shortcode);
      
      // Try to get the URL from storage
      const url = urlStorage?.getUrl(shortcode);
      console.log('App: Retrieved URL:', url);
      
      if (url && !url.expired) {
        console.log('App: Redirecting to:', url.originalUrl);
        
        // Track the click
        urlStorage?.trackClick(shortcode, {
          referrer: document?.referrer,
          timestamp: new Date()
        });
        
        // Redirect to the original URL immediately
        window.location.href = url.originalUrl;
        return;
      } else if (url && url.expired) {
        console.log('App: URL expired');
        // Show expired message
        document.body.innerHTML = `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background-color: #f5f5f5;
          ">
            <div style="
              max-width: 500px;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              background: white;
            ">
              <div style="
                width: 60px;
                height: 60px;
                background: #d32f2f;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 24px;
              ">
                <span style="color: white; font-size: 24px;">⚠</span>
              </div>
              <h1 style="color: #d32f2f; margin-bottom: 16px; font-size: 24px;">Link Expired</h1>
              <p style="color: #666; margin-bottom: 24px; line-height: 1.5;">This link has expired and is no longer available.</p>
              <button onClick="window.location.href='/'" style="
                background: #1976d2;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 4px;
                font-size: 16px;
                cursor: pointer;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 8px;
              ">
                🏠 Go to AffordMed URL Shortener
              </button>
            </div>
          </div>
        `;
        return;
      } else {
        console.log('App: URL not found for shortcode:', shortcode);
        // Show not found message
        document.body.innerHTML = `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background-color: #f5f5f5;
          ">
            <div style="
              max-width: 500px;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              background: white;
            ">
              <div style="
                width: 60px;
                height: 60px;
                background: #d32f2f;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 24px;
              ">
                <span style="color: white; font-size: 24px;">⚠</span>
              </div>
              <h1 style="color: #d32f2f; margin-bottom: 16px; font-size: 24px;">Link Not Found</h1>
              <p style="color: #666; margin-bottom: 24px; line-height: 1.5;">This link may have been deleted or never existed.</p>
              <p style="color: #999; font-size: 14px;">Shortcode: ${shortcode}</p>
              <button onClick="window.location.href='/'" style="
                background: #1976d2;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 4px;
                font-size: 16px;
                cursor: pointer;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 8px;
              ">
                🏠 Go to AffordMed URL Shortener
              </button>
            </div>
          </div>
        `;
        return;
      }
    } else {
      console.log('App: Not a shortcode, continuing with normal app load');
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes />
    </ThemeProvider>
  );
}

export default App;