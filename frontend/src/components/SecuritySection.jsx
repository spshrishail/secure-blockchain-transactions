import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import { useEffect } from 'react';
import AOS from 'aos';

const SecuritySection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  const securityFeatures = [
    {
      icon: <ShieldIcon sx={{ fontSize: 40, color: '#00ff94' }} />,
      title: 'AI-Powered Protection',
      description: 'Advanced machine learning algorithms continuously monitor transactions and detect suspicious patterns in real-time.'
    },
    {
      icon: <LockIcon sx={{ fontSize: 40, color: '#00ff94' }} />,
      title: 'Multi-Layer Encryption',
      description: 'Military-grade encryption protocols ensure your data remains private and secure at every step.'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#00ff94' }} />,
      title: 'Blockchain Verification',
      description: 'Immutable distributed ledger technology guarantees transparent and tamper-proof transaction records.'
    }
  ];

  return (
    <Box 
      id="security" 
      sx={{ 
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: 'url("https://images.unsplash.com/photo-1639322537228-f710d846310a") center/cover no-repeat',
          filter: 'blur(8px)',
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={8} alignItems="center">
          {/* Left side - Image */}
          <Grid item xs={12} md={6} data-aos="fade-right">
            <Box sx={{ position: 'relative' }}>
              {/* Main image */}
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, #00ff94 0%, transparent 100%)',
                    opacity: 0.1,
                    borderRadius: '20px',
                    transform: 'scale(1.02)',
                    animation: 'pulse 2s infinite'
                  }
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1633265486064-086b219458ec"
                  alt="Blockchain Security"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '20px',
                    boxShadow: '0 0 30px rgba(0, 255, 148, 0.2)',
                    position: 'relative',
                    zIndex: 1,
                    display: 'block'
                  }}
                />
              </Box>
              
              {/* Floating element */}
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1642790551116-18e150f248e5"
                alt="AI Security"
                sx={{
                  position: 'absolute',
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '15px',
                  bottom: '-40px',
                  right: '-40px',
                  border: '4px solid #000',
                  boxShadow: '0 0 20px rgba(0, 255, 148, 0.3)',
                  zIndex: 2,
                  display: { xs: 'none', md: 'block' }
                }}
              />
            </Box>
          </Grid>

          {/* Right side - Content */}
          <Grid item xs={12} md={6} data-aos="fade-left">
            <Box sx={{ pl: { md: 4 } }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  mb: 4,
                  color: '#ffffff',
                  fontFamily: 'Orbitron',
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                Uncompromising <span style={{ color: '#00ff94' }}>Security</span>
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {securityFeatures.map((feature, index) => (
                  <Paper
                    key={index}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    sx={{
                      p: 3,
                      background: 'rgba(26, 26, 26, 0.6)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateX(10px)',
                        borderColor: '#00ff94',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      {feature.icon}
                      <Box>
                        <Typography variant="h6" sx={{ color: '#00ff94', mb: 1 }}>
                          {feature.title}
                        </Typography>
                        <Typography sx={{ color: '#cccccc', lineHeight: 1.6 }}>
                          {feature.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SecuritySection; 