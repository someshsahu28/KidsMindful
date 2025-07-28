import express from 'express';
import ActivityService from '../models/Activity.js';

const router = express.Router();

// Get all activities
router.get('/', async (req, res) => {
  try {
    const activities = await ActivityService.findAll();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
});

// Get activities by mood
router.get('/mood/:mood', async (req, res) => {
  try {
    const activities = await ActivityService.findByTargetMood(req.params.mood);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities by mood', error: error.message });
  }
});

// Get activities by age group
router.get('/age/:age', async (req, res) => {
  try {
    const age = parseInt(req.params.age);
    const activities = await ActivityService.findByRecommendedAge(age);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities by age', error: error.message });
  }
});

// Get activities by category
router.get('/category/:category', async (req, res) => {
  try {
    const activities = await ActivityService.findByCategory(req.params.category);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities by category', error: error.message });
  }
});

// Get popular activities
router.get('/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const activities = await ActivityService.getPopularActivities(limit);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching popular activities', error: error.message });
  }
});

// Search activities
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    const activities = await ActivityService.search(q);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error searching activities', error: error.message });
  }
});

// Get activity by ID
router.get('/:id', async (req, res) => {
  try {
    const activity = await ActivityService.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity', error: error.message });
  }
});

// Like an activity
router.post('/:id/like', async (req, res) => {
  try {
    const activity = await ActivityService.incrementLikes(req.params.id);
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Error liking activity', error: error.message });
  }
});

// Create a new activity (admin only)
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      imageUrl,
      targetMoods,
      recommendedAge
    } = req.body;

    const activity = await ActivityService.create({
      title,
      description,
      category,
      imageUrl,
      targetMoods: targetMoods || [],
      recommendedAge,
      likes: 0,
      isActive: true
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Error creating activity', error: error.message });
  }
});

// Update an activity (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const activity = await ActivityService.update(id, updateData);
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Error updating activity', error: error.message });
  }
});

// Delete an activity (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await ActivityService.softDelete(id);
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting activity', error: error.message });
  }
});

export default router; 