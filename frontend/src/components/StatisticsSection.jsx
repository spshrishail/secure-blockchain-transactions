import { Box, Container, Grid, Typography } from '@mui/material';

const stats = [
  { number: '99.99%', label: 'Uptime' },
  { number: '0.001s', label: 'Transaction Speed' },
  { number: '1M+', label: 'Daily Transactions' },
  { number: '100%', label: 'Security Score' }
];

const StatisticsSection = () => {
  return (
    <Box 
      sx={{ 
        py: 15,
        background: 'linear-gradient(45deg, #000000 0%, #1a1a1a 100%)',
        position: 'relative'
      }}
    >
      <Container>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    color: '#00ff94',
                    fontFamily: 'Orbitron',
                    mb: 1
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    letterSpacing: 1
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default StatisticsSection; 