import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { CONTRACT_ADDRESS, SECURE_TOKEN_ABI, NETWORK_CONFIG, formatChainId } from '../config/contract.config';

class Web3Service {
    constructor() {
        this.web3 = null;
        this.contract = null;
        this.account = null;
        this.provider = null;
        this.isInitialized = false;
        this.userId = null;
    }

    async setupMetaMask() {
        try {
            // Check if MetaMask is installed
            if (typeof window.ethereum === 'undefined') {
                throw new Error(
                    'MetaMask is not installed. Please install MetaMask to use this application. ' +
                    'Visit https://metamask.io/download/ to install MetaMask.'
                );
            }

            // Initialize provider
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            
            // Request account access
            try {
                const accounts = await window.ethereum.request({ 
                    method: 'eth_requestAccounts' 
                });
                
                if (!accounts || accounts.length === 0) {
                    throw new Error('No accounts found. Please connect your MetaMask wallet.');
                }
                
                this.account = accounts[0];
                console.log('Connected account:', this.account);
            } catch (error) {
                if (error.code === 4001) {
                    throw new Error('Please connect your MetaMask wallet to continue.');
                }
                throw error;
            }

            // Check current network
            const network = await this.provider.getNetwork();
            const expectedChainId = NETWORK_CONFIG.chainId;
            
            if (network.chainId !== expectedChainId) {
                try {
                    // Try to switch to Sepolia network
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: formatChainId(expectedChainId) }],
                    });
                } catch (switchError) {
                    // If Sepolia network is not added to MetaMask
                    if (switchError.code === 4902) {
                        try {
                            // Add Sepolia network to MetaMask
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [{
                                    chainId: formatChainId(expectedChainId),
                                    chainName: NETWORK_CONFIG.name,
                                    nativeCurrency: NETWORK_CONFIG.nativeCurrency,
                                    rpcUrls: [NETWORK_CONFIG.rpcUrl],
                                    blockExplorerUrls: [NETWORK_CONFIG.blockExplorerUrl]
                                }],
                            });
                        } catch (addError) {
                            throw new Error(
                                'Failed to add Sepolia network. Please add it manually in MetaMask:\n' +
                                'Network Name: Sepolia\n' +
                                'RPC URL: https://sepolia.infura.io/v3/\n' +
                                'Chain ID: 11155111\n' +
                                'Currency Symbol: ETH\n' +
                                'Block Explorer URL: https://sepolia.etherscan.io'
                            );
                        }
                    } else if (switchError.code === 4001) {
                        throw new Error('Please switch to Sepolia network in MetaMask to continue.');
                    } else {
                        throw new Error(
                            'Failed to switch to Sepolia network. Please switch manually in MetaMask:\n' +
                            '1. Click the network dropdown in MetaMask\n' +
                            '2. Select "Sepolia Test Network"\n' +
                            '3. If Sepolia is not listed, click "Add Network" and enter the details above'
                        );
                    }
                }
            }

            // Get the signer and initialize contract
            const signer = this.provider.getSigner();
            
            // Initialize contract with signer
            try {
                this.contract = new ethers.Contract(
                    CONTRACT_ADDRESS,
                    SECURE_TOKEN_ABI,
                    signer
                );

                // Verify contract is properly initialized
                if (!this.contract) {
                    throw new Error('Failed to initialize contract. Please check your contract address.');
                }

                // Test contract connection
                try {
                    const isRegistered = await this.contract.isRegistered(this.account);
                    console.log('Contract connection test successful. Registration status:', isRegistered);
                } catch (error) {
                    console.error('Contract connection test failed:', error);
                    throw new Error('Failed to connect to the contract. Please check your network connection and contract address.');
                }

                this.isInitialized = true;
                return this.account;
            } catch (error) {
                console.error('Contract initialization error:', error);
                throw new Error(`Contract initialization failed: ${error.message}`);
            }
        } catch (error) {
            console.error('Error setting up MetaMask:', error);
            throw new Error(`MetaMask setup failed: ${error.message}`);
        }
    }

    async connectWallet() {
        try {
            await this.setupMetaMask();
            toast.success('Successfully connected to MetaMask!');
            return this.account;
        } catch (error) {
            console.error('Error connecting wallet:', error);
            toast.error(error.message);
            throw error;
        }
    }

    async init() {
        try {
            if (!this.isInitialized) {
                await this.setupMetaMask();
            }

            // Ensure contract is initialized
            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            // Check if user is registered
            const isRegistered = await this.contract.isRegistered(this.account);
            console.log('Registration status:', isRegistered);

            if (!isRegistered) {
                try {
                    // Get current gas price
                    const gasPrice = await this.provider.getGasPrice();
                    console.log('Current gas price:', ethers.utils.formatUnits(gasPrice, 'gwei'), 'gwei');

                    // Send registration transaction
                    const tx = await this.contract.register({
                        gasLimit: NETWORK_CONFIG.defaultGasLimit,
                        gasPrice: gasPrice
                    });

                    console.log('Registration transaction sent:', tx.hash);
                    
                    // Wait for transaction confirmation
                    const receipt = await tx.wait();
                    console.log('Registration transaction confirmed:', receipt);

                    if (receipt.status === 1) {
                        console.log('Registration successful');
                        toast.success('Registration successful!');
                    } else {
                        throw new Error('Registration transaction failed');
                    }
                } catch (error) {
                    console.error('Registration error:', error);
                    if (error.message.includes('insufficient funds')) {
                        throw new Error('Insufficient funds for registration. Please add some Sepolia ETH to your account.');
                    } else if (error.message.includes('user denied')) {
                        throw new Error('Registration was cancelled by the user');
                    } else {
                        throw new Error(`Registration failed: ${error.message}`);
                    }
                }
            }

            return true;
        } catch (error) {
            console.error('Error initializing Web3:', error);
            throw new Error(`Error initializing Web3: ${error.message}`);
        }
    }

    isConnected() {
        return this.web3 !== null && this.contract !== null && this.account !== null;
    }

    async getBalance() {
        if (!this.isConnected()) {
            await this.init();
        }
        try {
            const balance = await this.provider.getBalance(this.account);
            return ethers.utils.formatEther(balance);
        } catch (error) {
            console.error('Error getting balance:', error);
            throw new Error(`Failed to get balance: ${error.message}`);
        }
    }

    async getGasPrice() {
        if (!this.isConnected()) {
            await this.init();
        }
        try {
            const gasPrice = await this.provider.getGasPrice();
            return gasPrice;
        } catch (error) {
            console.error('Error getting gas price:', error);
            throw new Error(`Failed to get gas price: ${error.message}`);
        }
    }

    async estimateGas(method, params) {
        if (!this.isConnected()) {
            await this.init();
        }
        try {
            const gasEstimate = await this.contract.estimateGas[method](...params);
            return Number(gasEstimate) * 1.2; // Add 20% buffer
        } catch (error) {
            console.error(`Error estimating gas for ${method}:`, error);
            throw error;
        }
    }

    async sendTransaction(method, params, options = {}) {
        if (!this.isConnected()) {
            await this.init();
        }
        try {
            const tx = await this.contract[method](...params, {
                ...options,
                from: this.account
            });
            return tx;
        } catch (error) {
            console.error(`Error sending transaction for ${method}:`, error);
            throw error;
        }
    }

    async transfer(to, amount, options = {}) {
        if (!this.isConnected()) {
            await this.init();
        }
        try {
            // Convert amount to Wei if it's not already
            const amountWei = typeof amount === 'string' ? 
                ethers.utils.parseEther(amount) : 
                amount;

            // Get current gas price if not provided
            const gasPrice = options.gasPrice || await this.provider.getGasPrice();
            
            // Use default gas limit if not provided
            const gasLimit = options.gasLimit || NETWORK_CONFIG.defaultGasLimit;

            // Send the transaction with value
            const tx = await this.contract.transfer(to, {
                value: amountWei,
                gasLimit,
                gasPrice,
                ...options
            });

            return tx;
        } catch (error) {
            console.error('Transfer error:', error);
            throw error;
        }
    }

    async getTransactionHistory() {
        try {
            if (!this.isConnected()) {
                await this.init();
            }

            const transactions = await this.contract.getUserTransactions(this.account);
            
            return transactions.map(tx => ({
                from: tx.from,
                to: tx.to,
                amount: ethers.utils.formatEther(tx.amount),
                timestamp: new Date(Number(tx.timestamp) * 1000),
                completed: tx.completed,
                status: tx.status,
                gasUsed: tx.gasUsed.toString(),
                transactionType: tx.transactionType
            }));
        } catch (error) {
            console.error('Error getting transaction history:', error);
            throw error;
        }
    }

    async retryRegistration() {
        try {
            if (!this.isConnected()) {
                await this.init();
            }

            const gasEstimate = await this.contract.estimateGas.register();
            const gasLimit = Number(gasEstimate) * 1.2;
            const gasPrice = await this.getGasPrice();

            const tx = await this.contract.register({
                gasLimit: Math.floor(gasLimit),
                gasPrice: gasPrice
            });

            await tx.wait();
            toast.success('Registration successful!');
            return true;
        } catch (error) {
            console.error('Retry registration error:', error);
            throw error;
        }
    }

    setUserId(userId) {
        this.userId = userId;
        // Store userId in localStorage for persistence
        if (userId) {
            localStorage.setItem('userId', userId);
        } else {
            localStorage.removeItem('userId');
        }
    }

    getUserId() {
        if (!this.userId) {
            this.userId = localStorage.getItem('userId');
        }
        return this.userId;
    }

    disconnect() {
        // Reset all service properties
        this.web3 = null;
        this.contract = null;
        this.account = null;
        this.provider = null;
        this.isInitialized = false;
        this.userId = null;
        
        // Remove any stored data
        localStorage.removeItem('walletConnected');
        localStorage.removeItem('lastConnectedAccount');
        localStorage.removeItem('userId');
        
        // Notify user
        toast.info('Wallet disconnected successfully');
    }

    getAccount() {
        return this.account;
    }
}

const web3Service = new Web3Service();
export default web3Service; 