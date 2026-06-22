import { adminApi } from './axiosInstance';

export const adminAuthService = {
  async login(email, password) {
    const res = await adminApi.post('/admin/auth/login', { email, password });
    return res.data.data;
  },
};

export const adminProductService = {
  async getProducts(params = {}) {
    const res = await adminApi.get('/admin/products', { params });
    return res.data.data;
  },

  async createProduct(formData) {
    const res = await adminApi.post('/admin/products', formData);
    return res.data.data;
  },

  async updateProduct(id, formData) {
    const res = await adminApi.put(`/admin/products/${id}`, formData);
    return res.data.data;
  },

  async deleteProduct(id) {
    const res = await adminApi.delete(`/admin/products/${id}`);
    return res.data.data;
  },

  async createVariant(productId, data) {
    const res = await adminApi.post(`/admin/products/${productId}/variants`, data);
    return res.data.data;
  },

  async updateVariant(variantId, data) {
    const res = await adminApi.put(`/admin/variants/${variantId}`, data);
    return res.data.data;
  },

  async deleteVariant(variantId) {
    const res = await adminApi.delete(`/admin/variants/${variantId}`);
    return res.data.data;
  },
};

export const adminCategoryService = {
  async getCategories() {
    const res = await adminApi.get('/admin/categories');
    return res.data.data;
  },

  async createCategory(formData) {
    const res = await adminApi.post('/admin/categories', formData);
    return res.data.data;
  },

  async updateCategory(id, formData) {
    const res = await adminApi.put(`/admin/categories/${id}`, formData);
    return res.data.data;
  },

  async deleteCategory(id) {
    const res = await adminApi.delete(`/admin/categories/${id}`);
    return res.data.data;
  },
};

export const adminOrderService = {
  async getOrders(params = {}) {
    const res = await adminApi.get('/admin/orders', { params });
    return res.data.data;
  },

  async getOrderById(id) {
    const res = await adminApi.get(`/admin/orders/${id}`);
    return res.data.data;
  },

  async updateStatus(id, status) {
    const res = await adminApi.patch(`/admin/orders/${id}/status`, { status });
    return res.data.data;
  },

  async deliverCredentials(id, credentials, productId) {
    const res = await adminApi.post(`/admin/orders/${id}/deliver`, { credentials, productId });
    return res.data.data;
  },

  async getDashboard() {
    const res = await adminApi.get('/admin/dashboard');
    return res.data.data;
  },
};

export const adminBannerService = {
  async getBanners() {
    const res = await adminApi.get('/admin/banners');
    return res.data.data;
  },

  async createBanner(formData) {
    const res = await adminApi.post('/admin/banners', formData);
    return res.data.data;
  },

  async updateBanner(id, formData) {
    const res = await adminApi.put(`/admin/banners/${id}`, formData);
    return res.data.data;
  },

  async deleteBanner(id) {
    const res = await adminApi.delete(`/admin/banners/${id}`);
    return res.data.data;
  },
};

export const adminPageService = {
  async getPages() {
    const res = await adminApi.get('/admin/pages');
    return res.data.data;
  },

  async upsertPage(slug, title, content) {
    const res = await adminApi.put(`/admin/pages/${slug}`, { title, content });
    return res.data.data;
  },
};

export const adminUserService = {
  async getUsers(params = {}) {
    const res = await adminApi.get('/admin/users', { params });
    return res.data.data;
  },
};
