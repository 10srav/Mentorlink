// API service for connecting frontend to backend
const API_BASE_URL = import.meta?.env?.VITE_API_URL || '/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  const response = await fetch(url, config);

  let data;
  try {
    data = await response.json();
  } catch (_) {
    data = null;
  }

  if (!response.ok) {
    const validationErrors = data?.errors?.map?.((e) => e.msg).join(', ');
    const message = validationErrors || data?.message || `API request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data;
};

// User API functions
export const userAPI = {
  signup: (userData) => apiRequest('/users/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  verifyOTP: (data) => apiRequest('/users/verify-otp', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  login: (credentials) => apiRequest('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  sendLoginOTP: (data) => apiRequest('/users/send-login-otp', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  loginWithOTP: (data) => apiRequest('/users/login-otp', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Mentor API functions
export const mentorAPI = {
  submitForm: (formData) => apiRequest('/mentors', {
    method: 'POST',
    body: JSON.stringify(formData),
  }),
};

// Student API functions
export const studentAPI = {
  submitForm: (formData) => apiRequest('/students', {
    method: 'POST',
    body: JSON.stringify(formData),
  }),
  
  getProfile: () => apiRequest('/students/profile', {
    method: 'GET',
  }),
  
  updateProfileImage: (imageUrl) => apiRequest('/students/profile-image', {
    method: 'PUT',
    body: JSON.stringify({ profileImage: imageUrl }),
  }),
  
  uploadImage: (formData) => {
    const token = getAuthToken();
    return fetch(`${API_BASE_URL}/students/upload-image`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    }).then(response => {
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      return response.json();
    });
  },
};

// Organizer API functions
export const organizerAPI = {
  submitForm: (formData) => apiRequest('/organizers', {
    method: 'POST',
    body: JSON.stringify(formData),
  }),
};