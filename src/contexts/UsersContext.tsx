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
  phone?: string;
  department?: string;
  role?: 'admin' | 'user';
  status?: 'active' | 'inactive';
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
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};

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
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await usersService.getUsers();
      if (response.success) {
        setUsers(response.users);
      } else {
        setError(response.message || 'Erro ao carregar usuários');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Erro ao conectar com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserStats = async () => {
    if (!currentUser || currentUser.role !== 'admin') {
      return;
    }

    try {
      const response = await usersService.getUserStats();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
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

  const refreshData = async () => {
    await Promise.all([fetchUsers(), fetchUserStats()]);
  };

  // Load users and stats when component mounts or user changes
  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      refreshData();
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
  };

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
}
