import express from 'express';
import { fetchCart, addItem, updateItem, removeItem, emptyCart } from '../controllers/cartController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', fetchCart);
router.post('/', addItem);
router.patch('/:itemId', updateItem);
router.delete('/clear', emptyCart);
router.delete('/:itemId', removeItem);

export default router;
