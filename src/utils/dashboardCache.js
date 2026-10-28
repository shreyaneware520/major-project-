/**
 * Dashboard High-Performance In-Memory & Session Cache
 * Provides sub-10ms synchronous retrieval for Telemetry and User Session state.
 */

const MEMORY_CACHE = {
  telemetry: null,
  history: null,
  userProfile: null,
  lastUpdated: null,
};

const TELEMETRY_CACHE_KEY = 'krishi_telemetry_cache';
const HISTORY_CACHE_KEY = 'krishi_history_cache';
const USER_CACHE_KEY = 'krishi_user_cache';

export const getCachedTelemetry = () => {
  // 1. Fast Memory Read
  if (MEMORY_CACHE.telemetry) {
    return {
      telemetry: MEMORY_CACHE.telemetry,
      history: MEMORY_CACHE.history || [],
      isStale: Date.now() - (MEMORY_CACHE.lastUpdated || 0) > 30000,
    };
  }

  // 2. SessionStorage Fallback
  try {
    const rawTelemetry = sessionStorage.getItem(TELEMETRY_CACHE_KEY);
    const rawHistory = sessionStorage.getItem(HISTORY_CACHE_KEY);

    if (rawTelemetry) {
      const parsedTelemetry = JSON.parse(rawTelemetry);
      const parsedHistory = rawHistory ? JSON.parse(rawHistory) : [parsedTelemetry];

      MEMORY_CACHE.telemetry = parsedTelemetry;
      MEMORY_CACHE.history = parsedHistory;
      MEMORY_CACHE.lastUpdated = Date.now();

      return {
        telemetry: parsedTelemetry,
        history: parsedHistory,
        isStale: true,
      };
    }
  } catch (e) {
    console.warn('Cache read error:', e);
  }

  return { telemetry: null, history: null, isStale: true };
};

export const setCachedTelemetry = (telemetry, history = []) => {
  if (!telemetry) return;

  MEMORY_CACHE.telemetry = telemetry;
  MEMORY_CACHE.history = history;
  MEMORY_CACHE.lastUpdated = Date.now();

  try {
    sessionStorage.setItem(TELEMETRY_CACHE_KEY, JSON.stringify(telemetry));
    if (history && history.length > 0) {
      sessionStorage.setItem(HISTORY_CACHE_KEY, JSON.stringify(history));
    }
  } catch (e) {
    console.warn('Cache write error:', e);
  }
};

export const getCachedUser = () => {
  if (MEMORY_CACHE.userProfile) {
    return MEMORY_CACHE.userProfile;
  }
  try {
    const rawUser = sessionStorage.getItem(USER_CACHE_KEY);
    if (rawUser) {
      const user = JSON.parse(rawUser);
      MEMORY_CACHE.userProfile = user;
      return user;
    }
  } catch {
    // Ignore storage quota or access errors
  }
  return null;
};

export const setCachedUser = (user) => {
  MEMORY_CACHE.userProfile = user;
  try {
    if (user) {
      sessionStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(USER_CACHE_KEY);
    }
  } catch {
    // Ignore storage quota or access errors
  }
};
