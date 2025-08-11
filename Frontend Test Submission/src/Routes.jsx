import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import UrlShortenerDashboard from './pages/url-shortener-dashboard';
import Statistics from './pages/statistics';
import RedirectHandler from './components/RedirectHandler';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Home - URL Shortener Page */}
        <Route path="/" element={<UrlShortenerDashboard />} />
        
        {/* Statistics Page */}
        <Route path="/statistics" element={<Statistics />} />
        
        {/* Redirect Handler for short links */}
        <Route path="/:shortcode" element={<RedirectHandler />} />
        
        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;