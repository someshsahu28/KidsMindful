const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://kidsmindful-backend.onrender.com/api'  // Update this with your actual Render backend URL
  : 'http://localhost:5000/api';

export const getApiUrl = (endpoint) => `${API_URL}${endpoint}`;

export const fetchWithAuth = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed');
  }

  return response.json();
};

export default {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
}; 