const express = require('express');
const router = express.Router();
const { User, MoodEntry } = require('../models');

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'createdAt'],
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all mood entries
router.get('/mood-entries', async (req, res) => {
  try {
    const entries = await MoodEntry.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });
    res.json(entries);
  } catch (error) {
    console.error('Error fetching mood entries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 