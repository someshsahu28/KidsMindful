import express from 'express';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Sample activities data
const activities = [
  {
    id: '1',
    title: 'Deep Breathing',
    description: 'Practice deep breathing exercises to help you relax.',
    duration: '5 minutes',
    type: 'relaxation',
  },
  {
    id: '2',
    title: 'Gratitude Journal',
    description: 'Write down three things you are grateful for today.',
    duration: '10 minutes',
    type: 'mindfulness',
  },
  {
    id: '3',
    title: 'Body Scan',
    description: 'Focus on each part of your body and release tension.',
    duration: '15 minutes',
    type: 'relaxation',
  },
  {
    id: '4',
    title: 'Happy Memory',
    description: 'Think about a happy memory and draw a picture of it.',
    duration: '20 minutes',
    type: 'creative',
  },
];

// Get all activities
router.get('/', authenticateToken, async (req, res) => {
  try {
    res.json(activities);
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ message: 'Error getting activities' });
  }
});

// Get activity by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const activity = activities.find(a => a.id === id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json(activity);
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ message: 'Error getting activity' });
  }
});

// Get activities by type
router.get('/type/:type', authenticateToken, async (req, res) => {
  try {
    const { type } = req.params;
    const filteredActivities = activities.filter(a => a.type === type);
    res.json(filteredActivities);
  } catch (error) {
    console.error('Get activities by type error:', error);
    res.status(500).json({ message: 'Error getting activities' });
  }
});

export default router; 