import api from './axiosInstance';

export const orderService = {
  async createOrder(orderData) {
    const res = await api.post('/orders', orderData);
    return res.data.data;
  },

  async trackOrder(orderNumber) {
    const res = await api.get(`/orders/track/${orderNumber}`);
    return res.data.data;
  },

  async getMyOrders() {
    const res = await api.get('/orders/my');
    return res.data.data;
  },

  async getOrderById(id) {
    const res = await api.get(`/orders/${id}`);
    return res.data.data;
  },

  async submitPayment(orderId, transactionId, screenshotFile) {
    const formData = new FormData();
    formData.append('orderId', orderId);
    if (transactionId) formData.append('transactionId', transactionId);
    if (screenshotFile) formData.append('screenshot', screenshotFile);

    const res = await api.post('/orders/payment/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
};
