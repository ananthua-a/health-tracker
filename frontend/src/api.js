const API_BASE = '/api';

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('healthTrackerToken');
  const headers = options.headers || {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') 
    ? await response.json() 
    : await response.text();

  if (!response.ok) {
    const message = typeof body === 'object' ? body.detail || JSON.stringify(body) : body;
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return body;
}

export function setToken(token) {
  localStorage.setItem('healthTrackerToken', token);
}

export function getToken() {
  return localStorage.getItem('healthTrackerToken');
}

export function clearToken() {
  localStorage.removeItem('healthTrackerToken');
}
