import { useState, useEffect } from 'react';
import {
  Button,
  CircularProgress,
  Typography,
  Box,
  Link
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { toast } from 'react-toastify';
import web3Service from '../services/web3Service';

const MetaMaskConnect = ({ onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkConnection();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    try {
      if (web3Service.isConnected()) {
        setAccount(web3Service.getAccount());
        onConnect && onConnect(web3Service.getAccount());
      }
    } catch (error) {
      console.error('Connection check error:', error);
      setError(error.message);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setError(null);
      onConnect && onConnect(accounts[0]);
      toast.success('Wallet connected!');
    } else {
      handleDisconnect();
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const handleDisconnect = () => {
    setAccount(null);
    setError('Wallet disconnected');
    web3Service.disconnect();
    toast.info('Wallet disconnected');
  };

  const connectWallet = async () => {
    if (isConnecting) return;

    try {
      setIsConnecting(true);
      setError(null);

      await web3Service.init();
      const account = web3Service.getAccount();
      
      if (account) {
        setAccount(account);
        onConnect && onConnect(account);
        toast.success('Wallet connected successfully!');
      }
    } catch (error) {
      console.error('Connection error:', error);
      setError(error.message);
      
      // Check if the error message contains HTML (like the MetaMask install link)
      if (error.message.includes('<a href=')) {
        toast.error(
          <Box>
            <Typography variant="body2" component="span">
              MetaMask is not installed.{' '}
              <Link 
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: '#00ff94' }}
              >
                Click here to install
              </Link>
            </Typography>
          </Box>,
          { autoClose: 10000 }
        );
      } else {
        toast.error(error.message);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const getButtonText = () => {
    if (isConnecting) {
      return <CircularProgress size={24} sx={{ color: '#000' }} />;
    }
    
    if (error) {
      if (error.includes('MetaMask is not installed')) {
        return 'Install MetaMask';
      }
      if (error.includes('switch to the Sepolia')) {
        return 'Switch Network';
      }
      return 'Retry Connection';
    }
    
    return 'Connect Wallet';
  };

  return (
    <Box>
      {!account ? (
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={connectWallet}
            disabled={isConnecting}
            startIcon={!isConnecting && <AccountBalanceWalletIcon />}
            sx={{
              bgcolor: '#00ff94',
              color: '#000',
              '&:hover': { bgcolor: '#00cc75' },
              minWidth: '180px',
              mb: error ? 1 : 0
            }}
          >
            {getButtonText()}
          </Button>
          {error && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#ff3d3d',
                display: 'block',
                mt: 1
              }}
            >
              {error}
            </Typography>
          )}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#00ff94', mb: 1 }}>
            Connected to Sepolia
          </Typography>
          <Typography variant="body2" sx={{ color: '#cccccc' }}>
            {`${account.slice(0, 6)}...${account.slice(-4)}`}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MetaMaskConnect; 