const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

const WalletService = require('../services/walletService');

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    console.log('Signup request received:', req.body);
    const { username, email, password, phone } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: 'Please provide all required fields',
        missing: {
          username: !username,
          email: !email,
          password: !password
        }
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user exists
    console.log('Checking if user exists...');
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ 
        message: userExists.email === email ? 'Email already registered' : 'Username already taken' 
      });
    }

    // Create user
    console.log('Creating user...');
    const user = await User.create({
      username,
      email,
      password,
      phone
    });

    // Create wallet for user
    console.log('Creating wallet for user...');
    const wallet = await WalletService.createWallet(user._id);

    // Generate token
    const token = generateToken(user._id);

    console.log('Signup successful!');
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Server error during signup', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/signin
// @access  Public
const signin = async (req, res) => {
  try {
    console.log('Signin request received');
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide both email and password' 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    console.log('Signin successful!');
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ 
      message: 'Server error during signin', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports = {
  signup,
  signin
};