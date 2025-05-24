const express = require('express');
const MoodEntry = require('../models/MoodEntry');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { sequelize } = require('sequelize');

const router = express.Router();

// Get all mood entries for a user
router.get('/:userId', async (req, res) => {
  try {
    const moodEntries = await MoodEntry.findAll({
      where: { UserId: req.params.userId },
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['username', 'name'] }]
    });

    res.json(moodEntries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mood entries', error: error.message });
  }
});

// Create a new mood entry
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { mood, note, userId } = req.body;
    
    // Validate input
    if (!mood || !userId) {
      return res.status(400).json({ message: 'Mood and userId are required' });
    }

    const moodEntry = await MoodEntry.create({
      mood,
      note,
      userId,
      date: new Date()
    });
    res.status(201).json(moodEntry);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create mood entry', error: error.message });
  }
});

// Get mood statistics for a user
router.get('/stats/:userId', authenticateToken, async (req, res) => {
  try {
    const moodEntries = await MoodEntry.findAll({
      where: { userId: req.params.userId },
      order: [['createdAt', 'DESC']]
    });

    const stats = {
      total: moodEntries.length,
      byMood: {},
      averageIntensity: 0,
      mostCommonMood: '',
      recentTrend: []
    };

    let intensitySum = 0;
    moodEntries.forEach(entry => {
      stats.byMood[entry.mood] = (stats.byMood[entry.mood] || 0) + 1;
      if (entry.intensity) {
        intensitySum += entry.intensity;
      }
    });

    stats.averageIntensity = moodEntries.length ? intensitySum / moodEntries.length : 0;
    stats.mostCommonMood = Object.entries(stats.byMood)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';
    stats.recentTrend = moodEntries.slice(0, 5).map(entry => entry.mood);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mood statistics', error: error.message });
  }
});

// Get all mood entries for a user
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const moodEntries = await MoodEntry.findAll({
      where: { userId },
      order: [['date', 'DESC']],
      limit: 10
    });
    res.json(moodEntries);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch mood entries', error: error.message });
  }
});

// Get a specific mood entry
router.get('/entry/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const moodEntry = await MoodEntry.findByPk(id);
    if (!moodEntry) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }
    res.json(moodEntry);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch mood entry', error: error.message });
  }
});

// Update a mood entry
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { mood, note } = req.body;
    const moodEntry = await MoodEntry.findByPk(id);
    if (!moodEntry) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }
    await moodEntry.update({ mood, note });
    res.json(moodEntry);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update mood entry', error: error.message });
  }
});

// Delete a mood entry
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const moodEntry = await MoodEntry.findByPk(id);
    if (!moodEntry) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }
    await moodEntry.destroy();
    res.json({ message: 'Mood entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete mood entry', error: error.message });
  }
});

module.exports = router; 