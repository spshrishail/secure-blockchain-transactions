import { useState } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, Link, IconButton, InputAdornment } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-toastify';
import web3Service from '../services/web3Service';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onChange'
  });

  const connectWallet = async () => {
    try {
      await web3Service.init();
      const account = web3Service.getAccount();
      if (!account) {
        throw new Error('Failed to connect wallet');
      }
      return true;
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    }
  };

  const onSubmit = async (formData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // First check if the server is accessible
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      }).catch(error => {
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
          throw new Error('Unable to connect to the server. Please check if the server is running.');
        }
        throw error;
      });

      // Try to parse JSON response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error('Invalid response from server. Please try again.');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Set userId before connecting to MetaMask
        web3Service.setUserId(data.user.id);

        // Connect to MetaMask after successful login
        try {
          await connectWallet();
          toast.success('Wallet connected successfully!');
        } catch (walletError) {
          console.error('Wallet connection error:', walletError);
          toast.warning('Login successful but wallet connection failed. Please connect manually.');
        }

        toast.success('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
      '&:hover fieldset': { borderColor: '#00ff94' },
      '&.Mui-error fieldset': { borderColor: '#ff3d3d' },
      backgroundColor: 'rgba(255, 255, 255, 0.05)'
    },
    '& .MuiFormHelperText-root': {
      color: '#ff3d3d',
      marginLeft: 0
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.7)'
    },
    '& .MuiOutlinedInput-input': {
      color: '#ffffff'
    }
  };

  // Array of login page images and messages
  const decorativeContent = [
    {
      image: '/login-security.png',
      title: 'Secure Access',
      description: 'Experience the future of secure transactions with our AI-powered platform'
    },
    {
      image: '/login-blockchain.png',
      title: 'Blockchain Technology',
      description: 'Powered by advanced blockchain for maximum security and transparency'
    },
    {
      image: '/login-analytics.png',
      title: 'Smart Analytics',
      description: 'Get real-time insights and analytics for your transactions'
    },
    {
      image: '/login-protection.png',
      title: 'Advanced Protection',
      description: 'Your assets are protected by state-of-the-art security measures'
    }
  ];

  // Get random content for the decorative section
  const randomContent = decorativeContent[Math.floor(Math.random() * decorativeContent.length)];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.1,
          background: 'url("/circuit-pattern.png")',
          backgroundSize: 'cover'
        }}
      />

      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', py: 4 }}>
        <Box sx={{ width: '100%', display: 'flex', gap: 4, alignItems: 'center' }}>
          {/* Left side - Login Form */}
          <Box sx={{ flex: 1, maxWidth: 450, mx: 'auto' }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 5 },
                background: 'rgba(26, 26, 26, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ color: '#ffffff', fontFamily: 'Orbitron', mb: 1 }}>
                  Welcome Back
                </Typography>
                <Typography sx={{ color: '#cccccc' }}>
                  Enter your credentials to access your account
                </Typography>
              </Box>

              <Box 
                component="form" 
                onSubmit={handleSubmit(onSubmit)}
                sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
              >
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: <EmailOutlinedIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
                  }}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  sx={inputStyles}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: <LockOutlinedIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  sx={inputStyles}
                />

                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  sx={{
                    color: '#00ff94',
                    textDecoration: 'none',
                    alignSelf: 'flex-end',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Forgot password?
                </Link>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    bgcolor: '#00ff94',
                    color: '#000000',
                    '&:hover': { bgcolor: '#00cc75' },
                    '&.Mui-disabled': {
                      bgcolor: 'rgba(0, 255, 148, 0.3)',
                      color: 'rgba(0, 0, 0, 0.7)'
                    },
                    textTransform: 'none',
                    fontSize: '1.1rem'
                  }}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>

                <Box sx={{ textAlign: 'center', color: '#ffffff' }}>
                  <Typography>
                    Don't have an account?{' '}
                    <Link
                      component={RouterLink}
                      to="/signup"
                      sx={{
                        color: '#00ff94',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Sign up
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>

          {/* Right side - Random Decorative Elements */}
          <Box 
            sx={{ 
              flex: 1, 
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              color: '#ffffff',
              textAlign: 'center',
              opacity: 0,
              animation: 'fadeIn 0.5s ease-out forwards'
            }}
          >
            <Box
              component="img"
              src={randomContent.image}
              alt="Security Illustration"
              sx={{
                width: '100%',
                maxWidth: '400px',
                filter: 'drop-shadow(0 0 20px rgba(0, 255, 148, 0.1))',
                transform: 'scale(0.9)',
                opacity: 0,
                animation: 'scaleIn 0.5s ease-out 0.2s forwards'
              }}
            />
            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: 'Orbitron', 
                color: '#00ff94',
                opacity: 0,
                animation: 'slideUp 0.5s ease-out 0.4s forwards'
              }}
            >
              {randomContent.title}
            </Typography>
            <Typography 
              sx={{ 
                color: '#cccccc', 
                maxWidth: '400px',
                opacity: 0,
                animation: 'slideUp 0.5s ease-out 0.6s forwards'
              }}
            >
              {randomContent.description}
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* Add animations to global styles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes scaleIn {
            from { 
              transform: scale(0.9);
              opacity: 0;
            }
            to { 
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes slideUp {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default LoginPage;