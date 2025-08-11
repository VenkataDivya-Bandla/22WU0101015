import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
  Tooltip
} from '@mui/material';
import { ContentCopy, Delete, ExpandMore, ExpandLess, Analytics, Link, Visibility } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { logUIAction } from '../../../utils/logger';
import urlStorage from '../../../utils/urlStorage';

const UrlTable = ({ urls, onDeleteUrl, onCopyUrl }) => {
  const [deleteDialog, setDeleteDialog] = useState({ open: false, url: null });
  const [expandedRows, setExpandedRows] = useState(new Set());

  const handleCopyUrl = (shortcode) => {
    const fullUrl = `${window?.location?.origin}/${shortcode}`;
    navigator?.clipboard?.writeText(fullUrl)?.then(() => {
      if (onCopyUrl) onCopyUrl(fullUrl);
      logUIAction('Copy URL from table', 'UrlTable', { shortcode, fullUrl });
    });
  };

  const handleDeleteClick = (url) => {
    setDeleteDialog({ open: true, url });
  };

  const confirmDelete = () => {
    if (deleteDialog?.url) {
      const success = urlStorage?.deleteUrl(deleteDialog?.url?.shortcode);
      if (success && onDeleteUrl) {
        onDeleteUrl(deleteDialog?.url?.id);
      }
      logUIAction('Delete URL from table', 'UrlTable', { 
        shortcode: deleteDialog?.url?.shortcode 
      });
    }
    setDeleteDialog({ open: false, url: null });
  };

  const toggleRowExpansion = (urlId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded?.has(urlId)) {
      newExpanded?.delete(urlId);
    } else {
      newExpanded?.add(urlId);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusChip = (url) => {
    const now = new Date();
    const isExpired = now > url?.expiresAt;
    
    if (isExpired) {
      return <Chip label="Expired" color="error" size="small" />;
    }
    
    const timeUntilExpiry = url?.expiresAt - now;
    const hoursUntilExpiry = timeUntilExpiry / (1000 * 60 * 60);
    
    if (hoursUntilExpiry < 1) {
      return <Chip label="Expiring Soon" color="warning" size="small" />;
    }
    
    return <Chip label="Active" color="success" size="small" />;
  };

  const formatUrl = (url, maxLength = 50) => {
    if (url?.length <= maxLength) return url;
    return url?.substring(0, maxLength) + '...';
  };

  if (!urls || urls?.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Link sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No URLs shortened yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first shortened URL using the form above
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Paper>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" component="h3">
            Your Shortened URLs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and track your shortened URLs
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Original URL</TableCell>
                <TableCell>Short URL</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Expires</TableCell>
                <TableCell align="center">Clicks</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {urls?.map((url) => (
                <React.Fragment key={url?.id}>
                  <TableRow hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title={url?.originalUrl}>
                          <Typography variant="body2">
                            {formatUrl(url?.originalUrl, 40)}
                          </Typography>
                        </Tooltip>
                        {url?.clickCount > 0 && (
                          <IconButton
                            size="small"
                            onClick={() => toggleRowExpansion(url?.id)}
                          >
                            {expandedRows?.has(url?.id) ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={`/${url?.shortcode}`}
                        variant="outlined"
                        color="primary"
                        size="small"
                        clickable
                        onClick={() => handleCopyUrl(url?.shortcode)}
                      />
                    </TableCell>
                    
                    <TableCell>
                      {getStatusChip(url)}
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDistanceToNow(url?.createdAt, { addSuffix: true })}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDistanceToNow(url?.expiresAt, { addSuffix: true })}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <Visibility sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {url?.clickCount || 0}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Copy short URL">
                          <IconButton
                            size="small"
                            onClick={() => handleCopyUrl(url?.shortcode)}
                          >
                            <ContentCopy fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="View analytics">
                          <IconButton size="small" disabled={!url?.clickCount}>
                            <Analytics fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Delete URL">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(url)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>

                  {/* Expanded row for click details */}
                  <TableRow>
                    <TableCell colSpan={7} sx={{ p: 0 }}>
                      <Collapse in={expandedRows?.has(url?.id)} timeout="auto">
                        <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Recent Click Details
                          </Typography>
                          {url?.clicks?.slice(0, 5)?.map((click, index) => (
                            <Box key={index} sx={{ display: 'flex', gap: 2, mb: 1, fontSize: '0.875rem' }}>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(click?.timestamp)?.toLocaleString()}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                From: {click?.referrer || 'Direct'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Location: {click?.location || 'Unknown'}
                              </Typography>
                            </Box>
                          ))}
                          {url?.clicks?.length > 5 && (
                            <Typography variant="caption" color="text.secondary">
                              ... and {url?.clicks?.length - 5} more clicks
                            </Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog?.open}
        onClose={() => setDeleteDialog({ open: false, url: null })}
      >
        <DialogTitle>Delete Shortened URL</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this shortened URL?
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              /{deleteDialog?.url?.shortcode} → {formatUrl(deleteDialog?.url?.originalUrl, 60)}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This action cannot be undone. The short URL will stop working immediately.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, url: null })}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UrlTable;