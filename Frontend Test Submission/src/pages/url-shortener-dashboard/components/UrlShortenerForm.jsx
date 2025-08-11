import React, { useState } from 'react';
import {
  Box, Typography, TextField, Select, MenuItem, FormControl,
  InputLabel, Button, Card, CardContent, Grid, Alert, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip
} from '@mui/material';
import { Add, Delete, Link, ContentCopy } from '@mui/icons-material';

// === CONFIG ===
// Change this when deploying to a real domain
const BASE_URL = "https://localhost:3000";

// --- Shortcode Generator ---
function generateShortcode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// --- Store URL in localStorage ---
function createUrlMapping(originalUrl, shortcode, expirationMinutes) {
  const expiresAt = new Date(Date.now() + expirationMinutes * 60000);
  const data = {
    originalUrl,
    expiresAt: expiresAt.toISOString()
  };
  localStorage.setItem(shortcode, JSON.stringify(data));
}

const UrlShortenerForm = () => {
  const [urlEntries, setUrlEntries] = useState([
    { id: 1, originalUrl: '', customShortcode: '', expirationMinutes: 30 }
  ]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const expirationOptions = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
    { value: 240, label: '4 hours' },
    { value: 480, label: '8 hours' },
    { value: 1440, label: '24 hours' }
  ];

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

  const validateShortcode = (shortcode) => {
    if (!shortcode?.trim()) return { valid: true }; // optional
    if (shortcode.length < 3 || shortcode.length > 10) {
      return { valid: false, message: 'Shortcode must be 3-10 characters' };
    }
    if (!/^[a-zA-Z0-9]+$/.test(shortcode)) {
      return { valid: false, message: 'Only letters and numbers allowed' };
    }
    if (localStorage.getItem(shortcode)) {
      return { valid: false, message: 'Shortcode already taken' };
    }
    return { valid: true };
  };

  const addUrlEntry = () => {
    if (urlEntries.length >= 5) return;
    setUrlEntries(prev => [...prev, { id: Date.now(), originalUrl: '', customShortcode: '', expirationMinutes: 30 }]);
  };

  const removeUrlEntry = (id) => {
    if (urlEntries.length <= 1) return;
    setUrlEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    setUrlEntries(prev => prev.map(entry => entry.id === id ? { ...entry, [field]: value } : entry));
  };

  const validateAllEntries = () => {
    const newErrors = {};
    let isValid = true;
    urlEntries.forEach(entry => {
      const urlValidation = validateUrl(entry.originalUrl);
      if (!urlValidation.valid) {
        newErrors[`url_${entry.id}`] = urlValidation.message;
        isValid = false;
      }
      const shortcodeValidation = validateShortcode(entry.customShortcode);
      if (!shortcodeValidation.valid) {
        newErrors[`shortcode_${entry.id}`] = shortcodeValidation.message;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateAllEntries()) {
      setIsLoading(false);
      return;
    }

    const createdUrls = [];
    urlEntries.forEach(entry => {
      let shortcode = entry.customShortcode.trim();
      if (!shortcode) {
        shortcode = generateShortcode();
      }
      createUrlMapping(entry.originalUrl.trim(), shortcode, entry.expirationMinutes);

      const shortUrl = `${BASE_URL}/${shortcode}`;

      createdUrls.push({
        id: Date.now() + Math.random(),
        originalUrl: entry.originalUrl.trim(),
        shortcode,
        shortUrl,
        expiresAt: new Date(Date.now() + entry.expirationMinutes * 60000)
      });
    });

    setResults(createdUrls);
    setUrlEntries([{ id: Date.now(), originalUrl: '', customShortcode: '', expirationMinutes: 30 }]);
    setErrors({});
    setIsLoading(false);
  };

  const copyToClipboard = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Link sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5">URL Shortener</Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            {urlEntries.map((entry) => (
              <Card key={entry.id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Original URL"
                        value={entry.originalUrl}
                        onChange={(e) => handleInputChange(entry.id, 'originalUrl', e.target.value)}
                        error={!!errors[`url_${entry.id}`]}
                        helperText={errors[`url_${entry.id}`] || 'Enter the URL to shorten'}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Custom Shortcode (Optional)"
                        value={entry.customShortcode}
                        onChange={(e) => handleInputChange(entry.id, 'customShortcode', e.target.value)}
                        error={!!errors[`shortcode_${entry.id}`]}
                        helperText={errors[`shortcode_${entry.id}`] || '3-10 characters'}
                        inputProps={{ maxLength: 10 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Expiration Time</InputLabel>
                        <Select
                          value={entry.expirationMinutes}
                          onChange={(e) => handleInputChange(entry.id, 'expirationMinutes', e.target.value)}
                        >
                          {expirationOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  {urlEntries.length > 1 && (
                    <IconButton onClick={() => removeUrlEntry(entry.id)} color="error">
                      <Delete />
                    </IconButton>
                  )}
                </CardContent>
              </Card>
            ))}
            {urlEntries.length < 5 && (
              <Button startIcon={<Add />} onClick={addUrlEntry} variant="outlined">
                Add Another URL
              </Button>
            )}
          </Box>

          {errors.submit && <Alert severity="error">{errors.submit}</Alert>}

          <Button type="submit" variant="contained" size="large" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Shorten URLs'}
          </Button>
        </form>

        {results.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Results</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Original URL</TableCell>
                    <TableCell>Short URL</TableCell>
                    <TableCell>Expires At</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map(result => (
                    <TableRow key={result.id}>
                      <TableCell>{result.originalUrl}</TableCell>
                      <TableCell>
                        <Chip
                          label={result.shortUrl} // shows https://localhost:3000/shortcode
                          component="a"
                          href={`https://localhost:3000/${result.shortcode}`} // forces https link
                          target="_blank"
                          rel="noopener noreferrer"
                          clickable
                          variant="outlined"
                          color="primary"
                        />

                      </TableCell>
                      <TableCell>{result.expiresAt.toLocaleString()}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => copyToClipboard(result.shortUrl)}
                          title="Copy short URL"
                        >
                          <ContentCopy />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UrlShortenerForm;
