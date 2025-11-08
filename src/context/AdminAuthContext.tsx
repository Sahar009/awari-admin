import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import authService from '../services/auth';
import type { AdminUser } from '../services/auth';
import { setAuthToken } from '../lib/api';

interface AdminAuthContextValue {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'awari-admin-token';

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hydrate = useCallback(async () => {
    const storedToken = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    try {
      setAuthToken(storedToken);
      const profile = await authService.fetchProfile();
      if (profile.role !== 'admin') {
        throw new Error('Unauthorized');
      }
      setToken(storedToken);
      setUser(profile);
    } catch (err) {
      window.localStorage.removeItem(STORAGE_KEY);
      setAuthToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { token: authToken, user: profile } = await authService.login(email, password);
      if (profile.role !== 'admin') {
        throw new Error('You do not have administrator access.');
      }
      setAuthToken(authToken);
      window.localStorage.setItem(STORAGE_KEY, authToken);
      setToken(authToken);
      setUser(profile);
    } catch (err: any) {
      setUser(null);
      setToken(null);
      setAuthToken(null);
      window.localStorage.removeItem(STORAGE_KEY);
      setError(err?.response?.data?.message || err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
    setAuthToken(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      error,
      login,
      logout
    }),
    [user, token, isLoading, error, login, logout]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};


