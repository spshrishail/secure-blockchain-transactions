import { useEffect } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const HeroSection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  return (
    <Box 
      id="hero"
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'linear-gradient(45deg, #000000 0%, #1a1a1a 100%)',
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 8, md: 0 }
      }}
    >
      <Box 
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'url("/blockchain-bg.png")',
          opacity: 0.1,
          backgroundSize: 'cover',
          animation: 'pulse 3s infinite'
        }}
      />

      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1
          }}
        >
          <Typography 
            variant="h1" 
            data-aos="fade-down"
            sx={{ 
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              fontFamily: 'Orbitron',
              color: '#ffffff',
              mb: 2
            }}
          >
            Secure Transactions<br />
            <span style={{ color: '#00ff94' }}>
              Using Blockchain
            </span>
          </Typography>

          <Typography 
            variant="h5"
            data-aos="fade-up"
            data-aos-delay="200"
            sx={{ 
              color: '#cccccc',
              maxWidth: '800px',
              mb: 6,
              px: 2,
              lineHeight: 1.8
            }}
          >
            Experience the future of secure online transactions with blockchain technology.
            Built for speed, security, and reliability.
          </Typography>

          <Box 
            sx={{ 
              display: 'flex', 
              gap: 3,
              flexDirection: { xs: 'column', sm: 'row' }
            }}
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <Button 
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{
                bgcolor: '#00ff94',
                color: '#000000',
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: '#00cc75',
                },
                transition: 'all 0.3s ease',
                textTransform: 'none',
                borderRadius: '8px'
              }}
            >
              Get Started
              <ArrowForwardIcon sx={{ ml: 1 }} />
            </Button>

            <Button 
              variant="outlined"
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              sx={{
                color: '#00ff94',
                borderColor: '#00ff94',
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                '&:hover': {
                  borderColor: '#00ff94',
                  bgcolor: 'rgba(0, 255, 148, 0.1)',
                },
                transition: 'all 0.3s ease',
                textTransform: 'none',
                borderRadius: '8px'
              }}
            >
              Learn More
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection; 