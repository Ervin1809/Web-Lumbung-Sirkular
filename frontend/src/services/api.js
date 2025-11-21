import axios from 'axios';

// Base URL Backend (sesuaikan dengan server FastAPI)
const API_BASE_URL = 'http://127.0.0.1:8000';

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

// Waste API
export const wasteAPI = {
  getAll: (category = null) => {
    const url = category ? `/wastes/?category=${category}` : '/wastes/';
    return api.get(url);
  },
  getMyWastes: () => api.get('/wastes/me'),
  create: (wasteData) => api.post('/wastes/', wasteData),
};

// Transaction API
export const transactionAPI = {
  book: (wasteId, bookingData) => api.post(`/transactions/book/${wasteId}`, {
    waste_id: wasteId,
    ...bookingData
  }),
  complete: (transactionId) => api.patch(`/transactions/${transactionId}/complete`),
  getImpact: () => api.get('/transactions/impact/me'),
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