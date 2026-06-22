import express from 'express';
import { listProducts, productDetail, relatedProducts, featuredProducts, topDealsProducts } from '../controllers/productController.js';

const router = express.Router();

router.get('/', listProducts);
router.get('/featured', featuredProducts);
router.get('/top-deals', topDealsProducts);
router.get('/related', relatedProducts);
router.get('/:slug', productDetail);

export default router;
