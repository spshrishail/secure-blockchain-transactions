const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Wallet routes
router.post('/associate', walletController.associateWallet);
router.get('/accounts', walletController.getUserWallets);
router.delete('/:walletId', walletController.removeWallet);

module.exports = router; 