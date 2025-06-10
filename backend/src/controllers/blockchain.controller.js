const web3Service = require('../services/web3.service');

class BlockchainController {
    async getUserInfo(req, res) {
        try {
            const { address } = req.params;
            
            if (!web3Service.isContractAvailable()) {
                return res.status(503).json({
                    success: false,
                    message: 'Blockchain services are temporarily unavailable'
                });
            }

            const userInfo = await web3Service.getUserInfo(address);
            res.json({
                success: true,
                data: {
                    username: userInfo[0],
                    registrationDate: userInfo[1].toString(),
                    totalTransactions: userInfo[2].toString(),
                    balance: userInfo[3].toString()
                }
            });
        } catch (error) {
            console.error('Error getting user info:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getUserTransactions(req, res) {
        try {
            const { address } = req.params;

            if (!web3Service.isContractAvailable()) {
                return res.status(503).json({
                    success: false,
                    message: 'Blockchain services are temporarily unavailable'
                });
            }

            const transactions = await web3Service.getUserTransactions(address);
            res.json({
                success: true,
                data: transactions.map(tx => ({
                    from: tx.from,
                    to: tx.to,
                    amount: tx.amount.toString(),
                    timestamp: tx.timestamp.toString(),
                    transactionType: tx.transactionType,
                    completed: tx.completed
                }))
            });
        } catch (error) {
            console.error('Error getting user transactions:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async registerUser(req, res) {
        try {
            const { address, username } = req.body;

            if (!web3Service.isContractAvailable()) {
                return res.status(503).json({
                    success: false,
                    message: 'Blockchain services are temporarily unavailable'
                });
            }

            const result = await web3Service.registerUser(address, username);
            res.json({
                success: true,
                data: {
                    transactionHash: result.transactionHash
                }
            });
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async transfer(req, res) {
        try {
            const { from, to, amount } = req.body;

            if (!web3Service.isContractAvailable()) {
                return res.status(503).json({
                    success: false,
                    message: 'Blockchain services are temporarily unavailable'
                });
            }

            const result = await web3Service.transfer(from, to, amount);
            res.json({
                success: true,
                data: {
                    transactionHash: result.transactionHash
                }
            });
        } catch (error) {
            console.error('Error transferring tokens:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async transferMultiple(req, res) {
        try {
            const { from, recipients, amounts } = req.body;

            if (!web3Service.isContractAvailable()) {
                return res.status(503).json({
                    success: false,
                    message: 'Blockchain services are temporarily unavailable'
                });
            }

            const result = await web3Service.transferMultiple(from, recipients, amounts);
            res.json({
                success: true,
                data: {
                    transactionHash: result.transactionHash
                }
            });
        } catch (error) {
            console.error('Error in multiple transfer:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getBalance(req, res) {
        try {
            const { address } = req.params;

            if (!web3Service.isContractAvailable()) {
                return res.status(503).json({
                    success: false,
                    message: 'Blockchain services are temporarily unavailable'
                });
            }

            const balance = await web3Service.getBalance(address);
            res.json({
                success: true,
                data: {
                    balance: balance.toString()
                }
            });
        } catch (error) {
            console.error('Error getting balance:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new BlockchainController(); 