import { Box, Container, Grid, Typography, TextField, Button, Paper } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import { useForm } from 'react-hook-form';

const ContactSection = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Here you would typically send the data to your backend
    reset();
  };

  const contactInfo = [
    {
      icon: <EmailIcon sx={{ fontSize: 40, color: '#00ff94' }} />,
      title: 'Email Us',
      detail: 'vasu@gmail.com'
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 40, color: '#00ff94' }} />,
      title: 'Location',
      detail: 'BGMIT, Mudhol'
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 40, color: '#00ff94' }} />,
      title: 'Call Us',
      detail: '+91 1234567890'
    }
  ];

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
      '&:hover fieldset': { borderColor: '#00ff94' },
      '&.Mui-error fieldset': { borderColor: '#ff3d3d' }
    },
    '& .MuiFormHelperText-root': {
      color: '#ff3d3d',
      marginLeft: 0,
      marginTop: 1
    }
  };

  return (
    <Box 
      id="contact" 
      sx={{ 
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        position: 'relative'
      }}
    >
      <Container maxWidth="lg">
        <Typography 
          variant="h2" 
          data-aos="fade-up"
          sx={{ 
            textAlign: 'center',
            mb: { xs: 6, md: 10 },
            color: '#ffffff',
            fontFamily: 'Orbitron',
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          Get in <span style={{ color: '#00ff94' }}>Touch</span>
        </Typography>

        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="stretch">
          {/* Contact Info Cards */}
          <Grid item xs={12} md={5} data-aos="fade-right">
            <Grid container spacing={3} height="100%">
              {contactInfo.map((info, index) => (
                <Grid item xs={12} key={index}>
                  <Paper
                    sx={{
                      p: 4,
                      height: '100%',
                      background: 'rgba(26, 26, 26, 0.6)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'transform 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        borderColor: '#00ff94'
                      }
                    }}
                  >
                    {info.icon}
                    <Box>
                      <Typography variant="h6" sx={{ color: '#ffffff' }}>
                        {info.title}
                      </Typography>
                      <Typography sx={{ color: '#cccccc', mt: 0.5 }}>
                        {info.detail}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={7} data-aos="fade-left">
            <Paper
              sx={{
                p: { xs: 3, md: 5 },
                height: '100%',
                background: 'rgba(26, 26, 26, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Box 
                component="form" 
                onSubmit={handleSubmit(onSubmit)}
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 3,
                  height: '100%'
                }}
              >
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  sx={inputStyles}
                  {...register('name', { 
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name should be at least 2 characters'
                    }
                  })}
                />
                
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={inputStyles}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />

                <TextField
                  label="Message"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  error={!!errors.message}
                  helperText={errors.message?.message}
                  sx={inputStyles}
                  {...register('message', {
                    required: 'Message is required',
                    minLength: {
                      value: 10,
                      message: 'Message should be at least 10 characters'
                    }
                  })}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: '#00ff94',
                    color: '#000000',
                    '&:hover': { bgcolor: '#00cc75' },
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      transition: 'all 0.5s ease',
                    },
                    '&:hover::after': {
                      left: '100%',
                    }
                  }}
                >
                  Send Message
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactSection; 