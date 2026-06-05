export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export function authHeaders() {
  const token = localStorage.getItem('bb_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || 'Request failed');
    error.data = data;
    throw error;
  }
  return data;
}
