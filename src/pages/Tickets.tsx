import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Ticket, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Download,
  RefreshCw,
  Calendar,
  User,
  AlertCircle
} from "lucide-react";

interface TicketData {
  id: string;
  subject: string;
  customer: string;
  status: 'open' | 'pending' | 'solved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  created: string;
  updated: string;
  description?: string;
  category: string;
}

const mockTickets: TicketData[] = [
  {
    id: "TKT-001",
    subject: "Problema com login no sistema",
    customer: "João Silva",
    status: "open",
    priority: "high",
    assignee: "Maria Santos",
    created: "2024-01-15",
    updated: "2024-01-15",
    description: "Usuário não consegue fazer login após atualização do sistema",
    category: "Técnico"
  },
  {
    id: "TKT-002",
    subject: "Erro na geração de relatórios",
    customer: "Ana Costa",
    status: "pending",
    priority: "medium",
    assignee: "Pedro Oliveira",
    created: "2024-01-14",
    updated: "2024-01-15",
    description: "Relatórios mensais não estão sendo gerados corretamente",
    category: "Funcionalidade"
  },
  {
    id: "TKT-003",
    subject: "Solicitação de nova funcionalidade",
    customer: "Carlos Mendes",
    status: "solved",
    priority: "low",
    assignee: "Maria Santos",
    created: "2024-01-12",
    updated: "2024-01-14",
    description: "Solicitação para adicionar filtro avançado na busca",
    category: "Melhoria"
  },
  {
    id: "TKT-004",
    subject: "Sistema lento durante picos de acesso",
    customer: "Empresa XYZ",
    status: "closed",
    priority: "urgent",
    assignee: "Tech Team",
    created: "2024-01-10",
    updated: "2024-01-13",
    description: "Performance degradada durante horários de pico",
    category: "Performance"
  },
  {
    id: "TKT-005",
    subject: "Problema na integração com API externa",
    customer: "TechCorp Ltd",
    status: "open",
    priority: "high",
    assignee: "João Developer",
    created: "2024-01-16",
    updated: "2024-01-16",
    description: "Falha na comunicação com API de pagamentos",
    category: "Integração"
  },
  {
    id: "TKT-006",
    subject: "Solicitação de suporte para configuração",
    customer: "StartupABC",
    status: "pending",
    priority: "medium",
    assignee: "Suporte Técnico",
    created: "2024-01-15",
    updated: "2024-01-16",
    description: "Ajuda para configurar ambiente de produção",
    category: "Suporte"
  }
];

const getStatusBadge = (status: TicketData['status']) => {
  const statusMap = {
    open: { label: 'Aberto', className: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
    pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
    solved: { label: 'Resolvido', className: 'bg-green-100 text-green-800 hover:bg-green-200' },
    closed: { label: 'Fechado', className: 'bg-gray-100 text-gray-800 hover:bg-gray-200' }
  };

  const statusInfo = statusMap[status];
  return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
};

const getPriorityBadge = (priority: TicketData['priority']) => {
  const priorityMap = {
    low: { label: 'Baixa', variant: 'secondary' as const },
    medium: { label: 'Média', variant: 'outline' as const },
    high: { label: 'Alta', variant: 'destructive' as const },
    urgent: { label: 'Urgente', variant: 'destructive' as const }
  };

  const priorityInfo = priorityMap[priority];
  return <Badge variant={priorityInfo.variant}>{priorityInfo.label}</Badge>;
};

const Tickets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: mockTickets.length,
    open: mockTickets.filter(t => t.status === 'open').length,
    pending: mockTickets.filter(t => t.status === 'pending').length,
    solved: mockTickets.filter(t => t.status === 'solved').length,
    closed: mockTickets.filter(t => t.status === 'closed').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center">
              <Ticket className="h-6 w-6 lg:h-8 lg:w-8 mr-2 lg:mr-3 text-primary" />
              <span className="hidden sm:inline">Gerenciamento de Tickets</span>
              <span className="sm:hidden">Tickets</span>
            </h1>
            <p className="text-muted-foreground text-sm lg:text-base">
              Gerencie todos os tickets de suporte do sistema
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Exportar</span>
              <span className="sm:hidden">Export</span>
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <RefreshCw className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Atualizar</span>
              <span className="sm:hidden">Refresh</span>
            </Button>
            <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Novo Ticket</span>
              <span className="sm:hidden">Novo</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Ticket className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Abertos</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolvidos</p>
                  <p className="text-2xl font-bold text-green-600">{stats.solved}</p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fechados</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
                </div>
                <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por ID, assunto ou cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="open">Aberto</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="solved">Resolvido</SelectItem>
                  <SelectItem value="closed">Fechado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as prioridades</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tickets Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Lista de Tickets ({filteredTickets.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold w-20">ID</TableHead>
                    <TableHead className="font-semibold min-w-[200px]">Assunto</TableHead>
                    <TableHead className="font-semibold min-w-[120px]">Cliente</TableHead>
                    <TableHead className="font-semibold w-24 hidden sm:table-cell">Categoria</TableHead>
                    <TableHead className="font-semibold w-24">Status</TableHead>
                    <TableHead className="font-semibold w-24">Prioridade</TableHead>
                    <TableHead className="font-semibold min-w-[120px] hidden md:table-cell">Responsável</TableHead>
                    <TableHead className="font-semibold w-24 hidden lg:table-cell">Criado</TableHead>
                    <TableHead className="font-semibold w-20">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium text-xs sm:text-sm">{ticket.id}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate text-xs sm:text-sm" title={ticket.subject}>
                          {ticket.subject}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-xs sm:text-sm">
                          <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-muted-foreground" />
                          <span className="truncate">{ticket.customer}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline" className="text-xs">{ticket.category}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                      <TableCell className="hidden md:table-cell text-xs sm:text-sm">{ticket.assignee}</TableCell>
                      <TableCell className="hidden lg:table-cell text-xs">{new Date(ticket.created).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedTicket(ticket)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Detalhes do Ticket - {selectedTicket?.id}</DialogTitle>
                                <DialogDescription>
                                  Informações completas do ticket selecionado
                                </DialogDescription>
                              </DialogHeader>
                              {selectedTicket && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Assunto:</label>
                                      <p className="text-sm text-muted-foreground">{selectedTicket.subject}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Cliente:</label>
                                      <p className="text-sm text-muted-foreground">{selectedTicket.customer}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Status:</label>
                                      <div className="mt-1">{getStatusBadge(selectedTicket.status)}</div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Prioridade:</label>
                                      <div className="mt-1">{getPriorityBadge(selectedTicket.priority)}</div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Responsável:</label>
                                      <p className="text-sm text-muted-foreground">{selectedTicket.assignee}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Categoria:</label>
                                      <p className="text-sm text-muted-foreground">{selectedTicket.category}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Descrição:</label>
                                    <p className="text-sm text-muted-foreground mt-1">{selectedTicket.description}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Criado em:</label>
                                      <p className="text-sm text-muted-foreground">
                                        {new Date(selectedTicket.created).toLocaleDateString('pt-BR')}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Última atualização:</label>
                                      <p className="text-sm text-muted-foreground">
                                        {new Date(selectedTicket.updated).toLocaleDateString('pt-BR')}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredTickets.length === 0 && (
              <div className="text-center py-8">
                <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum ticket encontrado com os filtros aplicados.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Tickets;
