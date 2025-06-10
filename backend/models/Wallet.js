const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    address: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^0x[a-fA-F0-9]{40}$/.test(v);
            },
            message: props => `${props.value} is not a valid Ethereum address!`
        }
    }
}, {
    timestamps: true
});

// Only define the model if it hasn't been defined yet
module.exports = mongoose.models.Wallet || mongoose.model('Wallet', walletSchema);