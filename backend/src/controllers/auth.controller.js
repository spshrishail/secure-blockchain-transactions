const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../../models');

class AuthController {
  async login(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Check password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Return user info and token
      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async register(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed',
          errors: errors.array() 
        });
      }

      const { email, password, username, phone } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() },
          ...(phone ? [{ phone }] : [])
        ]
      });

      if (existingUser) {
        if (existingUser.email === email.toLowerCase()) {
          return res.status(400).json({ message: 'Email already registered' });
        }
        if (existingUser.username === username.toLowerCase()) {
          return res.status(400).json({ message: 'Username already taken' });
        }
        if (phone && existingUser.phone === phone) {
          return res.status(400).json({ message: 'Phone number already registered' });
        }
      }

      // Create new user
      const user = new User({
        email: email.toLowerCase(),
        password,
        username: username.toLowerCase(),
        ...(phone && { phone })
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User created successfully',
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          phone: user.phone
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific MongoDB errors
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(400).json({ 
          message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
        });
      }

      res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async logout(req, res) {
    try {
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      res.json({
        user: {
          id: user._id,
          email: user.email,
          username: user.username
        }
      });
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ message: 'Invalid token' });
    }
  }

  async getProfile(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      res.json({
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(401).json({ message: 'Invalid token' });
    }
  }
}

module.exports = new AuthController(); 