const API_URL = import.meta.env.VITE_API_URL || 
  (process.env.NODE_ENV === 'production'
    ? 'https://kidsmindful-backend.onrender.com/api'  // Update this with your actual Render backend URL
    : 'http://localhost:3000/api');

export const getApiUrl = (endpoint) => {
  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

export default {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
}; 