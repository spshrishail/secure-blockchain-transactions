const Blockchain = require('../blockchain/Blockchain');
const Transaction = require('../blockchain/Transaction');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class BlockchainService {
    constructor() {
        this.blockchain = new Blockchain();
        this.wallets = new Map();
    }

    createWallet() {
        const key = ec.genKeyPair();
        const publicKey = key.getPublic('hex');
        const privateKey = key.getPrivate('hex');

        this.wallets.set(publicKey, key);

        return {
            publicKey,
            privateKey
        };
    }

    getWallet(publicKey) {
        return this.wallets.get(publicKey);
    }

    createTransaction(fromAddress, toAddress, amount) {
        const transaction = new Transaction(fromAddress, toAddress, amount);
        const wallet = this.getWallet(fromAddress);

        if (!wallet) {
            throw new Error('Wallet not found');
        }

        transaction.sign(wallet);
        this.blockchain.addTransaction(transaction);

        return transaction;
    }

    mineBlock(minerAddress) {
        this.blockchain.minePendingTransactions(minerAddress);
        return this.blockchain.getLatestBlock();
    }

    getBalance(address) {
        return this.blockchain.getBalanceOfAddress(address);
    }

    getTransactionHistory(address) {
        return this.blockchain.getAllTransactionsForAddress(address);
    }

    validateChain() {
        return this.blockchain.isChainValid();
    }

    getBlockchain() {
        return this.blockchain;
    }
}

// Create a singleton instance
const blockchainService = new BlockchainService();
module.exports = blockchainService; 