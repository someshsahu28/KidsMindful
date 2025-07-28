import express from 'express';
import MoodEntryService from '../models/MoodEntry.js';
import UserService from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all mood entries for a user
router.get('/:userId', async (req, res) => {
  try {
    const moodEntries = await MoodEntryService.findByUserId(req.params.userId);
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

    // Verify user exists
    const user = await UserService.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify user is authorized
    if (userId !== req.user?.id) {
      return res.status(403).json({ message: 'Unauthorized to create mood for this user' });
    }

    const moodEntry = await MoodEntryService.create({
      mood,
      note,
      userId,
      date: new Date()
    });

    res.status(201).json(moodEntry);
  } catch (error) {
    console.error('Error creating mood entry:', error);
    res.status(400).json({ 
      message: 'Failed to create mood entry', 
      error: error.message 
    });
  }
});

// Get mood statistics for a user
router.get('/stats/:userId', async (req, res) => {
  try {
    const stats = await MoodEntryService.getMoodStats(req.params.userId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mood statistics', error: error.message });
  }
});

// Get mood entries for a user
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user is authorized
    if (userId !== req.user?.id) {
      return res.status(403).json({ message: 'Unauthorized to view moods for this user' });
    }

    const moodEntries = await MoodEntryService.findByUserId(userId);
    res.json(moodEntries.slice(0, 10)); // Limit to 10 most recent
  } catch (error) {
    console.error('Error fetching mood entries:', error);
    res.status(500).json({ message: 'Failed to fetch mood entries' });
  }
});

// Get a specific mood entry
router.get('/entry/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const moodEntry = await MoodEntryService.findById(id);

    if (!moodEntry) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }

    // Verify user is authorized
    if (moodEntry.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Unauthorized to view this mood entry' });
    }

    res.json(moodEntry);
  } catch (error) {
    console.error('Error fetching mood entry:', error);
    res.status(500).json({ message: 'Failed to fetch mood entry' });
  }
});

// Update a mood entry
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { mood, note } = req.body;
    const moodEntry = await MoodEntryService.findById(id);

    if (!moodEntry) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }

    // Verify user is authorized
    if (moodEntry.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Unauthorized to update this mood entry' });
    }

    const updatedEntry = await MoodEntryService.update(id, { mood, note });
    res.json(updatedEntry);
  } catch (error) {
    console.error('Error updating mood entry:', error);
    res.status(500).json({ message: 'Failed to update mood entry' });
  }
});

// Delete a mood entry
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const moodEntry = await MoodEntryService.findById(id);

    if (!moodEntry) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }

    // Verify user is authorized
    if (moodEntry.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this mood entry' });
    }

    await MoodEntryService.delete(id);
    res.json({ message: 'Mood entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting mood entry:', error);
    res.status(500).json({ message: 'Failed to delete mood entry' });
  }
});

export default router; 