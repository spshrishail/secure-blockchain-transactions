import { Box, Container, Grid, Typography, IconButton, Link } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';

const Footer = () => {
  return (
    <Box 
      sx={{ 
        background: '#000000',
        color: '#ffffff',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        pt: 8,
        pb: 4
      }}
    >
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h4" sx={{ fontFamily: 'Orbitron', color: '#00ff94', mb: 2 }}>
              SFTB
            </Typography>
            <Typography sx={{ color: '#cccccc', mb: 3 }}>
              Revolutionizing secure transactions with blockchain technology.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {[TwitterIcon, LinkedInIcon, GitHubIcon, TelegramIcon].map((Icon, index) => (
                <IconButton 
                  key={index}
                  sx={{ 
                    color: '#ffffff',
                    '&:hover': { 
                      color: '#00ff94',
                      transform: 'translateY(-3px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Icon />
                </IconButton>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              {[
                {
                  title: 'Company',
                  links: ['About', 'Careers', 'Press', 'Blog']
                },
                {
                  title: 'Resources',
                  links: ['Documentation', 'API', 'Status', 'Terms']
                },
                {
                  title: 'Support',
                  links: ['Help Center', 'Community', 'Contact', 'FAQ']
                }
              ].map((section, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                    {section.title}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {section.links.map((link, i) => (
                      <Link
                        key={i}
                        href="#"
                        sx={{
                          color: '#cccccc',
                          textDecoration: 'none',
                          '&:hover': { 
                            color: '#00ff94',
                            transform: 'translateX(5px)'
                          },
                          transition: 'all 0.3s ease',
                          display: 'inline-block'
                        }}
                      >
                        {link}
                      </Link>
                    ))}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Typography 
          sx={{ 
            color: '#666666',
            textAlign: 'center',
            mt: 8,
            pt: 3,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          © 2024 SFTB. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 