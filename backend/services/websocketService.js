const socketIo = require('socket.io');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');

class WebSocketService {
    constructor(server) {
        this.io = socketIo(server, {
            cors: {
                origin: process.env.FRONTEND_URL || 'http://localhost:3000',
                methods: ['GET', 'POST']
            }
        });

        this.setupSocketHandlers();
    }

    setupSocketHandlers() {
        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });

            // Handle user joining their wallet room
            socket.on('joinWallet', (walletId) => {
                socket.join(`wallet_${walletId}`);
            });
        });
    }

    // Emit transaction update to relevant clients
    emitTransactionUpdate(transaction) {
        if (transaction.sender) {
            this.io.to(`wallet_${transaction.sender}`).emit('transactionUpdate', transaction);
        }
        if (transaction.receiver) {
            this.io.to(`wallet_${transaction.receiver}`).emit('transactionUpdate', transaction);
        }
    }

    // Emit wallet balance update
    emitWalletUpdate(wallet) {
        this.io.to(`wallet_${wallet._id}`).emit('walletUpdate', {
            address: wallet.address,
            balance: wallet.balance,
            publicKey: wallet.publicKey
        });
    }

    // Emit new user wallet creation with initial balance
    emitNewWalletCreated(wallet) {
        this.io.to(`wallet_${wallet._id}`).emit('walletCreated', {
            address: wallet.address,
            balance: '2',  // Initial balance of 2 ETH
            publicKey: wallet.publicKey
        });
    }
}

module.exports = WebSocketService;