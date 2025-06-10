const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const Block = require('../models/Block');
const { Web3 } = require('web3');
const WebSocketService = require('../services/websocketService');

// Initialize WebSocket service
let wsService;

// Initialize Web3 with a provider
let web3;
try {
  web3 = new Web3(process.env.WEB3_PROVIDER || 'http://127.0.0.1:7545');
} catch (error) {
  console.error('Web3 initialization error:', error);
  // Initialize with a dummy provider if connection fails
  web3 = new Web3('http://127.0.0.1:7545');
}

// Initialize WebSocket service with server instance
exports.initializeWebSocket = (server) => {
    wsService = new WebSocketService(server);
};

exports.createTransaction = async (req, res) => {
  try {
    const { receiverId, amount, transactionHash } = req.body;
    const senderId = req.user._id;

    // Create transaction record
    const transaction = new Transaction({
      sender: senderId,
      receiver: receiverId,
      amount,
      status: 'pending'
    });

    if (transactionHash) {
      transaction.transactionHash = transactionHash;
      // Verify blockchain transaction if hash provided
      try {
        const receipt = await web3.eth.getTransactionReceipt(transactionHash);
        if (receipt) {
          transaction.status = 'completed';
          transaction.blockHash = receipt.blockHash;
          transaction.blockNumber = receipt.blockNumber;
          transaction.gasUsed = receipt.gasUsed;
        }
      } catch (error) {
        console.error('Blockchain verification error:', error);
      }
    }

    await transaction.save();

    // Emit transaction update through WebSocket
    if (wsService) {
        wsService.emitTransactionUpdate(transaction);
    }

    // Update wallet balances if transaction is completed
    if (transaction.status === 'completed') {
        const senderWallet = await Wallet.findOneAndUpdate(
            { user: senderId },
        { $inc: { balance: -amount } }
      );
      await Wallet.findOneAndUpdate(
        { user: receiverId },
        { $inc: { balance: amount } }
      );
    }

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing transaction',
      error: error.message
    });
  }
};

exports.getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
    .populate('sender', 'fullName')
    .populate('receiver', 'fullName')
    .sort({ timestamp: -1 });

    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error.message
    });
  }
};