import config from './config.js';

const TOKEN_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

const getProfile = () => {
    let profile = {
        price: 1,
        client_id: 0,
        is_guest: true,
    };
    try {
        const perfil = JSON.parse(localStorage.getItem('profile'));
        if (!perfil) return profile;
        return perfil;
    } catch(error) {
        return profile;
    }
};

const isSessionValid = (profile) =>
    !!(profile && profile.client_id && profile.client_id !== 0);

const getTokens = () => ({
    access: localStorage.getItem(TOKEN_KEY),
    refresh: localStorage.getItem(REFRESH_KEY),
});

const setTokens = ({ access, refresh }) => {
    if (access) localStorage.setItem(TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
};

const clearTokens = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
};

const logout = () => {
    localStorage.removeItem('profile');
    clearTokens();
};

const initSession = async (apiUrl) => {
    try {
        const existing = localStorage.getItem('profile');
        if (existing) {
            const parsed = JSON.parse(existing);
            if (parsed && parsed.client_id && parsed.client_id !== 0) return parsed;
        }
        // No hay sesion valida, crear cliente invitado en el backend
        const body = {};
        // Si habia un client_id de invitado guardado, intentar recuperarlo
        if (existing) {
            try {
                const parsed = JSON.parse(existing);
                if (parsed && parsed.is_guest && parsed.client_id) {
                    body.client_id = parsed.client_id;
                }
            } catch(e) {}
        }
        const res = await fetch(`${apiUrl}/clients/guest-session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!data.error && data.data.client_id) {
            const profile = data.data;
            localStorage.setItem('profile', JSON.stringify(profile));
            return profile;
        }
    } catch(error) {
        console.error('Error iniciando sesion:', error);
    }
    return getProfile();
};

// Prevents multiple simultaneous refresh requests
let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshComplete = (newToken) => {
    refreshSubscribers.forEach(cb => cb(newToken));
    refreshSubscribers = [];
};

/**
 * Centralized fetch wrapper that:
 * - Attaches Authorization: Bearer <token> for authenticated (non-guest) users
 * - On 401: attempts token refresh, retries original request once
 * - On refresh failure: logs out and redirects to /login
 */
const apiFetch = async (url, options = {}) => {
    const { access } = getTokens();
    const profile = getProfile();
    const isGuest = profile.is_guest === true || !access;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (!isGuest && access) {
        headers['Authorization'] = `Bearer ${access}`;
    }

    let response = await fetch(url, { ...options, headers });

    // If 401 and we have a refresh token, attempt refresh once
    if (response.status === 401 && !isGuest && getTokens().refresh) {
        if (!isRefreshing) {
            isRefreshing = true;
            try {
                const refreshRes = await fetch(`${config.API_URL}/clients/token/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh: getTokens().refresh }),
                });
                if (refreshRes.ok) {
                    const refreshData = await refreshRes.json();
                    setTokens({ access: refreshData.access });
                    onRefreshComplete(refreshData.access);
                } else {
                    logout();
                    window.location.href = '/#/login';
                    return response;
                }
            } finally {
                isRefreshing = false;
            }
        }

        // Wait for the in-progress refresh then retry
        const newToken = await new Promise(resolve => refreshSubscribers.push(resolve));
        headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url, { ...options, headers });
    }

    return response;
};

const utils = { getProfile, isSessionValid, initSession, logout, apiFetch, getTokens, setTokens };

export { getProfile, isSessionValid, initSession, logout, apiFetch, getTokens, setTokens };
export default utils;
