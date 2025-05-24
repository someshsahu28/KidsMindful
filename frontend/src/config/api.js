const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-render-backend-url.onrender.com'  // Replace with your Render URL
  : 'http://localhost:3000';

export const getApiUrl = (endpoint) => `${API_URL}${endpoint}`;

export default {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}; 