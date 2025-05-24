import express from 'express';
import { authenticateToken } from '../middleware/auth';
import MoodEntry from '../models/MoodEntry';

const router = express.Router();

// Create mood entry
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { mood, note } = req.body;
    const userId = req.user?.id;

    const moodEntry = await MoodEntry.create({
      userId,
      mood,
      note,
    });

    res.status(201).json(moodEntry);
  } catch (error) {
    console.error('Create mood entry error:', error);
    res.status(500).json({ message: 'Error creating mood entry' });
  }
});

// Get user's mood entries
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Ensure user can only access their own mood entries
    if (userId !== req.user?.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const moodEntries = await MoodEntry.findAll({
      where: { userId },
      order: [['date', 'DESC']],
      limit: 10,
    });

    res.json(moodEntries);
  } catch (error) {
    console.error('Get mood entries error:', error);
    res.status(500).json({ message: 'Error getting mood entries' });
  }
});

// Get mood entry by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const moodEntry = await MoodEntry.findByPk(id);

    if (!moodEntry) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }

    // Ensure user can only access their own mood entries
    if (moodEntry.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(moodEntry);
  } catch (error) {
    console.error('Get mood entry error:', error);
    res.status(500).json({ message: 'Error getting mood entry' });
  }
});

// Update mood entry
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { mood, note } = req.body;
    const moodEntry = await MoodEntry.findByPk(id);

    if (!moodEntry) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }

    // Ensure user can only update their own mood entries
    if (moodEntry.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await moodEntry.update({ mood, note });
    res.json(moodEntry);
  } catch (error) {
    console.error('Update mood entry error:', error);
    res.status(500).json({ message: 'Error updating mood entry' });
  }
});

// Delete mood entry
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const moodEntry = await MoodEntry.findByPk(id);

    if (!moodEntry) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }

    // Ensure user can only delete their own mood entries
    if (moodEntry.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await moodEntry.destroy();
    res.json({ message: 'Mood entry deleted successfully' });
  } catch (error) {
    console.error('Delete mood entry error:', error);
    res.status(500).json({ message: 'Error deleting mood entry' });
  }
});

export default router; 