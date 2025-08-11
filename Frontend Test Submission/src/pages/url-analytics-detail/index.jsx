import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Typography, Box, Card, CardContent, Grid, Switch, FormControlLabel, Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { 
  ArrowBack, 
  Refresh,
  MousePointer,
  Users,
  TrendingUp,
  Schedule,
  Language,
  Link
} from '@mui/icons-material';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MetricsCard from './components/MetricsCard';




import urlStorage from '../../utils/urlStorage';
import { logUIAction } from '../../utils/logger';

const UrlAnalyticsDetail = () => {
  const [searchParams] = useSearchParams();
  const shortcode = searchParams?.get('shortcode');
  
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [urlData, setUrlData] = useState(null);
  const [clickStats, setClickStats] = useState(null);

  // Load URL data and statistics
  useEffect(() => {
    if (shortcode) {
      loadUrlData();
    }
  }, [shortcode]);

  // Auto-refresh analytics data every 30 seconds
  useEffect(() => {
    let interval;
    if (isAutoRefresh && shortcode) {
      interval = setInterval(() => {
        loadUrlData();
        setLastUpdated(new Date());
      }, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoRefresh, shortcode]);

  const loadUrlData = () => {
    try {
      const url = urlStorage?.getUrl(shortcode);
      if (url) {
        const stats = urlStorage?.getClickStats(shortcode);
        setUrlData(url);
        setClickStats(stats);
      }
    } catch (error) {
      console.error('Failed to load URL data:', error);
    }
  };

  const handleRefresh = () => {
    loadUrlData();
    setLastUpdated(new Date());
    logUIAction('Manual refresh analytics', 'UrlAnalyticsDetail', { shortcode });
  };

  const formatLastUpdated = () => {
    return lastUpdated?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (!shortcode) {
    return (
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Typography variant="h5" color="error">
          No URL selected for analytics
        </Typography>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => window.history?.back()}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (!urlData) {
    return (
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Typography variant="h5" color="error">
          URL not found: /{shortcode}
        </Typography>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => window.history?.back()}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  const metricsData = [
    {
      title: "Total Clicks",
      value: clickStats?.total?.toString() || "0",
      subtitle: "All time clicks",
      icon: MousePointer,
      trend: "up",
      trendValue: clickStats?.total > 0 ? "+100%" : "0%"
    },
    {
      title: "Unique Visitors",
      value: clickStats?.unique?.toString() || "0",
      subtitle: "Distinct users",
      icon: Users,
      trend: "up", 
      trendValue: clickStats?.unique > 0 ? "+100%" : "0%"
    },
    {
      title: "Click-Through Rate",
      value: clickStats?.total > 0 ? 
        `${Math.round((clickStats?.unique / clickStats?.total) * 100)}%` : "0%",
      subtitle: "Unique/Total ratio",
      icon: TrendingUp,
      trend: "neutral",
      trendValue: "0%"
    },
    {
      title: "Time to Expire",
      value: urlData?.expiresAt > new Date() ? 
        Math.ceil((urlData?.expiresAt - new Date()) / (1000 * 60 * 60)) + "h" : "Expired",
      subtitle: "Hours remaining",
      icon: Schedule,
      trend: urlData?.expiresAt > new Date() ? "down" : "expired",
      trendValue: ""
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Container maxWidth="lg" sx={{ pt: { xs: 2, sm: 4 }, pb: 4 }}>
        <Breadcrumb />
        
        {/* Page Header */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, 
                   alignItems: { xs: 'flex-start', lg: 'center' }, 
                   justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              URL Analytics Detail
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Comprehensive performance insights for /{shortcode}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: { xs: 2, lg: 0 } }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isAutoRefresh}
                  onChange={(e) => setIsAutoRefresh(e?.target?.checked)}
                />
              }
              label="Auto-refresh"
            />
            <Typography variant="caption" color="text.secondary">
              Last updated: {formatLastUpdated()}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBack />} 
              onClick={() => window.history?.back()}
            >
              Back
            </Button>
          </Box>
        </Box>

        {/* URL Summary Card */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Link color="primary" />
              <Typography variant="h6">URL Information</Typography>
              <Chip 
                label={urlData?.expiresAt > new Date() ? "Active" : "Expired"}
                color={urlData?.expiresAt > new Date() ? "success" : "error"}
                size="small"
              />
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Typography variant="body2" color="text.secondary">Original URL:</Typography>
                <Typography variant="body1" sx={{ wordBreak: 'break-all', mb: 2 }}>
                  {urlData?.originalUrl}
                </Typography>
                <Typography variant="body2" color="text.secondary">Short URL:</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                  {window?.location?.origin}/{shortcode}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">Created:</Typography>
                <Typography variant="body1" gutterBottom>
                  {urlData?.createdAt?.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">Expires:</Typography>
                <Typography variant="body1">
                  {urlData?.expiresAt?.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {metricsData?.map((metric, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <MetricsCard
                title={metric?.title}
                value={metric?.value}
                subtitle={metric?.subtitle}
                icon={metric?.icon}
                trend={metric?.trend}
                trendValue={metric?.trendValue}
              />
            </Grid>
          ))}
        </Grid>

        {/* Click Analytics */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            {/* Click History */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Click History
                </Typography>
                {clickStats?.recentClicks?.length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Timestamp</TableCell>
                          <TableCell>Source</TableCell>
                          <TableCell>Location</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {clickStats?.recentClicks?.map((click, index) => (
                          <TableRow key={index}>
                            <TableCell>{click?.timestamp?.toLocaleString()}</TableCell>
                            <TableCell>{click?.referrer || 'Direct'}</TableCell>
                            <TableCell>{click?.location || 'Unknown'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography color="text.secondary">No clicks recorded yet</Typography>
                )}
              </CardContent>
            </Card>

            {/* Geographical Distribution */}
            {Object.keys(clickStats?.locationStats || {})?.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Language />
                    Location Distribution
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.entries(clickStats?.locationStats || {})?.map(([location, count]) => (
                      <Grid item xs={6} sm={4} key={location}>
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {location}
                          </Typography>
                          <Typography variant="h6">
                            {count} clicks
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Right Column - Traffic Sources */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Traffic Sources
                </Typography>
                {Object.keys(clickStats?.referrerStats || {})?.length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    {Object.entries(clickStats?.referrerStats || {})?.map(([source, count]) => (
                      <Box key={source} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {source}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {count}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography color="text.secondary">
                    No traffic sources recorded yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default UrlAnalyticsDetail;