import express from 'express';
import Activity from '../models/Activity.js';
import { Op } from 'sequelize';

const router = express.Router();

// Get all activities
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.findAll({
      where: { isActive: true },
      order: [['likes', 'DESC']]
    });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
});

// Get activities by mood
router.get('/mood/:mood', async (req, res) => {
  try {
    const activities = await Activity.findAll({
      where: {
        isActive: true,
        targetMoods: {
          [Op.contains]: [req.params.mood]
        }
      },
      order: [['likes', 'DESC']]
    });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities by mood', error: error.message });
  }
});

// Get activities by age group
router.get('/age/:age', async (req, res) => {
  try {
    const age = parseInt(req.params.age);
    const activities = await Activity.findAll({
      where: {
        isActive: true,
        recommendedAge: age
      },
      order: [['likes', 'DESC']]
    });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities by age', error: error.message });
  }
});

// Like an activity
router.post('/:id/like', async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    activity.likes += 1;
    await activity.save();
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

    const activity = await Activity.create({
      title,
      description,
      category,
      imageUrl,
      targetMoods,
      recommendedAge,
      likes: 0,
      isActive: true
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Error creating activity', error: error.message });
  }
});

export default router; 