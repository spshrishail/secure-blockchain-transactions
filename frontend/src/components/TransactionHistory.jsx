import React, { useState, useEffect } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Box,
    Chip,
    IconButton,
    Tooltip,
    CircularProgress,
    Link,
    Stack
} from '@mui/material';
import { format } from 'date-fns';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import { toast } from 'react-toastify';
import web3Service from '../services/web3Service';

const getStatusInfo = (status, confirmations) => {
    switch (status) {
        case 'COMPLETED':
            return {
                label: `Confirmed (${confirmations} blocks)`,
                color: 'success',
                icon: <CheckCircleIcon fontSize="small" sx={{ color: '#00ff94' }} />
            };
        case 'PENDING':
            return {
                label: 'Pending',
                color: 'warning',
                icon: <PendingIcon fontSize="small" sx={{ color: '#ffa726' }} />
            };
        case 'FAILED':
            return {
                label: 'Failed',
                color: 'error',
                icon: <ErrorIcon fontSize="small" sx={{ color: '#ff3d3d' }} />
            };
        default:
            return {
                label: 'Unknown',
                color: 'default',
                icon: null
            };
    }
};

const TransactionHistory = ({ limit }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const txs = await web3Service.getTransactionHistory();
                setTransactions(txs);
                setError(null);
            } catch (error) {
                console.error('Error fetching transactions:', error);
                setError('Failed to load transactions');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();

        // Set up real-time updates
        const interval = setInterval(fetchTransactions, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const getTransactionIcon = (type) => {
        switch (type) {
            case 'SEND':
                return <ArrowUpwardIcon fontSize="small" sx={{ color: '#ff3d3d' }} />;
            case 'RECEIVE':
                return <ArrowDownwardIcon fontSize="small" sx={{ color: '#00ff94' }} />;
            default:
                return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED':
                return 'success';
            case 'PENDING':
                return 'warning';
            case 'FAILED':
                return 'error';
            default:
                return 'default';
        }
    };

    const formatAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const handleCopyAddress = async (address) => {
        try {
            await navigator.clipboard.writeText(address);
            toast.success('Address copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy address:', error);
            toast.error('Failed to copy address');
        }
    };

    const getExplorerUrl = (hash) => {
        // Replace with your network's explorer URL
        return `https://sepolia.etherscan.io/tx/${hash}`;
    };

    const getTransactionKey = (tx, index) => {
        if (tx.hash) return tx.hash;
        return `${tx.from}-${tx.to}-${tx.amount}-${tx.timestamp.getTime()}-${index}`;
    };

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: 200
            }}>
                <CircularProgress sx={{ color: '#00ff94' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ 
                p: 3, 
                textAlign: 'center',
                color: '#ff3d3d'
            }}>
                <Typography variant="body1">{error}</Typography>
            </Box>
        );
    }

    // Apply limit to transactions if specified
    const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

    return (
        <Paper sx={{ 
            width: '100%', 
            overflow: 'hidden',
            bgcolor: 'transparent',
            backgroundImage: 'none',
            boxShadow: 'none'
        }}>
            <TableContainer sx={{ maxHeight: limit ? 300 : 440 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>Amount (ETH)</TableCell>
                            <TableCell>From</TableCell>
                            <TableCell>To</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Block Info</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayTransactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography variant="body2" sx={{ color: '#cccccc' }}>
                                        No transactions yet
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            displayTransactions.map((tx, index) => {
                                const statusInfo = getStatusInfo(tx.status, tx.confirmations);
                                const key = getTransactionKey(tx, index);
                                
                                return (
                                    <TableRow 
                                        key={key}
                                        hover
                                        sx={{
                                            '&:hover': {
                                                bgcolor: 'rgba(0, 255, 148, 0.05) !important'
                                            }
                                        }}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {getTransactionIcon(tx.type)}
                                                <Typography sx={{ color: tx.type === 'SEND' ? '#ff3d3d' : '#00ff94' }}>
                                                    {tx.type}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ 
                                                fontFamily: 'monospace',
                                                fontWeight: 'bold',
                                                color: tx.type === 'SEND' ? '#ff3d3d' : '#00ff94'
                                            }}>
                                                {tx.type === 'SEND' ? '-' : '+'}{tx.amount}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Typography sx={{ fontFamily: 'monospace' }}>
                                                    {formatAddress(tx.from)}
                                                </Typography>
                                                <Tooltip title="Copy address">
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleCopyAddress(tx.from)}
                                                        sx={{ color: '#00ff94' }}
                                                    >
                                                        <ContentCopyIcon sx={{ fontSize: '0.9rem' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Typography sx={{ fontFamily: 'monospace' }}>
                                                    {formatAddress(tx.to)}
                                                </Typography>
                                                <Tooltip title="Copy address">
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleCopyAddress(tx.to)}
                                                        sx={{ color: '#00ff94' }}
                                                    >
                                                        <ContentCopyIcon sx={{ fontSize: '0.9rem' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {format(tx.timestamp, 'MMM dd, yyyy HH:mm')}
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                {statusInfo.icon}
                                                <Chip
                                                    label={statusInfo.label}
                                                    size="small"
                                                    color={statusInfo.color}
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        '& .MuiChip-label': {
                                                            px: 2
                                                        }
                                                    }}
                                                />
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            {tx.blockNumber ? (
                                                <Tooltip title="Block number">
                                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                                        #{tx.blockNumber}
                                                    </Typography>
                                                </Tooltip>
                                            ) : (
                                                <Typography variant="body2" sx={{ color: '#cccccc' }}>
                                                    Pending
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="View on Explorer">
                                                <IconButton 
                                                    component={Link}
                                                    href={getExplorerUrl(tx.hash)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    size="small"
                                                    sx={{ color: '#00ff94' }}
                                                >
                                                    <OpenInNewIcon sx={{ fontSize: '1.1rem' }} />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default TransactionHistory; 