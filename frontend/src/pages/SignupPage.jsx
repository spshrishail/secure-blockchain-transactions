import { useState } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, Link, Stepper, Step, StepLabel, IconButton, InputAdornment } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-toastify';
import web3Service from '../services/web3Service';

const SignupPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid }, 
    watch,
    trigger 
  } = useForm({
    mode: 'onChange'
  });

  const steps = ['Personal Info', 'Contact Details', 'Security'];

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(activeStep);
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const onSubmit = async (data) => {
    if (activeStep === steps.length - 1) {
      try {
        setIsSubmitting(true);
        // Transform the data to match backend expectations
        const signupData = {
          username: data.fullName.replace(/\s+/g, '_').toLowerCase(), // Create username from full name
          email: data.email,
          password: data.password,
          phone: data.phone
        };

        // First, register the user
        const response = await fetch('http://localhost:5000/api/v1/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(signupData),
        }).catch(error => {
          if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            throw new Error('Unable to connect to the server. Please check if the server is running and CORS is properly configured.');
          }
          throw error;
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          // Handle validation errors
          if (response.status === 400 && result.errors) {
            const errorMessage = result.errors.map(err => err.msg).join(', ');
            throw new Error(errorMessage);
          }
          // Handle other errors
          throw new Error(result.message || 'Signup failed');
        }
        
        // Store user data and token
        if (result.token) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
          
          // Set the user ID in web3Service
          web3Service.setUserId(result.user.id);
          
          // Initialize Web3 and create MetaMask account
          try {
            await web3Service.init();
            toast.success('MetaMask account created successfully!');
          } catch (web3Error) {
            console.error('MetaMask account creation error:', web3Error);
            toast.warning('Account created but MetaMask setup failed. You can set up MetaMask later.');
          }
          
          toast.success('Account created successfully! Redirecting to login...');
          // Navigate to login after a short delay
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error('Signup error:', error);
        toast.error(error.message || 'Failed to create account. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      handleNext();
    }
  };

  const getFieldsForStep = (step) => {
    switch (step) {
      case 0:
        return ['fullName'];
      case 1:
        return ['email', 'phone'];
      case 2:
        return ['password', 'confirmPassword'];
      default:
        return [];
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

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <TextField
            fullWidth
            label="Full Name"
            variant="outlined"
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
            InputProps={{
              startAdornment: <PersonOutlineIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
            }}
            {...register('fullName', {
              required: 'Full name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters'
              },
              pattern: {
                value: /^[a-zA-Z\s]*$/,
                message: 'Name can only contain letters and spaces'
              }
            })}
            sx={inputStyles}
          />
        );
      case 1:
        return (
          <>
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
              label="Phone Number"
              variant="outlined"
              error={!!errors.phone}
              helperText={errors.phone?.message}
              InputProps={{
                startAdornment: <PhoneOutlinedIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
              }}
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Please enter a valid 10-digit phone number'
                }
              })}
              sx={inputStyles}
            />
          </>
        );
      case 2:
        return (
          <>
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
                  value: 8,
                  message: 'Password must be at least 8 characters'
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: 'Password must contain: uppercase, lowercase, number, and special character'
                }
              })}
              sx={inputStyles}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                startAdornment: <LockOutlinedIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) => {
                  if (watch('password') != val) {
                    return "Passwords do not match";
                  }
                }
              })}
              sx={inputStyles}
            />
          </>
        );
      default:
        return null;
    }
  };

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

      <Container maxWidth="md" sx={{ display: 'flex', alignItems: 'center', py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            p: { xs: 3, md: 5 },
            background: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ color: '#ffffff', fontFamily: 'Orbitron', mb: 1 }}>
              Create Account
            </Typography>
            <Typography sx={{ color: '#cccccc' }}>
              Join us to start your journey
            </Typography>
          </Box>

          <Stepper 
            activeStep={activeStep} 
            alternativeLabel
            sx={{ 
              mb: 4,
              '& .MuiStepLabel-label': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-active': { color: '#00ff94' }
              },
              '& .MuiStepIcon-root': {
                color: 'rgba(255, 255, 255, 0.3)',
                '&.Mui-active': { color: '#00ff94' },
                '&.Mui-completed': { color: '#00ff94' }
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box 
            component="form" 
            onSubmit={handleSubmit(onSubmit)}
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 3,
              maxWidth: 400,
              mx: 'auto'
            }}
          >
            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0 || isSubmitting}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': { color: '#ffffff' }
                }}
              >
                Back
              </Button>
              <Button
                type={activeStep === steps.length - 1 ? 'submit' : 'button'}
                onClick={activeStep === steps.length - 1 ? undefined : handleNext}
                disabled={isSubmitting}
                variant="contained"
                sx={{
                  bgcolor: '#00ff94',
                  color: '#000000',
                  '&:hover': { bgcolor: '#00cc75' },
                  '&.Mui-disabled': {
                    bgcolor: 'rgba(0, 255, 148, 0.3)',
                    color: 'rgba(0, 0, 0, 0.7)'
                  }
                }}
              >
                {isSubmitting ? (
                  'Creating Account...'
                ) : activeStep === steps.length - 1 ? (
                  'Create Account'
                ) : (
                  'Next'
                )}
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', color: '#ffffff', mt: 2 }}>
              <Typography>
                Already have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: '#00ff94',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignupPage; 