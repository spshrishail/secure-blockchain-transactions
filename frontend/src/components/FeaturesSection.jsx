import { Box, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AOS from 'aos';
import { useEffect } from 'react';
import 'aos/dist/aos.css';

const features = [
  {
    icon: <SecurityIcon sx={{ fontSize: 50, color: '#00ff94' }} />,
    title: 'Advanced Security',
    description: 'Military-grade encryption combined with AI-powered threat detection for unprecedented security.'
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 50, color: '#00ff94' }} />,
    title: 'Lightning Fast',
    description: 'Process thousands of transactions per second with our optimized blockchain network.'
  },
  {
    icon: <AutoGraphIcon sx={{ fontSize: 50, color: '#00ff94' }} />,
    title: 'AI Analytics',
    description: 'Real-time AI analysis of transaction patterns to prevent fraud and optimize performance.'
  },
  {
    icon: <AccountBalanceWalletIcon sx={{ fontSize: 50, color: '#00ff94' }} />,
    title: 'Smart Contracts',
    description: 'Automated, secure, and intelligent contract execution powered by blockchain technology.'
  }
];

const FeaturesSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  return (
    <Box id="features" sx={{ py: 10, background: '#0a0a0a' }}>
      <Container>
        <Typography 
          variant="h2" 
          data-aos="fade-up"
          sx={{ 
            textAlign: 'center', 
            mb: 8,
            color: '#ffffff',
            fontFamily: 'Orbitron'
          }}
        >
          Why Choose <span style={{ color: '#00ff94' }}>SFTB</span>
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                data-aos="fade-up"
                data-aos-delay={index * 100}
                sx={{ 
                  height: '100%',
                  background: 'rgba(26, 26, 26, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    borderColor: '#00ff94'
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  {feature.icon}
                  <Typography variant="h5" sx={{ my: 2, color: '#ffffff' }}>
                    {feature.title}
                  </Typography>
                  <Typography sx={{ color: '#cccccc' }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection; 