import { Box, Container, Typography } from '@mui/material';
import TransactionHistory from '../components/TransactionHistory';

const TransactionsPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#00ff94', fontFamily: 'Orbitron', mb: 1 }}>
          Transaction History
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#cccccc', mb: 3 }}>
          View all your blockchain transactions
        </Typography>
      </Box>
      <TransactionHistory />
    </Container>
  );
};

export default TransactionsPage; 