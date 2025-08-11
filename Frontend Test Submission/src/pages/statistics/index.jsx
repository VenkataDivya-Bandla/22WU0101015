import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Container, Typography, Box, Card, CardContent, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Collapse, Chip, InputAdornment, Grid } from '@mui/material';
import { Search, ExpandMore, ExpandLess, Analytics } from '@mui/icons-material';
import Header from '../../components/ui/Header';
import urlStorage from '../../utils/urlStorage';
import { logUIAction } from '../../utils/logger';

const Statistics = () => {
  const [urls, setUrls] = useState([]);
  const [filteredUrls, setFilteredUrls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Load URLs and their statistics
  useEffect(() => {
    const loadUrlsWithStats = () => {
      const allUrls = urlStorage?.getAllUrls();
      const urlsWithStats = allUrls?.map(url => ({
        ...url,
        clickStats: urlStorage?.getClickStats(url?.shortcode)
      }));
      setUrls(urlsWithStats);
      setFilteredUrls(urlsWithStats);
      logUIAction('Statistics page loaded', 'Statistics', { urlCount: urlsWithStats?.length });
    };

    loadUrlsWithStats();
  }, []);

  // Filter URLs based on search term
  useEffect(() => {
    if (!searchTerm?.trim()) {
      setFilteredUrls(urls);
    } else {
      const filtered = urls?.filter(url => 
        url?.shortcode?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        url?.originalUrl?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
      setFilteredUrls(filtered);
      logUIAction('Search URLs', 'Statistics', { searchTerm, resultCount: filtered?.length });
    }
  }, [searchTerm, urls]);

  const toggleRowExpansion = (shortcode) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded?.has(shortcode)) {
      newExpanded?.delete(shortcode);
    } else {
      newExpanded?.add(shortcode);
    }
    setExpandedRows(newExpanded);
    logUIAction('Toggle click details', 'Statistics', { shortcode, expanded: !expandedRows?.has(shortcode) });
  };

  const getStatusChip = (url) => {
    const isExpired = new Date() > new Date(url?.expiresAt);
    return (
      <Chip 
        label={isExpired ? "Expired" : "Active"}
        color={isExpired ? "error" : "success"}
        size="small"
        variant="outlined"
      />
    );
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Helmet>
        <title>AffordMed URL Shortener - Statistics</title>
        <meta name="description" content="View statistics and analytics for your shortened URLs." />
      </Helmet>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <Header />
        
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Page Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Analytics color="primary" />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                Statistics
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              View detailed analytics and performance metrics for all your shortened URLs.
            </Typography>
          </Box>

          {/* Search Filter */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <TextField
                fullWidth
                label="Search"
                placeholder="Search by shortcode or original URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </CardContent>
          </Card>

          {/* Statistics Table */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                URL Statistics ({filteredUrls?.length} URLs)
              </Typography>
              
              {filteredUrls?.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Short Link</strong></TableCell>
                        <TableCell><strong>Created</strong></TableCell>
                        <TableCell><strong>Expiry</strong></TableCell>
                        <TableCell><strong>Clicks</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                        <TableCell><strong>Details</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredUrls?.map((url) => (
                        <React.Fragment key={url?.shortcode}>
                          <TableRow>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                                  /{url?.shortcode}
                                </Typography>
                                <Typography 
                                  variant="caption" 
                                  color="text.secondary"
                                  sx={{ 
                                    display: 'block',
                                    maxWidth: 200, 
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {url?.originalUrl}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{formatDate(url?.createdAt)}</TableCell>
                            <TableCell>{formatDate(url?.expiresAt)}</TableCell>
                            <TableCell>
                              <Typography variant="h6" color="primary">
                                {url?.clickStats?.total || 0}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {getStatusChip(url)}
                            </TableCell>
                            <TableCell>
                              {url?.clickStats?.total > 0 ? (
                                <Button
                                  size="small"
                                  startIcon={expandedRows?.has(url?.shortcode) ? <ExpandLess /> : <ExpandMore />}
                                  onClick={() => toggleRowExpansion(url?.shortcode)}
                                >
                                  View
                                </Button>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  No clicks
                                </Typography>
                              )}
                            </TableCell>
                          </TableRow>
                          
                          {/* Expandable Click Details */}
                          {expandedRows?.has(url?.shortcode) && (
                            <TableRow>
                              <TableCell colSpan={6} sx={{ bgcolor: '#f9f9f9' }}>
                                <Collapse in={expandedRows?.has(url?.shortcode)} timeout="auto" unmountOnExit>
                                  <Box sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                      Click Details for /{url?.shortcode}
                                    </Typography>
                                    
                                    {url?.clickStats?.recentClicks?.length > 0 ? (
                                      <>
                                        {/* Summary Stats */}
                                        <Grid container spacing={2} sx={{ mb: 3 }}>
                                          <Grid item xs={12} sm={4}>
                                            <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                                              <Typography variant="h4" color="primary">
                                                {url?.clickStats?.total}
                                              </Typography>
                                              <Typography variant="body2" color="text.secondary">
                                                Total Clicks
                                              </Typography>
                                            </Card>
                                          </Grid>
                                          <Grid item xs={12} sm={4}>
                                            <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                                              <Typography variant="h4" color="secondary">
                                                {url?.clickStats?.unique}
                                              </Typography>
                                              <Typography variant="body2" color="text.secondary">
                                                Unique Visitors
                                              </Typography>
                                            </Card>
                                          </Grid>
                                          <Grid item xs={12} sm={4}>
                                            <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                                              <Typography variant="h4" color="info.main">
                                                {Object.keys(url?.clickStats?.locationStats || {})?.length}
                                              </Typography>
                                              <Typography variant="body2" color="text.secondary">
                                                Locations
                                              </Typography>
                                            </Card>
                                          </Grid>
                                        </Grid>

                                        {/* Detailed Click History */}
                                        <TableContainer component={Paper} variant="outlined">
                                          <Table size="small">
                                            <TableHead>
                                              <TableRow>
                                                <TableCell><strong>Timestamp</strong></TableCell>
                                                <TableCell><strong>Source</strong></TableCell>
                                                <TableCell><strong>Location</strong></TableCell>
                                              </TableRow>
                                            </TableHead>
                                            <TableBody>
                                              {url?.clickStats?.recentClicks?.map((click, index) => (
                                                <TableRow key={index}>
                                                  <TableCell>
                                                    {new Date(click?.timestamp)?.toLocaleString()}
                                                  </TableCell>
                                                  <TableCell>
                                                    {click?.referrer && click?.referrer !== 'direct' 
                                                      ? new URL(click?.referrer)?.hostname 
                                                      : 'direct'
                                                    }
                                                  </TableCell>
                                                  <TableCell>{click?.location || 'Unknown'}</TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
                                        </TableContainer>

                                        {/* Location Distribution */}
                                        {Object.keys(url?.clickStats?.locationStats || {})?.length > 0 && (
                                          <Box sx={{ mt: 2 }}>
                                            <Typography variant="subtitle1" gutterBottom>
                                              Location Distribution:
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                              {Object.entries(url?.clickStats?.locationStats || {})?.map(([location, count]) => (
                                                <Chip 
                                                  key={location}
                                                  label={`${location}: ${count}`}
                                                  variant="outlined"
                                                  size="small"
                                                />
                                              ))}
                                            </Box>
                                          </Box>
                                        )}
                                      </>
                                    ) : (
                                      <Typography color="text.secondary">
                                        No click data available for this URL.
                                      </Typography>
                                    )}
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    {searchTerm ? 'No URLs found matching your search.' : 'No URLs created yet.'}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Statistics;