import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('school_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('school_token');
      localStorage.removeItem('school_data');
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000/uploads';

// New uploads are full Cloudinary URLs (start with http). Any older local files
// (from before the Cloudinary migration) fall back to the old /uploads/<folder>/ path.
export const resolveFileUrl = (value, folder) => {
  if (!value) return '';
  if (value.startsWith('http')) return value;
  return `${UPLOADS_URL}/${folder}/${value}`;
};

export default api;
