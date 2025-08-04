import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  avatar?: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// API Helper Functions
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('ticket-hub-token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erro na requisição');
    }
    
    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// API Service Functions
const authService = {
  async loginUser(email: string, password: string) {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response;
  },

  async loginAdmin(email: string, password: string) {
    const response = await apiCall('/auth/login-admin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response;
  },

  async verifyToken() {
    const response = await apiCall('/auth/verify', {
      method: 'POST',
    });
    return response;
  },

  async logout() {
    const response = await apiCall('/auth/logout', {
      method: 'POST',
    });
    return response;
  },

  async getCurrentUser() {
    const response = await apiCall('/auth/me');
    return response;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (verify token)
    const initializeAuth = async () => {
      const token = localStorage.getItem('ticket-hub-token');
      const savedUser = localStorage.getItem('ticket-hub-user');
      
      if (token && savedUser) {
        try {
          // Verify token with backend
          const response = await authService.verifyToken();
          if (response.success) {
            setUser(response.user);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('ticket-hub-token');
            localStorage.removeItem('ticket-hub-user');
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('ticket-hub-token');
          localStorage.removeItem('ticket-hub-user');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await authService.loginUser(email, password);
      
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('ticket-hub-token', response.token);
        localStorage.setItem('ticket-hub-user', JSON.stringify(response.user));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await authService.loginAdmin(email, password);
      
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('ticket-hub-token', response.token);
        localStorage.setItem('ticket-hub-user', JSON.stringify(response.user));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Admin login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if backend call fails
    } finally {
      // Clear local storage and state
      setUser(null);
      localStorage.removeItem('ticket-hub-token');
      localStorage.removeItem('ticket-hub-user');
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    loginAdmin,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
