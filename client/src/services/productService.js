import api from './axiosInstance';

export const productService = {
  async getProducts(params = {}) {
    const res = await api.get('/products', { params });
    return res.data.data;
  },

  async getProductBySlug(slug) {
    const res = await api.get(`/products/${slug}`);
    return res.data.data;
  },

  async getRelatedProducts(productId, categoryId) {
    const res = await api.get('/products/related', { params: { productId, categoryId } });
    return res.data.data;
  },

  async getCategories() {
    const res = await api.get('/categories');
    return res.data.data;
  },

  async getCategoryProducts(slug, params = {}) {
    const res = await api.get(`/categories/${slug}/products`, { params });
    return res.data.data;
  },

  async getBanners() {
    const res = await api.get('/banners');
    return res.data.data;
  },

  async getPage(slug) {
    const res = await api.get(`/pages/${slug}`);
    return res.data.data;
  },

  async getFeaturedProducts() {
    const res = await api.get('/products/featured');
    return res.data.data;
  },

  async getTopDeals() {
    const res = await api.get('/products/top-deals');
    return res.data.data;
  },

  async getActiveCategories() {
    const res = await api.get('/categories/active');
    return res.data.data;
  },
};
