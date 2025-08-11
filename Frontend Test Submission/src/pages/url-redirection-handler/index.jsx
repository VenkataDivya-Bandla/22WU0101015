import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import RedirectionAnalytics from './components/RedirectionAnalytics';
import RedirectionValidator from './components/RedirectionValidator';

const URLRedirectionHandler = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [redirectionState, setRedirectionState] = useState('loading');
  const [errorType, setErrorType] = useState(null);
  const [mapping, setMapping] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const { captureAnalytics } = RedirectionAnalytics();
  const { validateRedirection } = RedirectionValidator();

  // Extract shortcode from URL path
  const extractShortcode = () => {
    const pathname = location?.pathname;
    // Handle routes like /abcd1, /xyz123, etc.
    const pathSegments = pathname?.split('/')?.filter(segment => segment);
    
    // If we're on the redirection handler route, get shortcode from params
    if (pathSegments?.[0] === 'url-redirection-handler' && pathSegments?.[1]) {
      return pathSegments?.[1];
    }
    
    // If direct shortcode access (e.g., /abcd1), use the first segment
    if (pathSegments?.length === 1 && pathSegments?.[0] !== 'url-redirection-handler') {
      return pathSegments?.[0];
    }
    
    return shortcode;
  };

  const processRedirection = async (targetShortcode) => {
    try {
      setRedirectionState('loading');
      
      // Add artificial delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 800));

      // Validate the redirection
      const validation = validateRedirection(targetShortcode);
      
      if (!validation?.isValid) {
        setErrorType(validation?.error);
        setRedirectionState('error');
        return;
      }

      const { mapping: validMapping } = validation;
      setMapping(validMapping);

      // Capture analytics data
      captureAnalytics(targetShortcode, validMapping?.originalUrl);

      // Show success state briefly before redirect
      setRedirectionState('redirecting');
      
      // Redirect after brief delay
      setTimeout(() => {
        window.location.href = validMapping?.originalUrl;
      }, 1000);

    } catch (error) {
      console.error('Redirection processing error:', error);
      setErrorType('networkError');
      setRedirectionState('error');
    }
  };

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      const targetShortcode = extractShortcode();
      if (targetShortcode) {
        processRedirection(targetShortcode);
      }
    }
  };

  useEffect(() => {
    const targetShortcode = extractShortcode();
    
    if (!targetShortcode) {
      // If no shortcode found, redirect to dashboard
      navigate('/url-shortener-dashboard');
      return;
    }

    processRedirection(targetShortcode);
  }, [location?.pathname]);

  const renderContent = () => {
    const targetShortcode = extractShortcode();

    switch (redirectionState) {
      case 'loading':
        return <LoadingSpinner message="Validating shortcode..." />;
      
      case 'redirecting':
        return (
          <LoadingSpinner 
            message={`Redirecting to ${mapping?.originalUrl ? new URL(mapping.originalUrl)?.hostname : 'destination'}...`} 
          />
        );
      
      case 'error':
        return (
          <ErrorDisplay
            type={errorType}
            shortcode={targetShortcode}
            onRetry={retryCount < 3 ? handleRetry : null}
          />
        );
      
      default:
        return <LoadingSpinner />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-lg shadow-subtle border border-border p-8 md:p-12">
              {renderContent()}
            </div>
            
            {/* Additional context for error states */}
            {redirectionState === 'error' && (
              <div className="mt-8 text-center">
                <div className="bg-muted rounded-lg p-6">
                  <h3 className="text-lg font-medium text-text-primary mb-2">
                    Need Help?
                  </h3>
                  <p className="text-text-secondary text-sm mb-4">
                    If you believe this is an error, please contact support or try creating a new shortened URL.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center text-xs text-text-secondary">
                    <span>Error Code: {errorType?.toUpperCase()}</span>
                    <span>•</span>
                    <span>Time: {new Date()?.toLocaleTimeString()}</span>
                    <span>•</span>
                    <span>Attempts: {retryCount + 1}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default URLRedirectionHandler;