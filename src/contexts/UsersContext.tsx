import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  department: string;
  joinDate: string;
  lastLogin?: string;
  ticketsAssigned?: number;
  ticketsResolved?: number;
  avatar?: string;
  defaultPriority?: 'baixa' | 'media' | 'alta' | 'urgente';
  permissions?: string[];
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  department: string;
  role: 'admin' | 'user';
  defaultPriority?: 'baixa' | 'media' | 'alta' | 'urgente';
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  department?: string;
  role?: 'admin' | 'user';
  status?: 'active' | 'inactive' | 'suspended';
  defaultPriority?: 'baixa' | 'media' | 'alta' | 'urgente';
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  admins: number;
  regular: number;
  newThisMonth: number;
}

interface UsersContextType {
  users: User[];
  stats: UserStats | null;
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  fetchUserStats: () => Promise<void>;
  createUser: (userData: CreateUserData) => Promise<boolean>;
  updateUser: (id: string, userData: UpdateUserData) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
  testAuthentication: () => Promise<boolean>;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};

// Mock data for development/testing
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Administrador Sistema',
    email: 'admin@empresa.com',
    phone: '+244 900 000 001',
    role: 'admin',
    status: 'active',
    department: 'Tecnologia da Informação',
    joinDate: '2024-01-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
    ticketsAssigned: 15,
    ticketsResolved: 12,
    avatar: '',
    defaultPriority: 'media'
  },
  {
    id: '2',
    name: 'Gerente Geral',
    email: 'gerente@empresa.com',
    phone: '+244 900 000 002',
    role: 'admin',
    status: 'active',
    department: 'Administração',
    joinDate: '2024-01-02T00:00:00Z',
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    ticketsAssigned: 8,
    ticketsResolved: 7,
    avatar: '',
    defaultPriority: 'alta'
  },
  {
    id: '3',
    name: 'João Silva',
    email: 'joao.silva@empresa.com',
    phone: '+244 900 000 003',
    role: 'user',
    status: 'active',
    department: 'Vendas',
    joinDate: '2024-01-15T00:00:00Z',
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    ticketsAssigned: 3,
    ticketsResolved: 2,
    avatar: '',
    defaultPriority: 'baixa'
  },
  {
    id: '4',
    name: 'Maria Santos',
    email: 'maria.santos@empresa.com',
    phone: '+244 900 000 004',
    role: 'user',
    status: 'active',
    department: 'Marketing',
    joinDate: '2024-01-20T00:00:00Z',
    lastLogin: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    ticketsAssigned: 5,
    ticketsResolved: 4,
    avatar: '',
    defaultPriority: 'media'
  }
];

