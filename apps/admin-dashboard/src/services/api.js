import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    Authorization: 'Bearer REPLACE_ADMIN_TOKEN'
  }
});

export async function getStats() {
  const res = await api.get('/admin/stats');
  return res.data.data;
}
