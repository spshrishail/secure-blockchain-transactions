import { Box } from '@mui/material';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import SecuritySection from '../components/SecuritySection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1 }}>
        <HeroSection />
        {/* <FeaturesSection />
        <SecuritySection /> */}
        <ContactSection />
      </Box>
      <Footer />
    </Box>
  );
};

export default HomePage; 