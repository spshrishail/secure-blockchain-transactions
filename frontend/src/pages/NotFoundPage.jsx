import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center'
        }}
      >
        <Typography
          variant="h1"
          sx={{
            color: '#00ff94',
            fontFamily: 'Orbitron',
            fontSize: { xs: '4rem', md: '6rem' },
            mb: 2
          }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: 'white',
            fontFamily: 'Orbitron',
            mb: 3
          }}
        >
          Page Not Found
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#cccccc',
            mb: 4
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/dashboard')}
          sx={{
            bgcolor: '#00ff94',
            color: '#000000',
            '&:hover': { bgcolor: '#00cc75' },
            py: 1.5,
            px: 4
          }}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage; 