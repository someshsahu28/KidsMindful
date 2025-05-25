const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const handleApiResponse = (response) => {
  // Check for new token in response headers
  const newToken = response.headers.get('X-New-Token');
  if (newToken) {
    localStorage.setItem('token', newToken);
    // Dispatch an event to notify the app of token refresh
    window.dispatchEvent(new CustomEvent('tokenRefresh', { detail: { token: newToken } }));
  }
  return response;
};

export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token available');
  }

  const defaultHeaders = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    },
    mode: 'cors',
    credentials: 'include'
  });

  // Handle token refresh
  handleApiResponse(response);

  // Handle error responses
  if (!response.ok) {
    const error = await response.json();
    if (error.code === 'TOKEN_EXPIRED' || error.code === 'TOKEN_INVALID') {
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    }
    throw new Error(error.message || 'API request failed');
  }

  return response;
}; 