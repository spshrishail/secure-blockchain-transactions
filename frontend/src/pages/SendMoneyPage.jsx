import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  InputAdornment,
  Grid,
  Tooltip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import GasMeterIcon from '@mui/icons-material/GasMeter';
import InfoIcon from '@mui/icons-material/Info';
import { toast } from 'react-toastify';
import web3Service from '../services/web3Service';
import Web3 from 'web3';
import BN from 'bn.js';

const SendMoneyPage = () => {
  const [formData, setFormData] = useState({
    recipientAddress: '',
    amount: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState('0');
  const [gasPrice, setGasPrice] = useState('0');
  const [availableGas, setAvailableGas] = useState('0');
  const [isRegistered, setIsRegistered] = useState(false);
  const [recipientRegistered, setRecipientRegistered] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        if (!web3Service.isConnected()) {
          await web3Service.init();
        }
        setIsInitialized(true);
        
      } catch (error) {
        console.error('Error initializing Web3:', error);
        setError(error.message);
        toast.error(`Error initializing Web3: ${error.message}`);
      }
    };

    initializeWeb3();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!isInitialized) return;

      try {
        // Check registration status
        const registered = await web3Service.contract.isRegistered(web3Service.account);
        setIsRegistered(registered);

        if (!registered) {
          setError('Please register on the contract first');
          return;
        }

        const [balance, gasPrice] = await Promise.all([
          web3Service.getBalance(),
          web3Service.getGasPrice()
        ]);

        setBalance(balance);
        
        // Convert gas price to Gwei
        const gasPriceInGwei = Web3.utils.fromWei(gasPrice.toString(), 'gwei');
        setGasPrice(gasPriceInGwei);
        
        // Calculate available gas (in Gwei)
        const balanceInWei = Web3.utils.toWei(balance, 'ether');
        const minBalance = Web3.utils.toWei('0.001', 'ether');
        
        // Convert to BN for calculations
        const balanceBN = new BN(balanceInWei);
        const minBalanceBN = new BN(minBalance);
        const gasPriceBN = new BN(gasPrice.toString());
        const gweiMultiplier = new BN('1000000000');
        
        // Calculate available gas
        const availableGasInWei = balanceBN.sub(minBalanceBN);
        const availableGasInGwei = availableGasInWei
          .mul(gweiMultiplier)
          .div(gasPriceBN);
        
        setAvailableGas(Web3.utils.fromWei(availableGasInGwei.toString(), 'ether'));
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        toast.error(`Error fetching data: ${error.message}`);
      }
    };

    if (isInitialized) {
      fetchData();
      // Update data every 30 seconds
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [isInitialized]);

  // Check recipient registration status when address changes
  useEffect(() => {
    const checkRecipientRegistration = async () => {
      if (!isInitialized || !formData.recipientAddress || !Web3.utils.isAddress(formData.recipientAddress)) {
        return;
      }

      try {
        const registered = await web3Service.contract.isRegistered(formData.recipientAddress);
        setRecipientRegistered(registered);
        if (!registered) {
          setError('Recipient must be registered on the contract');
        } else {
          setError(null);
        }
      } catch (error) {
        console.error('Error checking recipient registration:', error);
        setRecipientRegistered(false);
      }
    };

    checkRecipientRegistration();
  }, [formData.recipientAddress, isInitialized]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!isInitialized) {
      setError('Web3 is not initialized');
      return false;
    }

    if (!isRegistered) {
      setError('Please register on the contract first');
      return false;
    }

    if (!formData.recipientAddress) {
      setError('Recipient address is required');
      return false;
    }
    if (!Web3.utils.isAddress(formData.recipientAddress)) {
      setError('Invalid Ethereum address');
      return false;
    }
    if (!recipientRegistered) {
      setError('Recipient must be registered on the contract');
      return false;
    }
    if (!formData.amount) {
      setError('Amount is required');
      return false;
    }
    
    // Check if amount is valid
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Amount must be greater than 0');
      return false;
    }

    // Check if amount is less than available balance
    if (amount > parseFloat(balance)) {
      setError('Insufficient balance');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      if (!web3Service.isConnected()) {
        await web3Service.init();
      }

      // Check registration status again before sending
      const [senderRegistered, receiverRegistered] = await Promise.all([
        web3Service.contract.isRegistered(web3Service.account),
        web3Service.contract.isRegistered(formData.recipientAddress)
      ]);

      if (!senderRegistered || !receiverRegistered) {
        throw new Error('Both sender and recipient must be registered on the contract');
      }

      // Send the transaction using the new transfer method
      


      const tx = await web3Service.transfer(
        formData.recipientAddress,
        formData.amount
      );

      await tx.wait();
      toast.success('Transaction successful!');
      setFormData({ recipientAddress: '', amount: '' });
      // Refresh balance
      const newBalance = await web3Service.getBalance();
      setBalance(newBalance);
    } catch (error) {
      console.error('Transaction error:', error);
      let errorMessage = error.message;
      
      if (error.message.includes('execution reverted')) {
        errorMessage = 'Transaction failed: Contract requirements not met. Please ensure both sender and recipient are registered.';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for transaction';
      } else if (error.message.includes('user denied')) {
        errorMessage = 'Transaction was cancelled by the user';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Initializing Web3...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Send Money
        </Typography>
        
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">
                  Your Balance: {balance} ETH
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">
                  Gas Price: {gasPrice} Gwei
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Available Gas: {availableGas} Gwei
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" color={isRegistered ? 'success.main' : 'error.main'}>
                  Registration Status: {isRegistered ? 'Registered' : 'Not Registered'}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Recipient Address"
                name="recipientAddress"
                value={formData.recipientAddress}
                onChange={handleInputChange}
                margin="normal"
                error={!!error}
                helperText={error}
                disabled={!isRegistered}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Enter the recipient's Ethereum address">
                        <InfoIcon color="action" />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                fullWidth
                label="Amount (ETH)"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                margin="normal"
                error={!!error}
                disabled={!isRegistered}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Enter the amount to send in ETH">
                        <GasMeterIcon color="action" />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SendIcon />}
                disabled={loading || !isRegistered || !recipientRegistered}
                fullWidth
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Send'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default SendMoneyPage; 