import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleLogin: (data) => api.post('/auth/google-login', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Product Services
export const productService = {
  getAllProducts: (params) => api.get('/products', { params }),
  getCarousel: () => api.get('/products/carousel'),
  getProductById: (id) => api.get(`/products/${id}`),
  getRelatedProducts: (id) => api.get(`/products/${id}/related`),
  createProduct: (data) => api.post('/products', data),
  postReview: (id, data) => api.post(`/products/${id}/reviews`, data),
};

// Contact Services
export const contactService = {
  sendContact: (data) => api.post('/contact', data),
};

// Wishlist Services
export const wishlistService = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post('/wishlist/add', { productId }),
  removeFromWishlist: (productId) => api.post('/wishlist/remove', { productId }),
};

// Cart Services
export const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart/add', data),
  updateCartItem: (data) => api.post('/cart/update', data),
  removeFromCart: (data) => api.post('/cart/remove', data),
  clearCart: () => api.post('/cart/clear'),
};

// Order Services
export const orderService = {
  createOrder: (data) => api.post('/orders/create', data),
  createRazorpayOrder: (data) => api.post('/orders/create-razorpay-order', data),
  verifyPayment: (data) => api.post('/orders/verify-payment', data),
  getUserOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
};

// Newsletter Services
export const newsletterService = {
  subscribe: (email) => api.post('/newsletter/subscribe', { email }),
  getSubscriptions: () => api.get('/newsletter'),
  sendNewsletter: (data) => api.post('/newsletter/send', data),
  deleteSubscription: (id) => api.delete(`/newsletter/${id}`),
};

// Admin Services
export const adminService = {
    getUsers: () => api.get('/admin/users'),
    getUserById: (id) => api.get(`/admin/users/${id}`),
    updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
    getProducts: () => api.get('/admin/products'),
    createProduct: (data) => api.post('/admin/products', data),
    updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
    deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  
    getStats: () => api.get('/admin/stats'),
    getContacts: () => api.get('/admin/contacts'),
    deleteContact: (id) => api.delete(`/admin/contacts/${id}`),
    getReviews: () => api.get('/admin/reviews'),
    deleteReview: (productId, reviewId) => api.delete(`/admin/reviews/${productId}/${reviewId}`),
    // Carousel admin
    getCarousel: () => api.get('/admin/carousel'),
    createCarouselItem: (data) => api.post('/admin/carousel', data),
    updateCarouselItem: (id, data) => api.put(`/admin/carousel/${id}`, data),
    deleteCarouselItem: (id) => api.delete(`/admin/carousel/${id}`),
  };

export default api;