const mockStats: UserStats = {
  total: 4,
  active: 4,
  inactive: 0,
  admins: 2,
  regular: 2,
  newThisMonth: 1
};

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// API Helper Functions
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('ticket-hub-token');
  
  console.log('🔍 API Call Debug:', {
    endpoint,
    baseUrl: API_BASE_URL,
    fullUrl: `${API_BASE_URL}${endpoint}`,
    hasToken: !!token,
    method: options.method || 'GET'
  });
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log('📡 Making API request to:', `${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    console.log('📥 Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    const data = await response.json();
    console.log('📄 Response data:', data);
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return data;
  } catch (error) {
    console.error('❌ API call error:', {
      error: error.message,
      endpoint,
      fullUrl: `${API_BASE_URL}${endpoint}`,
      stack: error.stack
    });
    throw error;
  }
};

// API Service Functions
const usersService = {
  async getUsers() {
    const response = await apiCall('/users');
    return response;
  },

  async getUserStats() {
    const response = await apiCall('/users/stats/overview');
    return response;
  },

  async createUser(userData: CreateUserData) {
    const response = await apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  },

  async updateUser(id: string, userData: UpdateUserData) {
    const response = await apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response;
  },

  async deleteUser(id: string) {
    const response = await apiCall(`/users/${id}`, {
      method: 'DELETE',
    });
    return response;
  }
};

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    if (!currentUser || currentUser.role !== 'admin') {
      console.log('🚫 User not admin, skipping fetchUsers:', {
        currentUser: currentUser?.email,
        role: currentUser?.role
      });
      return;
    }

    console.log('🔄 Starting fetchUsers...');
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await usersService.getUsers();
      console.log('✅ fetchUsers success:', response);
      if (response.success) {
        setUsers(response.users);
      } else {
        setError(response.message || 'Erro ao carregar usuários');
      }
    } catch (error: any) {
      console.error('❌ Error fetching users:', {
        message: error.message,
        stack: error.stack,
        currentUser: currentUser?.email
      });
      
      // Don't use mock data, show real error
      setError(`Erro ao conectar com o servidor: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserStats = async () => {
    if (!currentUser || currentUser.role !== 'admin') {
      console.log('🚫 User not admin, skipping fetchUserStats:', {
        currentUser: currentUser?.email,
        role: currentUser?.role
      });
      return;
    }

    console.log('🔄 Starting fetchUserStats...');
    try {
      const response = await usersService.getUserStats();
      console.log('✅ fetchUserStats success:', response);
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error: any) {
      console.error('❌ Error fetching user stats:', {
        message: error.message,
        stack: error.stack,
        currentUser: currentUser?.email
      });
      
      // Don't use mock stats, let it fail
      console.log('❌ Failed to fetch user stats, keeping current stats');
    }
  };

  const createUser = async (userData: CreateUserData): Promise<boolean> => {
    setError(null);
    
    try {
      const response = await usersService.createUser(userData);
      if (response.success) {
        // Add the new user to the list
        setUsers(prev => [response.user, ...prev]);
        // Refresh stats
        await fetchUserStats();
        return true;
      } else {
        setError(response.message || 'Erro ao criar usuário');
        return false;
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      setError(error.message || 'Erro ao conectar com o servidor');
      return false;
    }
  };

  const updateUser = async (id: string, userData: UpdateUserData): Promise<boolean> => {
    setError(null);
    
    try {
      const response = await usersService.updateUser(id, userData);
      if (response.success) {
        // Update the user in the list
        setUsers(prev => prev.map(user => 
          user.id === id ? { ...user, ...response.user } : user
        ));
        // Refresh stats
        await fetchUserStats();
        return true;
      } else {
        setError(response.message || 'Erro ao atualizar usuário');
        return false;
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      setError(error.message || 'Erro ao conectar com o servidor');
      return false;
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    setError(null);
    
    try {
      const response = await usersService.deleteUser(id);
      if (response.success) {
        // Remove the user from the list (or mark as inactive)
        setUsers(prev => prev.map(user => 
          user.id === id ? { ...user, status: 'inactive' as const } : user
        ));
        // Refresh stats
        await fetchUserStats();
        return true;
      } else {
        setError(response.message || 'Erro ao excluir usuário');
        return false;
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      setError(error.message || 'Erro ao conectar com o servidor');
      return false;
    }
  };

  const testAuthentication = async () => {
    const token = localStorage.getItem('ticket-hub-token');
    console.log('🔐 Testing authentication:', {
      hasToken: !!token,
      tokenLength: token?.length,
      currentUser: currentUser?.email,
      role: currentUser?.role
    });
    
    if (!token) {
      console.log('❌ No token found');
      return false;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      console.log('🔐 Auth verification result:', data);
      
      return data.success;
    } catch (error) {
      console.error('❌ Auth verification failed:', error);
      return false;
    }
  };

  const refreshData = async () => {
    console.log('🔄 refreshData called');
    
    // Test authentication first
    const isAuthenticated = await testAuthentication();
    if (!isAuthenticated) {
      console.log('❌ User not authenticated, skipping data refresh');
      return;
    }
    
    await Promise.all([fetchUsers(), fetchUserStats()]);
  };

  // Load users and stats when component mounts or user changes
  useEffect(() => {
    console.log('🔄 UsersContext useEffect triggered:', {
      currentUser: currentUser?.email,
      role: currentUser?.role,
      isAuthenticated: !!currentUser
    });
    
    if (currentUser && currentUser.role === 'admin') {
      console.log('✅ User is admin, refreshing data...');
      refreshData();
    } else {
      console.log('❌ User is not admin or not authenticated');
    }
  }, [currentUser]);

  const value = {
    users,
    stats,
    isLoading,
    error,
    fetchUsers,
    fetchUserStats,
    createUser,
    updateUser,
    deleteUser,
    refreshData,
    testAuthentication,
  };

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
}
