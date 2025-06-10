import { useState, useEffect } from 'react';
import { Box, Container, Grid, Paper } from '@mui/material';
import { useLocation } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  const location = useLocation();
  const [slideDirection, setSlideDirection] = useState('');
  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    setSlideDirection(isLoginPage ? 'slide-right' : 'slide-left');
  }, [location]);

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
          backgroundSize: 'cover',
          animation: 'pulse 3s infinite'
        }}
      />

      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', py: 4 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Form Section */}
          <Grid 
            item 
            xs={12} 
            md={6}
            sx={{
              order: { xs: 1, md: isLoginPage ? 1 : 2 },
              transition: 'all 0.5s ease-in-out',
              animation: `${slideDirection} 0.5s ease-in-out`
            }}
          >
            {children}
          </Grid>

          {/* Decorative Section */}
          <Grid 
            item 
            xs={12} 
            md={6}
            sx={{
              display: { xs: 'none', md: 'flex' },
              order: { xs: 2, md: isLoginPage ? 2 : 1 },
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              textAlign: 'center',
              gap: 4,
              transition: 'all 0.5s ease-in-out',
              animation: `${slideDirection} 0.5s ease-in-out`
            }}
          >
            <Box
              component="img"
              src={isLoginPage ? "/ai-security.png" : "/ai-signup.png"}
              alt="Security Illustration"
              sx={{
                width: '100%',
                maxWidth: '500px',
                filter: 'drop-shadow(0 0 20px rgba(0, 255, 148, 0.1))'
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AuthLayout; 