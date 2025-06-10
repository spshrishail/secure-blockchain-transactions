const ethers = require('ethers');
const path = require('path');
const fs = require('fs');

class Web3Service {
    constructor() {
        this.provider = null;
        this.contract = null;
        this.signer = null;
        this.initialize();
    }

    initialize() {
        try {
            // Initialize provider based on environment
            const network = process.env.NODE_ENV === 'production' ? 'sepolia' : 'localhost';
            this.provider = new ethers.providers.JsonRpcProvider(
                process.env.RPC_URL || 'http://127.0.0.1:8545'
            );

            // Try to load contract ABI and address
            try {
                const artifactPath = path.resolve(__dirname, '../../../artifacts/contracts/SecureToken.sol/SecureToken.json');
                if (fs.existsSync(artifactPath)) {
                    const contractArtifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
                    const contractAddress = process.env.CONTRACT_ADDRESS;

                    if (contractAddress) {
                        this.contract = new ethers.Contract(
                            contractAddress,
                            contractArtifact.abi,
                            this.provider
                        );

                        // Initialize wallet if private key is provided
                        if (process.env.PRIVATE_KEY) {
                            this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
                            this.contract = this.contract.connect(this.signer);
                        }
                    } else {
                        console.warn('Contract address not provided in environment variables');
                    }
                } else {
                    console.warn('Contract artifact not found. Some blockchain features may be unavailable.');
                }
            } catch (error) {
                console.warn('Failed to initialize contract:', error.message);
            }
        } catch (error) {
            console.error('Failed to initialize Web3 service:', error);
            // Don't throw error, allow service to continue without blockchain features
        }
    }

    isInitialized() {
        return this.provider !== null;
    }

    isContractAvailable() {
        return this.contract !== null;
    }

    // Contract Read Methods
    async getUserInfo(address) {
        if (!this.isContractAvailable()) {
            throw new Error('Smart contract not initialized');
        }
        try {
            return await this.contract.getUserInfo(address);
        } catch (error) {
            console.error('Error getting user info:', error);
            throw error;
        }
    }

    async getUserTransactions(address) {
        if (!this.isContractAvailable()) {
            throw new Error('Smart contract not initialized');
        }
        try {
            return await this.contract.getUserTransactions(address);
        } catch (error) {
            console.error('Error getting user transactions:', error);
            throw error;
        }
    }

    async getBalance(address) {
        if (!this.isContractAvailable()) {
            throw new Error('Smart contract not initialized');
        }
        try {
            return await this.contract.balanceOf(address);
        } catch (error) {
            console.error('Error getting balance:', error);
            throw error;
        }
    }

    // Contract Write Methods
    async registerUser(address, username) {
        if (!this.isContractAvailable()) {
            throw new Error('Smart contract not initialized');
        }
        try {
            const tx = await this.contract.registerUser(username);
            return await tx.wait();
        } catch (error) {
            console.error('Error registering user:', error);
            throw error;
        }
    }

    async transfer(to, amount) {
        if (!this.isContractAvailable()) {
            throw new Error('Smart contract not initialized');
        }
        try {
            const parsedAmount = ethers.utils.parseEther(amount.toString());
            const tx = await this.contract.transfer(to, parsedAmount);
            return tx; // Do not wait here, wait in UI (SendMoneyPage.jsx)
        } catch (error) {
            console.error('Error transferring tokens:', error);
            throw error;
        }
    }
    

    async transferMultiple(from, recipients, amounts) {
        if (!this.isContractAvailable()) {
            throw new Error('Smart contract not initialized');
        }
        try {
            const tx = await this.contract.transferMultiple(recipients, amounts);
            return await tx.wait();
        } catch (error) {
            console.error('Error in multiple transfer:', error);
            throw error;
        }
    }

    // Event Listeners
    async subscribeToEvents() {
        if (!this.isContractAvailable()) {
            console.warn('Smart contract not initialized, events will not be subscribed');
            return;
        }
        this.contract.on('TransactionExecuted', (from, to, amount, timestamp, transactionType) => {
            console.log('Transaction executed:', { from, to, amount, timestamp, transactionType });
            // Here you can add custom event handling logic
        });

        this.contract.on('UserRegistered', (userAddress, username, timestamp) => {
            console.log('User registered:', { userAddress, username, timestamp });
            // Here you can add custom event handling logic
        });
    }
}

module.exports = new Web3Service(); 