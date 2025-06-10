const express = require('express');
const router = express.Router();
const blockchainController = require('../controllers/blockchain.controller');

// User Info and Balance
router.get('/user/:address', blockchainController.getUserInfo);
router.get('/balance/:address', blockchainController.getBalance);
router.get('/transactions/:address', blockchainController.getUserTransactions);

// User Registration
router.post('/register', blockchainController.registerUser);

// Transactions
router.post('/transfer', blockchainController.transfer);
router.post('/transfer-multiple', blockchainController.transferMultiple);

module.exports = router; 