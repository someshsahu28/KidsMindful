import express from 'express';
import aiController from '../controllers/aiController.js';

const router = express.Router();

router.post('/generate-story', aiController.generateStory);

export default router;