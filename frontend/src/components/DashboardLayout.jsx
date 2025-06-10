import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  AppBar,
  Toolbar,
  Tooltip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SendIcon from '@mui/icons-material/Send';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast } from 'react-toastify';
import MetaMaskConnect from './MetaMaskConnect';
import web3Service from '../services/web3Service';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Send Money', icon: <SendIcon />, path: '/send-money' },
  { text: 'Transactions', icon: <ReceiptLongIcon />, path: '/transactions' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
];

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [user, setUser] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }

    // Check initial wallet connection state
    const checkWalletConnection = async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            // If account exists, initialize web3Service if needed
            if (!web3Service.isConnected()) {
              await web3Service.init();
            }
            setWalletConnected(true);
            setWalletAddress(accounts[0]);
          } else {
            setWalletConnected(false);
            setWalletAddress(null);
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
        setWalletConnected(false);
        setWalletAddress(null);
      }
    };

    checkWalletConnection();

    // Set up event listeners for wallet state changes
    if (window.ethereum) {
      const handleAccountsChanged = async (accounts) => {
        if (accounts.length > 0) {
          setWalletConnected(true);
          setWalletAddress(accounts[0]);
        } else {
          setWalletConnected(false);
          setWalletAddress(null);
        }
      };

      const handleChainChanged = () => {
        // Refresh the page on chain change as recommended by MetaMask
        window.location.reload();
      };

      const handleConnect = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletConnected(true);
          setWalletAddress(accounts[0]);
        }
      };

      const handleDisconnect = () => {
        setWalletConnected(false);
        setWalletAddress(null);
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('connect', handleConnect);
      window.ethereum.on('disconnect', handleDisconnect);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('connect', handleConnect);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      };
    }
  }, [navigate]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    web3Service.disconnect();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleWalletConnect = async (account) => {
    setWalletConnected(true);
    setWalletAddress(account);
    console.log('Connected wallet:', account);
  };

  const handleCopyAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress);
        toast.success('Address copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy address:', error);
        toast.error('Failed to copy address');
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#000000', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'rgba(26, 26, 26, 0.95)',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        {/* Logo/Brand */}
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ 
            color: '#00ff94', 
            fontFamily: 'Orbitron',
            letterSpacing: '0.1em',
            fontWeight: 'bold'
          }}>
            SecureChain
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* User Profile Section */}
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Avatar 
            sx={{ 
              width: 80,
              height: 80,
              bgcolor: '#00ff94',
              color: '#000000',
              margin: '0 auto',
              mb: 2,
              fontSize: '2rem'
            }}
          >
            {user?.username?.charAt(0)}
          </Avatar>
          <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
            {user?.username}
          </Typography>
          {walletConnected ? (
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#00ff94', mb: 1 }}>
                Connected to Sepolia
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                gap: 1
              }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#cccccc',
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                    bgcolor: 'rgba(0, 0, 0, 0.2)',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    width: '100%',
                    textAlign: 'center',
                    fontSize: '0.85rem'
                  }}
                >
                  {walletAddress || ''}
                </Typography>
                <Tooltip title="Copy full address">
                  <IconButton 
                    onClick={handleCopyAddress}
                    size="small"
                    sx={{ 
                      color: '#00ff94',
                      '&:hover': { 
                        bgcolor: 'rgba(0, 255, 148, 0.1)',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s ease',
                      padding: '4px'
                    }}
                  >
                    <ContentCopyIcon sx={{ fontSize: '1.1rem' }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ) : (
            <MetaMaskConnect onConnect={handleWalletConnect} />
          )}
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />

        {/* Navigation Menu */}
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                onClick={() => navigate(item.path)}
                sx={{ 
                  borderRadius: 2,
                  bgcolor: location.pathname === item.path ? 'rgba(0, 255, 148, 0.1)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(0, 255, 148, 0.05)'
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: location.pathname === item.path ? '#00ff94' : '#cccccc'
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    color: location.pathname === item.path ? '#00ff94' : '#cccccc'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        {/* Logout Button */}
        <List sx={{ p: 2 }}>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={handleLogout}
              sx={{ 
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'rgba(255, 61, 61, 0.05)'
                }
              }}
            >
              <ListItemIcon sx={{ color: '#ff3d3d' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ color: '#ff3d3d' }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          position: 'relative'
        }}
      >
        {/* Top Bar */}
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{ 
            bgcolor: 'rgba(26, 26, 26, 0.95)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Toolbar sx={{ justifyContent: 'flex-end' }}>
            <IconButton 
              onClick={handleNotificationClick}
              sx={{ color: '#00ff94' }}
            >
              <NotificationsIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            width: 320
          }
        }}
      >
        <MenuItem sx={{ justifyContent: 'center' }}>
          <Typography variant="subtitle2" sx={{ color: '#00ff94' }}>
            No new notifications
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DashboardLayout;