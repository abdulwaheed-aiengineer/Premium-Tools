import express from 'express';
import { listCategories, activeCategories, categoryProducts } from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', listCategories);
router.get('/active', activeCategories);
router.get('/:slug/products', categoryProducts);

export default router;
