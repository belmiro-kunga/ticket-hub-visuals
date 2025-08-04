import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTickets, UserTicket } from "@/contexts/TicketsContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Clock, 
  Eye, 
  Search, 
  Filter,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Zap,
  FileText,
  ArrowRight,
  LogOut
} from "lucide-react";

const statusColors: Record<string, string> = {
  'open': 'bg-blue-100 text-blue-800',
  'in-analysis': 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-orange-100 text-orange-800',
  'resolved': 'bg-green-100 text-green-800',
  'closed': 'bg-gray-100 text-gray-800'
};

const statusLabels: Record<string, string> = {
  'open': 'Aberto',
  'in-analysis': 'Em Análise',
  'in-progress': 'Em Andamento',
  'resolved': 'Resolvido',
  'closed': 'Fechado'
};

const priorityColors: Record<string, string> = {
  'low': 'bg-green-100 text-green-800',
  'medium': 'bg-yellow-100 text-yellow-800',
  'high': 'bg-orange-100 text-orange-800',
  'urgent': 'bg-red-100 text-red-800'
};

const priorityLabels: Record<string, string> = {
  'low': 'Baixa',
  'medium': 'Média',
  'high': 'Alta',
  'urgent': 'Urgente'
};

function TicketTimeline({ ticket }: { ticket: UserTicket }) {
  return (
    <div className="space-y-4">
      <div className="border-l-2 border-gray-200 pl-4 space-y-4">
        {ticket.statusHistory.map((status, index) => (
          <div key={status.id} className="relative">
            <div className="absolute -left-6 w-4 h-4 bg-white border-2 border-primary rounded-full"></div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Badge className={status.color}>{status.label}</Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(status.timestamp).toLocaleString('pt-PT', {
                    timeZone: 'Africa/Luanda',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-600">{status.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TicketCard({ ticket }: { ticket: UserTicket }) {
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{ticket.subject}</CardTitle>
            <CardDescription className="text-sm">
              Ticket #{ticket.id}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={statusColors[ticket.currentStatus]}>
              {statusLabels[ticket.currentStatus]}
            </Badge>
            <Badge className={priorityColors[ticket.priority]}>
              {priorityLabels[ticket.priority]}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-2">{ticket.description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">
              {new Date(ticket.createdAt).toLocaleDateString('pt-PT', {
                timeZone: 'Africa/Luanda',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </span>
          </div>
          {ticket.assignedTo && (
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{ticket.assignedTo}</span>
            </div>
          )}
        </div>

        {ticket.estimatedResolution && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Resolução Estimada:
              </span>
              <span className="text-sm text-blue-700">
                {new Date(ticket.estimatedResolution).toLocaleDateString('pt-PT', {
                  timeZone: 'Africa/Luanda',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-gray-500">
            Atualizado em {new Date(ticket.updatedAt).toLocaleDateString('pt-PT', {
              timeZone: 'Africa/Luanda'
            })}
          </span>
          
          <Dialog open={isTimelineOpen} onOpenChange={setIsTimelineOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="h-4 w-4" />
                Ver Timeline
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Timeline - Ticket #{ticket.id}
                </DialogTitle>
                <DialogDescription>
                  {ticket.subject}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <TicketTimeline ticket={ticket} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MyTickets() {
  const { user, isAuthenticated, logout } = useAuth();
  const { userTickets } = useTickets();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Filter tickets based on search and filters
  const filteredTickets = userTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.currentStatus === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Statistics
  const stats = {
    total: userTickets.length,
    open: userTickets.filter(t => t.currentStatus === 'open').length,
    inProgress: userTickets.filter(t => ['in-analysis', 'in-progress'].includes(t.currentStatus)).length,
    resolved: userTickets.filter(t => t.currentStatus === 'resolved').length,
    closed: userTickets.filter(t => t.currentStatus === 'closed').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Meus Tickets</h1>
              <p className="text-xs text-gray-500">Acompanhe suas solicitações de suporte</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">{user?.avatar}</span>
              </div>
              <span className="text-sm font-medium">{user?.name}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/')}
            >
              Nova Solicitação
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={logout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 py-8 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.open}</div>
              <div className="text-sm text-gray-600">Abertos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
              <div className="text-sm text-gray-600">Em Andamento</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <div className="text-sm text-gray-600">Resolvidos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.closed}</div>
              <div className="text-sm text-gray-600">Fechados</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por assunto ou número do ticket..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="open">Aberto</SelectItem>
                    <SelectItem value="in-analysis">Em Análise</SelectItem>
                    <SelectItem value="in-progress">Em Andamento</SelectItem>
                    <SelectItem value="resolved">Resolvido</SelectItem>
                    <SelectItem value="closed">Fechado</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Prioridades</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {userTickets.length === 0 ? 'Nenhum ticket encontrado' : 'Nenhum ticket corresponde aos filtros'}
              </h3>
              <p className="text-gray-600 mb-4">
                {userTickets.length === 0 
                  ? 'Você ainda não criou nenhuma solicitação de suporte.'
                  : 'Tente ajustar os filtros ou termo de busca.'
                }
              </p>
              {userTickets.length === 0 && (
                <Button onClick={() => navigate('/')}>
                  Criar Primeira Solicitação
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
