import api from './axiosInstance';

export const cartService = {
  async getCart() {
    const res = await api.get('/cart');
    return res.data.data;
  },

  async addItem(productId, variantId, qty = 1) {
    const res = await api.post('/cart', { productId, variantId, qty });
    return res.data.data;
  },

  async updateItem(itemId, qty) {
    const res = await api.patch(`/cart/${itemId}`, { qty });
    return res.data.data;
  },

  async removeItem(itemId) {
    const res = await api.delete(`/cart/${itemId}`);
    return res.data.data;
  },

  async clearCart() {
    const res = await api.delete('/cart/clear');
    return res.data.data;
  },
};
