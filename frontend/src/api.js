const API_BASE = '/api';

const LS_ACCESS = 'healthTrackerAccessToken';
const LS_REFRESH = 'healthTrackerRefreshToken';

let refreshInFlight = null;

function getAccessToken() {
  return localStorage.getItem(LS_ACCESS);
}

function getRefreshTokenValue() {
  return localStorage.getItem(LS_REFRESH);
}


function setAccessToken(token) {
  if (token) localStorage.setItem(LS_ACCESS, token);
}

function setRefreshToken(token) {
  if (token) localStorage.setItem(LS_REFRESH, token);
}

export function clearToken() {
  localStorage.removeItem(LS_ACCESS);
  localStorage.removeItem(LS_REFRESH);
}

export function getToken() {
  return getAccessToken();
}

export function getRefreshToken() {
  return getRefreshTokenValue();
}






// Backwards compat: old code only passed access token.

export function setToken(accessToken) {
  setAccessToken(accessToken);
}

// New helpers for auth refresh.
export function setTokens({ access_token, refresh_token } = {}) {
  if (access_token) setAccessToken(access_token);
  if (refresh_token) setRefreshToken(refresh_token);
}

export function getTokens() {
  return {
    access_token: getAccessToken(),
    refresh_token: getRefreshToken(),
  };
}


function isTokenExpiredError(err) {
  const msg = String(err?.message || err || '').toLowerCase();
  return msg.includes('invalid or expired token');
}

async function readResponseBody(response) {
  const contentType = response.headers.get('content-type') || '';
  return contentType.includes('application/json')
    ? await response.json()
    : await response.text();
}

async function refreshAccessToken() {
  if (refreshInFlight) return refreshInFlight;

  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('Missing refresh token');

  refreshInFlight = (async () => {
    // Backend already provides /refresh. Use it exactly.
    const res = await fetch(`${API_BASE}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const body = await readResponseBody(res);

    if (!res.ok) {
      const message = typeof body === 'object' ? body.detail || JSON.stringify(body) : body;
      throw new Error(message || `Refresh failed with status ${res.status}`);
    }

    // Expected shape from backend: { access_token: '...', refresh_token: '...' }
    setTokens(body);

    return body;

  })();

  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

async function apiFetchRaw(path, options) {
  const headers = { ...(options.headers || {}) };
  const accessToken = getAccessToken();

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const body = await readResponseBody(response);

  if (!response.ok) {
    const message = typeof body === 'object' ? body.detail || JSON.stringify(body) : body;
    const err = new Error(message || `Request failed with status ${response.status}`);
    err.status = response.status;
    err.body = body;
    throw err;
  }

  return body;
}

export async function apiFetch(path, options = {}) {
  const normalizedOptions = { ...options };

  // Mark request so we don't retry endlessly.
  const alreadyRetried = !!normalizedOptions._authRetried;

  // Prevent refresh loops in case someone directly calls /refresh.
  if (String(path).includes('/refresh') && alreadyRetried) {
    return apiFetchRaw(path, normalizedOptions);
  }


  try {
    return await apiFetchRaw(path, normalizedOptions);
  } catch (err) {
    const shouldAttemptRefresh =
      !alreadyRetried &&
      (err?.status === 401 || isTokenExpiredError(err));

    if (!shouldAttemptRefresh) throw err;

    // Refresh then retry once.
    try {
      await refreshAccessToken();

      return await apiFetchRaw(path, {
        ...normalizedOptions,
        _authRetried: true,
      });
    } catch (refreshErr) {
      clearToken();
      // Redirect to Login page
      window.location.replace('/login');
      throw refreshErr;
    }
  }
}

