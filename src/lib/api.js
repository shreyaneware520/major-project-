const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const TOKEN_KEY = 'smart-farming-token';
const USER_KEY = 'smart-farming-user';

async function request(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || 'The request could not be completed.');
  }
  return body;
}

function saveSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export const authApi = {
  async signup(details) {
    const session = await request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(details),
    });
    saveSession(session);
    return session;
  },
  async login(details) {
    const session = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(details),
    });
    saveSession(session);
    return session;
  },
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export const zonesApi = {
  list() {
    return request('/zones');
  },
  create(zone) {
    return request('/zones', { method: 'POST', body: JSON.stringify(zone) });
  },
};
