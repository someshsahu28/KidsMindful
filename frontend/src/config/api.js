const API_URL = import.meta.env.VITE_API_URL || 
  (process.env.NODE_ENV === 'production'
    ? 'https://kidsmindful.onrender.com/api'  // Updated to match the actual Render URL
    : 'http://localhost:3000/api');

export const getApiUrl = (endpoint) => {
  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

export default {k;cmlsdc;
  mdclsdnlcs
  ml;cmsc
  mln s
  m; ,x,' '
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Enable sending credentials with requests
}; 