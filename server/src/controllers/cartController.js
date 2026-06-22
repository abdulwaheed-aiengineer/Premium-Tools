import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../services/cartService.js';

export async function fetchCart(req, res, next) {
  try {
    const cart = await getCart(req.user._id);
    res.json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
}

export async function addItem(req, res, next) {
  try {
    const { productId, variantId, qty } = req.body;
    if (!productId) return res.status(400).json({ success: false, error: 'productId is required', statusCode: 400 });
    const cart = await addToCart(req.user._id, { productId, variantId, qty: qty || 1 });
    res.json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
}

export async function updateItem(req, res, next) {
  try {
    const { qty } = req.body;
    const cart = await updateCartItem(req.user._id, req.params.itemId, Number(qty));
    res.json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
}

export async function removeItem(req, res, next) {
  try {
    const cart = await removeCartItem(req.user._id, req.params.itemId);
    res.json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
}

export async function emptyCart(req, res, next) {
  try {
    const result = await clearCart(req.user._id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
