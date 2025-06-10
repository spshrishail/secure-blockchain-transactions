import React, { useState, useEffect, useCallback } from "react";
import { 
  Box, 
  Container,
  Card,
  CardContent,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Fade,
  useTheme,
  Button
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import LinkIcon from '@mui/icons-material/Link';
import TransactionHistory from "../components/TransactionHistory";
import web3Service from "../services/web3Service";
import { toast } from 'react-toastify';

const DashboardPage = () => {
  const theme = useTheme();
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [networkStatus, setNetworkStatus] = useState({
    isConnected: false,
    chainId: null
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const fetchWalletInfo = useCallback(async () => {
    try {
      if (web3Service.isConnected()) {
        const walletBalance = await web3Service.getBalance();
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setBalance(walletBalance);
        setNetworkStatus({
          isConnected: true,
          chainId: parseInt(chainId, 16).toString()
        });
      } else {
        // Try to reconnect if MetaMask is available but not connected
        if (window.ethereum && window.ethereum.selectedAddress) {
          await web3Service.init();
          const walletBalance = await web3Service.getBalance();
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setBalance(walletBalance);
          setNetworkStatus({
            isConnected: true,
            chainId: parseInt(chainId, 16).toString()
          });
        } else {
          setNetworkStatus({
            isConnected: false,
            chainId: null
          });
        }
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching wallet info:', err);
      setError('Failed to load wallet information. Please check your connection.');
      setNetworkStatus({
        isConnected: false,
        chainId: null
      });
    }
  }, []);

  const initializeWallet = useCallback(async () => {
    try {
      setError(null);
      
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to use this application.');
      }

      // Check if already connected
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        // Initialize web3Service if not already initialized
        if (!web3Service.isConnected()) {
          try {
            await web3Service.init();
          } catch (initError) {
            if (initError.message.includes('denied')) {
              throw new Error('Please approve the transaction to continue using the application.');
            } else {
              throw initError;
            }
          }
        }
      } else {
        throw new Error('Please connect your MetaMask wallet to continue.');
      }

      await fetchWalletInfo();
    } catch (err) {
      console.error('Error initializing wallet:', err);
      setError(err.message);
      setNetworkStatus({ isConnected: false, chainId: null });
      setBalance('0');
    }
  }, [fetchWalletInfo]);

  useEffect(() => {
    const initializeDashboard = async () => {
      setIsLoading(true);
      await initializeWallet();
      setIsLoading(false);
    };

    initializeDashboard();

    // Set up real-time update listeners
    if (window.ethereum) {
      // Listen for account changes
      const handleAccountsChanged = async (accounts) => {
        if (accounts.length === 0) {
          setBalance('0');
          setNetworkStatus({ isConnected: false, chainId: null });
        } else {
          // Reinitialize web3Service if needed
          if (!web3Service.isConnected()) {
            await web3Service.init();
          }
          await fetchWalletInfo();
        }
      };

      // Listen for chain changes
      const handleChainChanged = async (chainId) => {
        setNetworkStatus(prev => ({
          ...prev,
          chainId: parseInt(chainId, 16).toString()
        }));
        await fetchWalletInfo();
      };

      // Listen for connect events
      const handleConnect = async () => {
        if (!web3Service.isConnected()) {
          await web3Service.init();
        }
        await fetchWalletInfo();
      };

      // Listen for disconnect events
      const handleDisconnect = () => {
        setBalance('0');
        setNetworkStatus({ isConnected: false, chainId: null });
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('connect', handleConnect);
      window.ethereum.on('disconnect', handleDisconnect);

      // Set up periodic balance updates
      const balanceInterval = setInterval(fetchWalletInfo, 10000);

      // Cleanup function
      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
          window.ethereum.removeListener('connect', handleConnect);
          window.ethereum.removeListener('disconnect', handleDisconnect);
        }
        clearInterval(balanceInterval);
  };
    }
  }, [fetchWalletInfo, initializeWallet]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchWalletInfo();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleRetryRegistration = async () => {
    setIsRetrying(true);
    try {
      // Show transaction details before retrying
      toast.info(
        `Retrying Registration:
        - Action: Register on Secure Token Contract
        - Network: ${NETWORK_CONFIG.chainName}
        - Contract: ${CONTRACT_ADDRESS}
        Please approve the transaction in MetaMask.`,
        { autoClose: false }
      );

      await web3Service.retryRegistration();
      toast.success('Registration successful!');
      await fetchWalletInfo();
    } catch (error) {
      console.error('Retry registration error:', error);
      toast.error(error.message || 'Failed to retry registration. Please try again.');
    } finally {
      setIsRetrying(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Fade in={true} timeout={800}>
        <Box>
          {/* Welcome Section */}
          <Box sx={{ 
            mb: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box>
              <Typography variant="h4" sx={{ 
                color: '#00ff94', 
                fontFamily: 'Orbitron',
                mb: 1,
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                textShadow: '0 0 20px rgba(0, 255, 148, 0.3)'
              }}>
                Welcome back, {user?.username}
              </Typography>
              <Typography variant="subtitle1" sx={{ 
                color: '#cccccc',
                fontSize: { xs: '0.9rem', md: '1rem' }
              }}>
                Manage your secure blockchain transactions
              </Typography>
            </Box>
            <Tooltip title="Refresh dashboard">
              <IconButton 
                onClick={handleManualRefresh}
                sx={{ 
                  color: '#00ff94',
                  '&:hover': { 
                    bgcolor: 'rgba(0, 255, 148, 0.1)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <RefreshIcon 
                  sx={{ 
                    animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    }
                  }} 
                />
              </IconButton>
            </Tooltip>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                bgcolor: 'rgba(211, 47, 47, 0.1)',
                border: '1px solid rgba(211, 47, 47, 0.3)'
              }}
              action={
                error.includes('registration') && (
                  <Button
                    color="inherit"
                    size="small"
                    onClick={handleRetryRegistration}
                    disabled={isRetrying}
                    sx={{ color: '#00ff94' }}
                  >
                    {isRetrying ? 'Retrying...' : 'Retry Registration'}
                  </Button>
                )
              }
            >
              {error}
            </Alert>
          )}

          {!networkStatus.isConnected && (
            <Alert 
              severity="warning" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                bgcolor: 'rgba(255, 167, 38, 0.1)',
                border: '1px solid rgba(255, 167, 38, 0.3)'
              }}
            >
              Please connect your wallet to view your balance and transactions.
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Stats Cards */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(26, 26, 26, 0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 20px rgba(0, 255, 148, 0.1)'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccountBalanceWalletIcon sx={{ color: '#00ff94', mr: 1, fontSize: '2rem' }} />
                    <Typography variant="h6" sx={{ color: '#00ff94' }}>
                      Balance
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ 
                    color: 'white',
                    mb: 1,
                    fontWeight: 'bold'
                  }}>
                    {balance} ETH
                  </Typography>
                  {networkStatus.isConnected && (
                    <Typography variant="caption" sx={{ 
                      color: '#cccccc',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}>
                      <RefreshIcon sx={{ fontSize: '0.9rem' }} />
                      Auto-updating every 10s
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(26, 26, 26, 0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 20px rgba(0, 255, 148, 0.1)'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <NetworkCheckIcon sx={{ color: '#00ff94', mr: 1, fontSize: '2rem' }} />
                    <Typography variant="h6" sx={{ color: '#00ff94' }}>
                      Network Status
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ 
                    color: networkStatus.isConnected ? '#00ff94' : '#ff3d3d',
                    mb: 1,
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    {networkStatus.isConnected ? 'Connected' : 'Disconnected'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(26, 26, 26, 0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 20px rgba(0, 255, 148, 0.1)'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LinkIcon sx={{ color: '#00ff94', mr: 1, fontSize: '2rem' }} />
                    <Typography variant="h6" sx={{ color: '#00ff94' }}>
                      Chain ID
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ 
                    color: 'white',
                    mb: 1,
                    fontWeight: 'bold'
                  }}>
                    {networkStatus.chainId || 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Transactions */}
            <Grid item xs={12}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(26, 26, 26, 0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 20px rgba(0, 255, 148, 0.1)'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ 
                    color: '#00ff94',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: '1.5rem'
                  }}>
                    Recent Transactions
                  </Typography>
                  <TransactionHistory limit={5} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Container>
  );
};

export default DashboardPage; 