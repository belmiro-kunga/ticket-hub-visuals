import { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface TicketStatus {
  id: string;
  label: string;
  color: string;
  description: string;
  timestamp: string;
}

export interface UserTicket {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  urgency: string;
  affectedUsers: string;
  businessImpact?: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  currentStatus: string;
  statusHistory: TicketStatus[];
  assignedTo?: string;
  estimatedResolution?: string;
}

interface TicketsContextType {
  userTickets: UserTicket[];
  createTicket: (ticketData: Omit<UserTicket, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'statusHistory' | 'currentStatus'>) => string;
  getTicketById: (id: string) => UserTicket | undefined;
  updateTicketStatus: (ticketId: string, newStatus: string, description: string) => void;
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

// Mock ticket data
const mockTickets: UserTicket[] = [
  {
    id: 'TKT-001',
    subject: 'Problema de acesso ao sistema',
    description: 'Não consigo fazer login no sistema desde ontem. Aparece erro "Credenciais inválidas" mesmo com senha correta.',
    category: 'account',
    priority: 'high',
    urgency: 'asap',
    affectedUsers: 'just-me',
    businessImpact: 'Não consigo acessar relatórios importantes para reunião de hoje.',
    attachments: ['screenshot-erro.png'],
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    userId: '1',
    currentStatus: 'in-progress',
    assignedTo: 'Suporte Técnico - João',
    estimatedResolution: '2024-01-16T17:00:00Z',
    statusHistory: [
      {
        id: '1',
        label: 'Ticket Criado',
        color: 'bg-blue-100 text-blue-800',
        description: 'Solicitação de suporte criada pelo usuário',
        timestamp: '2024-01-15T09:00:00Z'
      },
      {
        id: '2',
        label: 'Em Análise',
        color: 'bg-yellow-100 text-yellow-800',
        description: 'Ticket atribuído ao suporte técnico para análise inicial',
        timestamp: '2024-01-15T10:15:00Z'
      },
      {
        id: '3',
        label: 'Em Andamento',
        color: 'bg-orange-100 text-orange-800',
        description: 'Equipe técnica iniciou investigação do problema de acesso',
        timestamp: '2024-01-15T14:30:00Z'
      }
    ]
  },
  {
    id: 'TKT-002',
    subject: 'Solicitação de nova funcionalidade',
    description: 'Gostaria de solicitar a implementação de relatórios personalizados no dashboard.',
    category: 'feature',
    priority: 'medium',
    urgency: 'soon',
    affectedUsers: 'some',
    businessImpact: 'Melhoraria significativamente nossa análise de dados.',
    attachments: ['mockup-relatorio.pdf'],
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
    userId: '1',
    currentStatus: 'resolved',
    assignedTo: 'Desenvolvimento - Maria',
    statusHistory: [
      {
        id: '1',
        label: 'Ticket Criado',
        color: 'bg-blue-100 text-blue-800',
        description: 'Solicitação de nova funcionalidade registrada',
        timestamp: '2024-01-10T14:20:00Z'
      },
      {
        id: '2',
        label: 'Em Análise',
        color: 'bg-yellow-100 text-yellow-800',
        description: 'Análise de viabilidade técnica iniciada',
        timestamp: '2024-01-10T16:30:00Z'
      },
      {
        id: '3',
        label: 'Aprovado',
        color: 'bg-green-100 text-green-800',
        description: 'Funcionalidade aprovada para desenvolvimento',
        timestamp: '2024-01-11T09:00:00Z'
      },
      {
        id: '4',
        label: 'Em Desenvolvimento',
        color: 'bg-purple-100 text-purple-800',
        description: 'Desenvolvimento da funcionalidade iniciado',
        timestamp: '2024-01-11T14:00:00Z'
      },
      {
        id: '5',
        label: 'Resolvido',
        color: 'bg-green-100 text-green-800',
        description: 'Funcionalidade implementada e disponível no sistema',
        timestamp: '2024-01-12T16:45:00Z'
      }
    ]
  }
];

export function TicketsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<UserTicket[]>(mockTickets);

  const userTickets = tickets.filter(ticket => ticket.userId === user?.id);

  const createTicket = (ticketData: Omit<UserTicket, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'statusHistory' | 'currentStatus'>): string => {
    if (!user) throw new Error('User must be authenticated to create tickets');

    const ticketId = `TKT-${String(tickets.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const newTicket: UserTicket = {
      ...ticketData,
      id: ticketId,
      createdAt: now,
      updatedAt: now,
      userId: user.id,
      currentStatus: 'open',
      statusHistory: [
        {
          id: '1',
          label: 'Ticket Criado',
          color: 'bg-blue-100 text-blue-800',
          description: 'Solicitação de suporte criada pelo usuário',
          timestamp: now
        }
      ]
    };

    setTickets(prev => [...prev, newTicket]);
    return ticketId;
  };

  const getTicketById = (id: string): UserTicket | undefined => {
    return tickets.find(ticket => ticket.id === id && ticket.userId === user?.id);
  };

  const updateTicketStatus = (ticketId: string, newStatus: string, description: string) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId && ticket.userId === user?.id) {
        const statusColors: Record<string, string> = {
          'open': 'bg-blue-100 text-blue-800',
          'in-analysis': 'bg-yellow-100 text-yellow-800',
          'in-progress': 'bg-orange-100 text-orange-800',
          'resolved': 'bg-green-100 text-green-800',
          'closed': 'bg-gray-100 text-gray-800'
        };

        const newStatusEntry: TicketStatus = {
          id: String(ticket.statusHistory.length + 1),
          label: newStatus,
          color: statusColors[newStatus] || 'bg-gray-100 text-gray-800',
          description,
          timestamp: new Date().toISOString()
        };

        return {
          ...ticket,
          currentStatus: newStatus,
          updatedAt: new Date().toISOString(),
          statusHistory: [...ticket.statusHistory, newStatusEntry]
        };
      }
      return ticket;
    }));
  };

  const value = {
    userTickets,
    createTicket,
    getTicketById,
    updateTicketStatus
  };

  return (
    <TicketsContext.Provider value={value}>
      {children}
    </TicketsContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketsContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketsProvider');
  }
  return context;
}
