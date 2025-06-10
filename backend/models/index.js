const mongoose = require('mongoose');

// Check if models are already defined
const User = mongoose.models.User || require('./User');
const Wallet = mongoose.models.Wallet || require('./Wallet');

module.exports = {
    User,
    Wallet
}; 