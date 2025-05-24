const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://kidsmindful-backend.onrender.com'  // Update this with your actual Render backend URL
  : 'http://localhost:5000';

export const getApiUrl = (endpoint) => `${API_URL}${endpoint}`;

export default {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
}; 