import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast } from 'react-toastify';

const Ledger = () => {
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const response = await fetch('/api/wallets', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch wallets');
      const data = await response.json();
      setWallets(data);
    } catch (error) {
      console.error('Error fetching wallets:', error);
      toast.error('Failed to load wallet information');
    }
  };

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#00ff94' }}>
        Wallet Ledger
      </Typography>
      <List>
        {wallets.map((wallet, index) => (
          <Paper
            key={wallet._id}
            elevation={1}
            sx={{
              mb: 2,
              bgcolor: 'rgba(26, 26, 26, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <ListItem
              secondaryAction={
                <Box>
                  <Tooltip title="Copy Public Key">
                    <IconButton
                      edge="end"
                      onClick={() => copyToClipboard(wallet.publicKey, 'Public Key')}
                      sx={{ color: '#00ff94' }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle1" sx={{ color: '#fff' }}>
                    {wallet.user.username || 'Unknown User'}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {wallet.publicKey}
                  </Typography>
                }
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default Ledger;