import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
  InputAdornment
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import web3Service from '../services/web3Service';

const SendMoneyForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Create blockchain transaction
      const transaction = await web3Service.createTransaction(
        data.receiverId,
        data.amount
      );
      
      // Send transaction to backend
      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...data,
          transactionHash: transaction.transactionHash
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message);
      }
      
      toast.success('Transaction created successfully!');
      reset();
    } catch (error) {
      toast.error(error.message || 'Failed to create transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        background: 'rgba(26, 26, 26, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 2
      }}
    >
      <Typography variant="h5" sx={{ color: '#00ff94', mb: 3, fontFamily: 'Orbitron' }}>
        Send Money
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          fullWidth
          label="Receiver ID"
          variant="outlined"
          error={!!errors.receiverId}
          helperText={errors.receiverId?.message}
          {...register('receiverId', { required: 'Receiver ID is required' })}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
              '&:hover fieldset': { borderColor: '#00ff94' },
              '&.Mui-error fieldset': { borderColor: '#ff3d3d' }
            },
            '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
          }}
        />

        <TextField
          fullWidth
          label="Amount"
          type="number"
          variant="outlined"
          error={!!errors.amount}
          helperText={errors.amount?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoneyIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
              </InputAdornment>
            )
          }}
          {...register('amount', {
            required: 'Amount is required',
            min: { value: 0.01, message: 'Amount must be greater than 0' }
          })}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
              '&:hover fieldset': { borderColor: '#00ff94' },
              '&.Mui-error fieldset': { borderColor: '#ff3d3d' }
            },
            '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
          }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{
            py: 1.5,
            bgcolor: '#00ff94',
            color: '#000000',
            '&:hover': { bgcolor: '#00cc75' },
            '&:disabled': { bgcolor: 'rgba(0, 255, 148, 0.5)' }
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} sx={{ color: '#000000' }} />
          ) : (
            'Send Money'
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default SendMoneyForm; 