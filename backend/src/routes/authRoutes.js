const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, password, name, age, gender } = req.body;

    // Validate required fields
    if (!username || !password || !name || !age || !gender) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
        errors: {
          username: !username ? 'Username is required' : null,
          password: !password ? 'Password is required' : null,
          name: !name ? 'Name is required' : null,
          age: !age ? 'Age is required' : null,
          gender: !gender ? 'Please select if you are a boy or a girl' : null
        }
      });
    }

    // Validate username format
    if (username.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters long'
      });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists. Please choose a different username.'
      });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Validate age
    if (age < 5 || age > 12) {
      return res.status(400).json({
        success: false,
        message: 'Age must be between 5 and 12 years'
      });
    }

    // Validate gender
    if (!['boy', 'girl'].includes(gender.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Please select if you are a boy or a girl'
      });
    }

    // Create user
    const user = await User.create({
      username,
      password,
      name,
      age,
      gender: gender.toLowerCase()
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Send success response
    return res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        age: user.age,
        gender: user.gender,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find user with password
    const user = await User.scope('withPassword').findOne({ 
      where: { username, isActive: true } 
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    // Send success response
    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router; 