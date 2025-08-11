import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Error } from '@mui/icons-material';
import urlStorage from '../utils/urlStorage';
import { logClickEvent, logError } from '../utils/logger';

const RedirectHandler = () => {
  const { shortcode } = useParams();

  useEffect(() => {
    if (!shortcode) {
      window.location.href = '/';
      return;
    }

    const handleRedirect = async () => {
      try {
        console.log('RedirectHandler: Processing shortcode:', shortcode);
        
        const url = urlStorage?.getUrl(shortcode);
        console.log('RedirectHandler: Retrieved URL data:', url);
        
        if (!url) {
          console.error('RedirectHandler: URL not found for shortcode:', shortcode);
          logError(new Error('URL not found'), { shortcode });
          showErrorPage('URL not found. This link may have been deleted or never existed.');
          return;
        }

        if (url?.expired) {
          console.error('RedirectHandler: URL expired for shortcode:', shortcode);
          logError(new Error('URL expired'), { shortcode, expiresAt: url?.expiresAt });
          showErrorPage('This link has expired and is no longer available.');
          return;
        }

        console.log('RedirectHandler: Redirecting to original URL:', url?.originalUrl);

        // Track the click
        const clickTracked = urlStorage?.trackClick(shortcode, {
          referrer: document?.referrer,
          timestamp: new Date()
        });

        if (clickTracked) {
          logClickEvent(shortcode, url?.originalUrl, {
            referrer: document?.referrer
          });
        }

        // Redirect to original URL
        window.location.href = url?.originalUrl;
        
      } catch (error) {
        console.error('RedirectHandler: Error during redirect:', error);
        logError(error, { shortcode, context: 'redirect_handler' });
        showErrorPage('An error occurred while processing this link. Please try again.');
      }
    };

    const showErrorPage = (message) => {
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
            <h1 style="color: #d32f2f; margin-bottom: 16px; font-size: 24px;">Link Not Available</h1>
            <p style="color: #666; margin-bottom: 24px; line-height: 1.5;">${message}</p>
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
    };

    // Add a small delay to show loading state
    setTimeout(handleRedirect, 500);
  }, [shortcode]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ bgcolor: '#f5f5f5' }}
      padding={3}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4,
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 2,
          maxWidth: 400,
          textAlign: 'center'
        }}
      >
        <CircularProgress size={48} sx={{ mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
          Redirecting...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please wait while we take you to your destination
        </Typography>
      </Box>
    </Box>
  );
};

export default RedirectHandler;