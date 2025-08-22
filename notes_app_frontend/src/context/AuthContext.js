import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * AuthContext
 * React context to provide authentication state and actions (login/logout) to the app.
 * Persists user details to localStorage to keep sessions across reloads.
 */
export const AuthContext = createContext({
  user: null,
  login: async (_username, _password) => {},
  logout: () => {},
  loading: false,
  error: null,
});

/**
 * PUBLIC_INTERFACE
 * AuthProvider
 * Wrap your app with this provider to enable authentication state via context.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load persisted user on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('notesapp:user');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.username) setUser(parsed);
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  // Persist user changes
  useEffect(() => {
    try {
      if (user) localStorage.setItem('notesapp:user', JSON.stringify(user));
      else localStorage.removeItem('notesapp:user');
    } catch {
      // ignore storage errors
    }
  }, [user]);

  // PUBLIC_INTERFACE
  const login = useCallback(async (username, password) => {
    /**
     * This is a basic auth simulation: accept any non-empty username/password
     * and generate a fake token. Replace with real backend auth if available.
     */
    setError(null);
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 300)); // small delay to simulate network
      if (!username?.trim() || !password?.trim()) {
        throw new Error('Please enter both username and password.');
      }
      const fakeUser = {
        username: username.trim(),
        // In a real app, token comes from server.
        token: `fake-token-${btoa(username + ':' + Date.now())}`,
        displayName: username.trim(),
        loggedInAt: new Date().toISOString(),
      };
      setUser(fakeUser);
      return fakeUser;
    } catch (e) {
      setError(e.message || 'Login failed');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  // PUBLIC_INTERFACE
  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout, loading, error }), [user, login, logout, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
