import express from 'express';
import { getPage } from '../controllers/pageController.js';

const router = express.Router();

router.get('/:slug', getPage);

export default router;
