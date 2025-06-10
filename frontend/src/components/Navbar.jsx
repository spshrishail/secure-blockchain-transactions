import { AppBar, Box, Button, Typography } from '@mui/material';
import { Link } from 'react-scroll';
import { useState, useEffect } from 'react';

const navItems = [
  { name: 'Home', target: 'hero', offset: -70 },
  { name: 'Features', target: 'features', offset: -80 },
  { name: 'Security', target: 'security', offset: -80 },
  { name: 'Contact', target: 'contact', offset: -80 }
];

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      navItems.forEach(({ target }) => {
        const element = document.getElementById(target);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(target);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'rgba(13, 13, 13, 0.95)', 
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        height: '70px',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        px: 4, 
        height: '100%' 
      }}>
        <Typography variant="h4" sx={{ fontFamily: 'Orbitron', color: '#00ff94' }}>
          SFTB
        </Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.target}
              spy={true}
              smooth={true}
              offset={item.offset}
              duration={500}
              onSetActive={() => setActiveSection(item.target)}
              isDynamic={true}
              ignoreCancelEvents={true}
            >
              <Button 
                disableRipple
                sx={{ 
                  color: activeSection === item.target ? '#00ff94' : '#ffffff',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover': { color: '#00ff94' },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -2,
                    left: 0,
                    width: activeSection === item.target ? '100%' : '0%',
                    height: '2px',
                    backgroundColor: '#00ff94',
                    transition: 'width 0.3s ease-in-out'
                  },
                  '&:hover::after': {
                    width: '100%'
                  },
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none'
                  },
                  '&.MuiButtonBase-root:hover': {
                    backgroundColor: 'transparent'
                  }
                }}
              >
                {item.name}
              </Button>
            </Link>
          ))}
        </Box>
      </Box>
    </AppBar>
  );
};

export default Navbar; 