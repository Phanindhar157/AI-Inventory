import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Badge,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart,
  Person,
  LocationOn,
  Store,
  Eco,
  ExitToApp
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          AI Inventory
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem button component={RouterLink} to="/">
          <ListItemIcon>
            <Store />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={RouterLink} to="/products">
          <ListItemIcon>
            <ShoppingCart />
          </ListItemIcon>
          <ListItemText primary="Products" />
        </ListItem>
        <ListItem button component={RouterLink} to="/vendors">
          <ListItemIcon>
            <Store />
          </ListItemIcon>
          <ListItemText primary="Vendors" />
        </ListItem>
        <ListItem button component={RouterLink} to="/map">
          <ListItemIcon>
            <LocationOn />
          </ListItemIcon>
          <ListItemText primary="Map" />
        </ListItem>
        {isAuthenticated && (
          <>
            <ListItem button component={RouterLink} to="/orders">
              <ListItemIcon>
                <ShoppingCart />
              </ListItemIcon>
              <ListItemText primary="Orders" />
            </ListItem>
            <ListItem button component={RouterLink} to="/profile">
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
          </>
        )}
      </List>
      <Divider />
      {isAuthenticated ? (
        <List>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem button component={RouterLink} to="/login">
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
          <ListItem button component={RouterLink} to="/register">
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Register" />
          </ListItem>
        </List>
      )}
    </div>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Eco sx={{ mr: 1 }} />
          AI Inventory
        </Typography>

        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/products"
              startIcon={<ShoppingCart />}
            >
              Products
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/vendors"
              startIcon={<Store />}
            >
              Vendors
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/map"
              startIcon={<LocationOn />}
            >
              Map
            </Button>
            {isAuthenticated ? (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/orders"
                  startIcon={<ShoppingCart />}
                >
                  Orders
                </Button>
                <IconButton
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                  >
                    <Avatar
                      alt={user?.name}
                      src={user?.avatar}
                      sx={{ width: 32, height: 32 }}
                    >
                      {user?.name?.charAt(0)}
                    </Avatar>
                  </Badge>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    component={RouterLink}
                    to="/profile"
                    onClick={handleClose}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/register"
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar; 