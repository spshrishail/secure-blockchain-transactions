import { ethers } from 'ethers';
import SecureTransaction from '../contracts/SecureTransaction.json';

class ContractService {
    constructor() {
        this.contract = null;
        this.provider = null;
        this.signer = null;
        this.contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    }

    async init() {
        if (typeof window.ethereum === 'undefined') {
            throw new Error('MetaMask is not installed');
        }

        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = this.provider.getSigner();
        
        this.contract = new ethers.Contract(
            this.contractAddress,
            SecureTransaction.abi,
            this.signer
        );
    }

    async registerUser(username) {
        if (!this.contract) await this.init();
        const tx = await this.contract.registerUser(username);
        await tx.wait();
        return tx;
    }

    async transfer(toAddress, amount) {
        if (!this.contract) await this.init();
        const amountInWei = ethers.utils.parseEther(amount.toString());
        const tx = await this.contract.transfer(toAddress, amountInWei);
        await tx.wait();
        return tx;
    }

    async getUserInfo(address) {
        if (!this.contract) await this.init();
        const info = await this.contract.getUserInfo(address);
        return {
            username: info[0],
            registrationDate: new Date(info[1].toNumber() * 1000),
            totalTransactions: info[2].toNumber(),
            balance: ethers.utils.formatEther(info[3])
        };
    }

    async getUserTransactions(address) {
        if (!this.contract) await this.init();
        const transactions = await this.contract.getUserTransactions(address);
        return transactions.map(tx => ({
            from: tx.from,
            to: tx.to,
            amount: ethers.utils.formatEther(tx.amount),
            timestamp: new Date(tx.timestamp.toNumber() * 1000),
            type: tx.transactionType,
            completed: tx.completed
        }));
    }

    async getTransactionCount() {
        if (!this.contract) await this.init();
        const count = await this.contract.getTransactionCount();
        return count.toNumber();
    }

    async getBalance(address) {
        if (!this.contract) await this.init();
        const balance = await this.contract.balanceOf(address);
        return ethers.utils.formatEther(balance);
    }

    // Event listeners
    onTransactionExecuted(callback) {
        if (!this.contract) this.init();
        this.contract.on('TransactionExecuted', (from, to, amount, timestamp, type) => {
            callback({
                from,
                to,
                amount: ethers.utils.formatEther(amount),
                timestamp: new Date(timestamp.toNumber() * 1000),
                type
            });
        });
    }

    onUserRegistered(callback) {
        if (!this.contract) this.init();
        this.contract.on('UserRegistered', (userAddress, username, timestamp) => {
            callback({
                userAddress,
                username,
                timestamp: new Date(timestamp.toNumber() * 1000)
            });
        });
    }
}

const contractService = new ContractService();
export default contractService; 