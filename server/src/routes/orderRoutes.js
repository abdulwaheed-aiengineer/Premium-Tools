import express from 'express';
import { placeOrder, trackOrder, myOrders, orderDetail, submitOrderPayment } from '../controllers/orderController.js';
import { authMiddleware, optionalAuth } from '../middleware/authMiddleware.js';
import { uploadScreenshot } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', optionalAuth, placeOrder);
router.post('/payment/submit', optionalAuth, uploadScreenshot, submitOrderPayment);
router.get('/track/:orderNumber', trackOrder);
router.get('/my', authMiddleware, myOrders);
router.get('/:id', authMiddleware, orderDetail);

export default router;
