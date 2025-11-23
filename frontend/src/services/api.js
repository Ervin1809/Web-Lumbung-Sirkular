import axios from 'axios';

// Base URL Backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => {
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getMe: () => api.get('/auth/me'),
};

// Waste API - IMPROVED with CRUD
export const wasteAPI = {
  getAll: (category = null) => {
    const url = category ? `/wastes/?category=${category}` : '/wastes/';
    return api.get(url);
  },
  getMyWastes: () => api.get('/wastes/me'),
  getById: (wasteId) => api.get(`/wastes/${wasteId}`),
  create: (wasteData) => api.post('/wastes/', wasteData),
  // 🔥 NEW: Update waste
  update: (wasteId, wasteData) => api.put(`/wastes/${wasteId}`, wasteData),
  // 🔥 NEW: Delete waste
  delete: (wasteId) => api.delete(`/wastes/${wasteId}`),
  // 🔥 NEW: Get price recommendation
  getPriceRecommendation: (category, weight) => 
    api.get(`/wastes/recommend/price?category=${category}&weight=${weight}`),
};

// Transaction API - IMPROVED with new endpoints
export const transactionAPI = {
  // Book waste
  book: (wasteId, bookingData) => api.post(`/transactions/book/${wasteId}`, {
    waste_id: wasteId,
    pickup_date: bookingData.pickupDate,
    pickup_time: bookingData.pickupTime,
    estimated_quantity: parseFloat(bookingData.estimatedQuantity),
    transport_method: bookingData.transportMethod,
    contact_person: bookingData.contactPerson,
    contact_phone: bookingData.contactPhone,
    pickup_address: bookingData.pickupAddress,
    notes: bookingData.notes,
    // Delivery location coordinates (for delivery method)
    delivery_latitude: bookingData.deliveryLatitude || null,
    delivery_longitude: bookingData.deliveryLongitude || null
  }),
  
  // Payment endpoints
  getPaymentDetails: (transactionId) => api.get(`/transactions/${transactionId}/payment-details`),
  submitPayment: (transactionId, paymentData) => api.post(`/transactions/${transactionId}/payment`, paymentData),
  verifyPayment: (transactionId, action) => api.patch(`/transactions/${transactionId}/verify-payment?action=${action}`),

  // Existing endpoints
  claimReceived: (transactionId) => 
    api.patch(`/transactions/${transactionId}/claim-received`),
  confirmHandover: (transactionId) => 
    api.patch(`/transactions/${transactionId}/confirm-handover`),
  cancel: (transactionId) => 
    api.delete(`/transactions/${transactionId}/cancel`),
  getMyBookings: () => api.get('/transactions/my-bookings'),
  getImpact: () => api.get('/transactions/impact/me'),
  getChartData: () => api.get('/transactions/impact/chart-data'),
  getByWasteId: (wasteId) => api.get(`/transactions/waste/${wasteId}`),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;