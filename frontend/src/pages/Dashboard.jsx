import React, { useEffect, useState, useCallback } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    CircularProgress
} from '@mui/material';
import WalletInfo from '../components/WalletInfo';
import TransactionHistory from '../components/TransactionHistory';
import walletService from '../services/walletService';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [walletData, setWalletData] = useState(null);
    const { user, token } = useAuth();

    const fetchWalletInfo = useCallback(async () => {
        try {
            walletService.setAuthToken(token);
            const response = await walletService.getWalletInfo();
            setWalletData(response.wallet);
        } catch (error) {
            console.error('Error fetching wallet info:', error);
        }
    }, [token]);

    // Initial data fetch
    useEffect(() => {
        const initializeDashboard = async () => {
            if (token) {
                await fetchWalletInfo();
                setLoading(false);
            }
        };
        initializeDashboard();
    }, [token, fetchWalletInfo]);

    // Set up real-time updates
    useEffect(() => {
        if (!token) return;

        const updateInterval = setInterval(fetchWalletInfo, 10000); // Update every 10 seconds

        return () => clearInterval(updateInterval);
    }, [token, fetchWalletInfo]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '80vh'
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Welcome, {user?.username}!
                    </Typography>
                </Grid>

                {/* Wallet Information */}
                <Grid item xs={12} md={6}>
                    <WalletInfo wallet={walletData} />
                </Grid>

                {/* Transaction History */}
                <Grid item xs={12}>
                    <TransactionHistory transactions={walletData?.transactions || []} />
                </Grid>

                {/* Additional dashboard widgets can be added here */}
            </Grid>
        </Container>
    );
};

export default Dashboard; 