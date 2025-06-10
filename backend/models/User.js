const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['REWARD', 'SEND', 'RECEIVE'],
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'PENDING'
  },
  from: String,
  to: String
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: false,
    unique: true,
    sparse: true
  },
  password: {
    type: String,
    required: true
  },
  wallet: {
    address: {
      type: String,
      unique: true,
      sparse: true
    },
    encryptedPrivateKey: {
      type: String
    },
    publicKey: {
      type: String
    },
    transactions: [transactionSchema]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Only define the model if it hasn't been defined yet
module.exports = mongoose.models.User || mongoose.model('User', userSchema); 