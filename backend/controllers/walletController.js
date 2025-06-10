const { User, Wallet } = require('../models');

const walletController = {
    // Associate a wallet address with a user
    async associateWallet(req, res) {
        try {
            const { userId, address } = req.body;

            // Validate user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if address is already associated with another user
            const existingWallet = await Wallet.findOne({ address });
            if (existingWallet) {
                return res.status(400).json({ message: 'Wallet address already associated with another user' });
            }

            // Create new wallet association
            const wallet = await Wallet.create({
                userId,
                address
            });

            res.status(201).json({
                message: 'Wallet associated successfully',
                wallet: {
                    id: wallet._id,
                    address: wallet.address,
                    userId: wallet.userId
                }
            });
        } catch (error) {
            console.error('Error associating wallet:', error);
            res.status(500).json({ message: 'Failed to associate wallet', error: error.message });
        }
    },

    // Get all wallet addresses for a user
    async getUserWallets(req, res) {
        try {
            const userId = req.user.id; // Assuming auth middleware sets req.user

            const wallets = await Wallet.find({ userId })
                .select('_id address createdAt')
                .sort({ createdAt: -1 });

            res.json(wallets);
        } catch (error) {
            console.error('Error fetching user wallets:', error);
            res.status(500).json({ message: 'Failed to fetch user wallets', error: error.message });
        }
    },

    // Remove wallet association
    async removeWallet(req, res) {
        try {
            const { walletId } = req.params;
            const userId = req.user.id;

            const wallet = await Wallet.findOne({
                _id: walletId,
                userId
            });

            if (!wallet) {
                return res.status(404).json({ message: 'Wallet not found or not associated with user' });
            }

            await wallet.deleteOne();
            res.json({ message: 'Wallet association removed successfully' });
        } catch (error) {
            console.error('Error removing wallet:', error);
            res.status(500).json({ message: 'Failed to remove wallet association', error: error.message });
        }
    }
};

module.exports = walletController; 