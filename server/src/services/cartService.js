import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import ProductVariant from '../models/ProductVariant.js';

export async function getCart(userId) {
  let cart = await Cart.findOne({ user: userId })
    .populate({ path: 'items.product', select: 'name slug images basePrice discountPrice isActive inStock' })
    .populate({ path: 'items.variant', select: 'label duration type price discountPrice isActive' });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
}

export async function addToCart(userId, { productId, variantId, qty }) {
  const product = await Product.findById(productId);
  if (!product || !product.isActive) throw new Error('Product not found or unavailable');

  let price = product.discountPrice > 0 ? product.discountPrice : product.basePrice;

  if (variantId) {
    const variant = await ProductVariant.findById(variantId);
    if (!variant || !variant.isActive) throw new Error('Variant not found or unavailable');
    price = variant.discountPrice > 0 ? variant.discountPrice : variant.price;
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  const existingIndex = cart.items.findIndex(
    (item) =>
      item.product.toString() === productId &&
      (variantId ? item.variant?.toString() === variantId : !item.variant)
  );

  if (existingIndex > -1) {
    cart.items[existingIndex].qty += Number(qty) || 1;
    cart.items[existingIndex].price = price;
  } else {
    cart.items.push({ product: productId, variant: variantId || null, qty: Number(qty) || 1, price });
  }

  await cart.save();
  return getCart(userId);
}

export async function updateCartItem(userId, itemId, qty) {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error('Cart not found');

  const item = cart.items.id(itemId);
  if (!item) throw new Error('Cart item not found');

  if (qty <= 0) {
    cart.items.pull(itemId);
  } else {
    item.qty = qty;
  }

  await cart.save();
  return getCart(userId);
}

export async function removeCartItem(userId, itemId) {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error('Cart not found');

  cart.items.pull(itemId);
  await cart.save();
  return getCart(userId);
}

export async function clearCart(userId) {
  await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
  return { success: true };
}
