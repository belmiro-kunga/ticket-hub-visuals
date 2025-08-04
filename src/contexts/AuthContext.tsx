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

// Mock users for demonstration
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@empresa.com',
    password: '123456',
    phone: '+244 923 456 789',
    department: 'Tecnologia da Informação',
    avatar: 'JS',
    role: 'user'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@empresa.com',
    password: '123456',
    phone: '+244 924 567 890',
    department: 'Recursos Humanos',
    avatar: 'MS',
    role: 'user'
  },
  {
    id: '3',
    name: 'Pedro Costa',
    email: 'pedro.costa@empresa.com',
    password: '123456',
    phone: '+244 925 678 901',
    department: 'Financeiro',
    avatar: 'PC',
    role: 'user'
  },
  {
    id: '4',
    name: 'Ana Ferreira',
    email: 'ana.ferreira@empresa.com',
    password: '123456',
    phone: '+244 926 789 012',
    department: 'Vendas',
    avatar: 'AF',
    role: 'user'
  }
];

// Mock admin users
const mockAdminUsers: (User & { password: string })[] = [
  {
    id: 'admin1',
    name: 'Administrador Sistema',
    email: 'admin@empresa.com',
    password: 'admin123',
    phone: '+244 900 000 000',
    department: 'Administração',
    avatar: 'AD',
    role: 'admin'
  },
  {
    id: 'admin2',
    name: 'Gerente Geral',
    email: 'gerente@empresa.com',
    password: 'gerente123',
    phone: '+244 900 000 001',
    department: 'Gerência',
    avatar: 'GG',
    role: 'admin'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('ticket-hub-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('ticket-hub-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('ticket-hub-user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundAdmin = mockAdminUsers.find(u => u.email === email && u.password === password);
    
    if (foundAdmin) {
      const { password: _, ...adminWithoutPassword } = foundAdmin;
      setUser(adminWithoutPassword);
      localStorage.setItem('ticket-hub-user', JSON.stringify(adminWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ticket-hub-user');
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
