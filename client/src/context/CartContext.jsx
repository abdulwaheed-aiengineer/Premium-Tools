import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [localItems, setLocalItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pt_guest_cart') || '[]');
    } catch {
      return [];
    }
  });
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) return;
    try {
      setCartLoading(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch {
      // silent
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user, fetchCart]);

  const addToCart = async (productId, variantId, qty = 1, productData = null) => {
    if (user) {
      const data = await cartService.addItem(productId, variantId, qty);
      setCart(data);
      return data;
    } else {
      const items = [...localItems];
      const existingIndex = items.findIndex(
        (i) => i.productId === productId && i.variantId === variantId
      );
      if (existingIndex > -1) {
        items[existingIndex].qty += qty;
      } else {
        items.push({ productId, variantId, qty, productData });
      }
      setLocalItems(items);
      localStorage.setItem('pt_guest_cart', JSON.stringify(items));
      return items;
    }
  };

  const updateItem = async (itemId, qty) => {
    if (!user || !cart) return;
    const data = await cartService.updateItem(itemId, qty);
    setCart(data);
  };

  const removeItem = async (itemId) => {
    if (user && cart) {
      const data = await cartService.removeItem(itemId);
      setCart(data);
    } else {
      const items = localItems.filter((_, i) => i !== itemId);
      setLocalItems(items);
      localStorage.setItem('pt_guest_cart', JSON.stringify(items));
    }
  };

  const clearCart = async () => {
    if (user) {
      await cartService.clearCart();
      setCart(null);
    }
    setLocalItems([]);
    localStorage.removeItem('pt_guest_cart');
  };

  const cartItems = user ? (cart?.items || []) : localItems;
  const cartCount = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);
  const cartTotal = user
    ? cartItems.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0)
    : localItems.reduce((sum, item) => {
        const price = item.productData?.discountPrice || item.productData?.basePrice || 0;
        return sum + price * item.qty;
      }, 0);

  return (
    <CartContext.Provider value={{ cart, localItems, cartItems, cartCount, cartTotal, cartLoading, addToCart, updateItem, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
