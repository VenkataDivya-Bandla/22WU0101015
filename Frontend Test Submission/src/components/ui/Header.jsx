import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Menu as MenuIcon, Link as LinkIcon } from '@mui/icons-material';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme?.breakpoints?.down('md'));

  const navigationItems = [
    {
      label: 'Home',
      path: '/'
    },
    {
      label: 'Statistics',
      path: '/statistics'
    }
  ];

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main', boxShadow: 2 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo + Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinkIcon sx={{ fontSize: 28 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            AffordMed URL Shortener
          </Typography>
        </Box>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {navigationItems?.map((item) => (
              <Button
                key={item?.path}
                component={Link}
                to={item?.path}
                color="inherit"
                sx={{
                  fontWeight: isActivePath(item?.path) ? 'bold' : 'normal',
                  backgroundColor: isActivePath(item?.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                {item?.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Mobile Menu */}
        {isMobile && (
          <>
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              edge="end"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {navigationItems?.map((item) => (
                <MenuItem
                  key={item?.path}
                  component={Link}
                  to={item?.path}
                  onClick={handleMenuClose}
                  sx={{
                    fontWeight: isActivePath(item?.path) ? 'bold' : 'normal',
                    backgroundColor: isActivePath(item?.path) ? 'action.selected' : 'transparent'
                  }}
                >
                  {item?.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;