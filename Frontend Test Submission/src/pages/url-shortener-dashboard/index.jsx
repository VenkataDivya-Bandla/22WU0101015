import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Container, Typography, Box, Alert, Card, CardContent, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Select, MenuItem, FormControl, InputLabel, Link } from '@mui/material';
import { 
  Add, 
  Delete, 
  ContentCopy, 
  Launch,
  CheckCircle, 
  Error 
} from '@mui/icons-material';
import Header from '../../components/ui/Header';
import urlStorage from '../../utils/urlStorage';
import { logUIAction, logError, logValidationError, logUrlOperation } from '../../utils/logger';

const UrlShortenerDashboard = () => {
  const [urlEntries, setUrlEntries] = useState([
    { id: 1, originalUrl: '', customShortcode: '', expirationMinutes: 30 }
  ]);
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load existing URLs on component mount
  useEffect(() => {
    try {
      const storedUrls = urlStorage?.getAllUrls();
      if (storedUrls?.length > 0) {
        setResults(storedUrls?.slice(0, 10)); // Show recent 10 URLs
      }
      logUIAction('Home page loaded', 'UrlShortenerDashboard', { urlCount: storedUrls?.length });
    } catch (error) {
      logError(error, { context: 'dashboard_load' });
    }
  }, []);

  const expirationOptions = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
    { value: 240, label: '4 hours' },
    { value: 480, label: '8 hours' },
    { value: 1440, label: '24 hours' }
  ];

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
    logUIAction('Show notification', 'UrlShortenerDashboard', { message, type });
  };

  const validateUrl = (url) => {
    if (!url?.trim()) return { valid: false, message: 'URL is required' };
    
    try {
      const urlObj = new URL(url);
      if (!urlObj?.protocol?.startsWith('http')) {
        return { valid: false, message: 'URL must start with http:// or https://' };
      }
      return { valid: true };
    } catch {
      return { valid: false, message: 'Please enter a valid URL' };
    }
  };

  const validateShortcode = (shortcode, entryId) => {
    if (!shortcode?.trim()) return { valid: true }; // Optional field
    
    if (shortcode?.length < 3 || shortcode?.length > 10) {
      return { valid: false, message: 'Shortcode must be 3-10 characters' };
    }
    
    if (!/^[a-zA-Z0-9]+$/?.test(shortcode)) {
      return { valid: false, message: 'Shortcode can only contain letters and numbers' };
    }
    
    if (urlStorage?.shortcodeExists(shortcode)) {
      return { valid: false, message: 'This shortcode is already taken' };
    }

    const duplicateInForm = urlEntries?.some(entry => 
      entry?.id !== entryId && 
      entry?.customShortcode?.toLowerCase() === shortcode?.toLowerCase()
    );
    
    if (duplicateInForm) {
      return { valid: false, message: 'This shortcode is already used in another entry' };
    }
    
    return { valid: true };
  };

  const addUrlEntry = () => {
    if (urlEntries?.length >= 5) {
      showNotification('Maximum 5 URLs allowed at once', 'error');
      return;
    }

    const newEntry = {
      id: Date.now(),
      originalUrl: '',
      customShortcode: '',
      expirationMinutes: 30
    };
    
    setUrlEntries(prev => [...prev, newEntry]);
    logUIAction('Add URL entry', 'UrlShortenerDashboard', { entryCount: urlEntries?.length + 1 });
  };

  const removeUrlEntry = (id) => {
    if (urlEntries?.length <= 1) return;
    
    setUrlEntries(prev => prev?.filter(entry => entry?.id !== id));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors?.[`url_${id}`];
      delete newErrors?.[`shortcode_${id}`];
      return newErrors;
    });
    
    logUIAction('Remove URL entry', 'UrlShortenerDashboard', { entryId: id });
  };

  const handleInputChange = (id, field, value) => {
    setUrlEntries(prev => prev?.map(entry =>
      entry?.id === id ? { ...entry, [field]: value } : entry
    ));

    const errorKey = `${field}_${id}`;
    if (errors?.[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors?.[errorKey];
        return newErrors;
      });
    }
  };

  const validateAllEntries = () => {
    const newErrors = {};
    let isValid = true;

    urlEntries?.forEach(entry => {
      const urlValidation = validateUrl(entry?.originalUrl);
      if (!urlValidation?.valid) {
        newErrors[`url_${entry?.id}`] = urlValidation?.message;
        isValid = false;
        logValidationError('originalUrl', entry?.originalUrl, urlValidation?.message);
      }

      const shortcodeValidation = validateShortcode(entry?.customShortcode, entry?.id);
      if (!shortcodeValidation?.valid) {
        newErrors[`shortcode_${entry?.id}`] = shortcodeValidation?.message;
        isValid = false;
        logValidationError('customShortcode', entry?.customShortcode, shortcodeValidation?.message);
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleShortenUrls = async () => {
    setIsLoading(true);
    
    try {
      if (!validateAllEntries()) {
        setIsLoading(false);
        return;
      }

      const createdUrls = [];

      for (const entry of urlEntries) {
        try {
          let shortcode = entry?.customShortcode?.trim();
          
          if (!shortcode) {
            shortcode = urlStorage?.generateUniqueShortcode();
          }

          const urlData = {
            id: Date.now() + Math.random(),
            originalUrl: entry?.originalUrl?.trim(),
            shortcode: shortcode,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + entry?.expirationMinutes * 60 * 1000),
            clickCount: 0
          };

          const created = urlStorage?.createUrl(urlData);
          createdUrls?.push(created);
          
          logUrlOperation('URL shortened successfully', {
            shortcode: created?.shortcode,
            originalUrl: created?.originalUrl,
            expiresAt: created?.expiresAt
          });

        } catch (error) {
          logError(error, { context: 'URL creation', entry: entry?.originalUrl });
          throw error;
        }
      }

      setResults(prev => [...createdUrls, ...prev]);
      
      // Reset form
      setUrlEntries([
        { id: Date.now(), originalUrl: '', customShortcode: '', expirationMinutes: 30 }
      ]);
      setErrors({});

      showNotification(`Successfully created ${createdUrls?.length} short URL${createdUrls?.length > 1 ? 's' : ''}`, 'success');

    } catch (error) {
      logError(error, { context: 'shorten_urls' });
      showNotification('Failed to create short URLs. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (shortcode) => {
    const fullUrl = `${window?.location?.origin}/${shortcode}`;
    navigator?.clipboard?.writeText(fullUrl)?.then(() => {
      showNotification('Short URL copied to clipboard', 'info');
      logUIAction('Copy short URL', 'UrlShortenerDashboard', { shortUrl: fullUrl });
    });
  };

  const openShortUrl = (shortcode) => {
    const fullUrl = `${window?.location?.origin}/${shortcode}`;
    window?.open(fullUrl, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>AffordMed URL Shortener - Home</title>
        <meta name="description" content="Create and manage shortened URLs with AffordMed URL Shortener." />
      </Helmet>
      
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <Header />
        
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Notification */}
          {notification && (
            <Alert 
              severity={notification?.type}
              icon={notification?.type === 'success' ? <CheckCircle /> : <Error />}
              sx={{ mb: 3 }}
              onClose={() => setNotification(null)}
            >
              {notification?.message}
            </Alert>
          )}

          {/* Main Form Card */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              {/* URL Input Rows */}
              <Box sx={{ mb: 3 }}>
                {urlEntries?.map((entry, index) => (
                  <Box key={entry?.id} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1">
                        URL #{index + 1}
                      </Typography>
                      {urlEntries?.length > 1 && (
                        <IconButton 
                          onClick={() => removeUrlEntry(entry?.id)}
                          size="small"
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Long URL"
                          placeholder="https://example.com/very-long-url"
                          value={entry?.originalUrl}
                          onChange={(e) => handleInputChange(entry?.id, 'originalUrl', e?.target?.value)}
                          error={!!errors?.[`url_${entry?.id}`]}
                          helperText={errors?.[`url_${entry?.id}`]}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Shortcode"
                          placeholder="custom"
                          value={entry?.customShortcode}
                          onChange={(e) => handleInputChange(entry?.id, 'customShortcode', e?.target?.value)}
                          error={!!errors?.[`shortcode_${entry?.id}`]}
                          helperText={errors?.[`shortcode_${entry?.id}`] || 'Optional - leave blank for auto-generation'}
                          inputProps={{ maxLength: 10 }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Validity period in minutes</InputLabel>
                          <Select
                            value={entry?.expirationMinutes}
                            label="Validity period in minutes"
                            onChange={(e) => handleInputChange(entry?.id, 'expirationMinutes', e?.target?.value)}
                          >
                            {expirationOptions?.map((option) => (
                              <MenuItem key={option?.value} value={option?.value}>
                                {option?.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                ))}

                {/* Add Another URL Row */}
                {urlEntries?.length < 5 && (
                  <Button
                    startIcon={<Add />}
                    onClick={addUrlEntry}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  >
                    + Add Another URL Row
                  </Button>
                )}
              </Box>

              {/* Shorten URLs Button */}
              <Button
                variant="contained"
                size="large"
                onClick={handleShortenUrls}
                disabled={isLoading}
                sx={{ minWidth: 200 }}
              >
                {isLoading ? 'Creating...' : 'Shorten URLs'}
              </Button>
            </CardContent>
          </Card>

          {/* Results Table */}
          {results?.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Results:
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Original URL</strong></TableCell>
                        <TableCell><strong>Short Link</strong></TableCell>
                        <TableCell><strong>Expiry</strong></TableCell>
                        <TableCell><strong>Actions</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results?.map((result) => (
                        <TableRow key={result?.id}>
                          <TableCell>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                maxWidth: 300, 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {result?.originalUrl}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Link
                              href={`/${result?.shortcode}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ fontFamily: 'monospace', textDecoration: 'none' }}
                            >
                              /{result?.shortcode}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {result?.expiresAt?.toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZoneName: 'short'
                              })}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton
                                onClick={() => copyToClipboard(result?.shortcode)}
                                size="small"
                                title="Copy short URL"
                              >
                                <ContentCopy />
                              </IconButton>
                              <IconButton
                                onClick={() => openShortUrl(result?.shortcode)}
                                size="small"
                                title="Open in new tab"
                              >
                                <Launch />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </Container>
      </Box>
    </>
  );
};

export default UrlShortenerDashboard;