import express from 'express';
import { listBanners } from '../controllers/bannerController.js';

const router = express.Router();

router.get('/', listBanners);

export default router;
