import express from 'express';
import { body } from 'express-validator';
import { adminLogin } from '../controllers/authController.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { uploadSingle, uploadMultiple } from '../middleware/uploadMiddleware.js';
import {
  adminListProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminCreateVariant,
  adminUpdateVariant,
  adminDeleteVariant,
} from '../controllers/productController.js';
import {
  adminListCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from '../controllers/categoryController.js';
import {
  adminGetOrders,
  adminGetOrderById,
  adminUpdateStatus,
  adminDeliverCredentials,
  adminDashboard,
} from '../controllers/orderController.js';
import {
  adminListBanners,
  adminCreateBanner,
  adminUpdateBanner,
  adminDeleteBanner,
} from '../controllers/bannerController.js';
import { adminListPages, adminUpsertPage } from '../controllers/pageController.js';
import { adminListUsers } from '../controllers/userController.js';
import { seedDatabase } from '../controllers/seedController.js';

const router = express.Router();

// Auth
router.post(
  '/auth/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  adminLogin
);

// All routes below require admin JWT
router.use(adminMiddleware);

// Dashboard
router.get('/dashboard', adminDashboard);

// Categories
router.get('/categories', adminListCategories);
router.post('/categories', uploadSingle, adminCreateCategory);
router.put('/categories/:id', uploadSingle, adminUpdateCategory);
router.delete('/categories/:id', adminDeleteCategory);

// Products
router.get('/products', adminListProducts);
router.post('/products', uploadMultiple, adminCreateProduct);
router.put('/products/:id', uploadMultiple, adminUpdateProduct);
router.delete('/products/:id', adminDeleteProduct);

// Variants
router.post('/products/:productId/variants', adminCreateVariant);
router.put('/variants/:variantId', adminUpdateVariant);
router.delete('/variants/:variantId', adminDeleteVariant);

// Orders
router.get('/orders', adminGetOrders);
router.get('/orders/:id', adminGetOrderById);
router.patch('/orders/:id/status', adminUpdateStatus);
router.post('/orders/:id/deliver', adminDeliverCredentials);

// Banners
router.get('/banners', adminListBanners);
router.post('/banners', uploadSingle, adminCreateBanner);
router.put('/banners/:id', uploadSingle, adminUpdateBanner);
router.delete('/banners/:id', adminDeleteBanner);

// Pages
router.get('/pages', adminListPages);
router.put('/pages/:slug', adminUpsertPage);

// Users
router.get('/users', adminListUsers);

// Seed
router.post('/seed', seedDatabase);

export default router;
