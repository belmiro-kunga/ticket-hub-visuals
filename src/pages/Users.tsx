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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users as UsersIcon, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Download,
  RefreshCw,
  Calendar,
  Mail,
  Phone,
  Shield,
  UserCheck,
  UserX,
  Crown,
  Settings,
  Activity
} from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'agent' | 'customer' | 'manager';
  status: 'active' | 'inactive' | 'suspended';
  department: string;
  joinDate: string;
  lastLogin: string;
  ticketsAssigned?: number;
  ticketsResolved?: number;
  avatar?: string;
  location?: string;
  permissions: string[];
}

const mockUsers: UserData[] = [
  {
    id: "USR-001",
    name: "Maria Santos",
    email: "maria.santos@empresa.com",
    phone: "+55 11 99999-1234",
    role: "admin",
    status: "active",
    department: "TI",
    joinDate: "2023-01-15",
    lastLogin: "2024-01-16T10:30:00",
    ticketsAssigned: 15,
    ticketsResolved: 142,
    location: "São Paulo, SP",
    permissions: ["manage_users", "manage_tickets", "view_reports", "system_config"]
  },
  {
    id: "USR-002",
    name: "João Silva",
    email: "joao.silva@empresa.com",
    phone: "+55 11 98888-5678",
    role: "agent",
    status: "active",
    department: "Suporte",
    joinDate: "2023-03-20",
    lastLogin: "2024-01-16T09:15:00",
    ticketsAssigned: 8,
    ticketsResolved: 89,
    location: "Rio de Janeiro, RJ",
    permissions: ["manage_tickets", "view_customers"]
  },
  {
    id: "USR-003",
    name: "Ana Costa",
    email: "ana.costa@cliente.com",
    phone: "+55 11 97777-9012",
    role: "customer",
    status: "active",
    department: "N/A",
    joinDate: "2023-06-10",
    lastLogin: "2024-01-15T14:20:00",
    location: "Belo Horizonte, MG",
    permissions: ["create_tickets", "view_own_tickets"]
  },
  {
    id: "USR-004",
    name: "Pedro Oliveira",
    email: "pedro.oliveira@empresa.com",
    phone: "+55 11 96666-3456",
    role: "manager",
    status: "active",
    department: "Operações",
    joinDate: "2022-11-05",
    lastLogin: "2024-01-16T08:45:00",
    ticketsAssigned: 0,
    ticketsResolved: 0,
    location: "Brasília, DF",
    permissions: ["view_reports", "manage_team", "view_analytics"]
  },
  {
    id: "USR-005",
    name: "Carlos Mendes",
    email: "carlos.mendes@cliente.com",
    phone: "+55 11 95555-7890",
    role: "customer",
    status: "inactive",
    department: "N/A",
    joinDate: "2023-08-22",
    lastLogin: "2024-01-10T16:30:00",
    location: "Salvador, BA",
    permissions: ["create_tickets", "view_own_tickets"]
  },
  {
    id: "USR-006",
    name: "Fernanda Lima",
    email: "fernanda.lima@empresa.com",
    phone: "+55 11 94444-2468",
    role: "agent",
    status: "suspended",
    department: "Suporte",
    joinDate: "2023-09-15",
    lastLogin: "2024-01-12T11:00:00",
    ticketsAssigned: 3,
    ticketsResolved: 25,
    location: "Curitiba, PR",
    permissions: ["manage_tickets"]
  },
  {
    id: "USR-007",
    name: "Roberto Tech",
    email: "roberto.tech@empresa.com",
    phone: "+55 11 93333-1357",
    role: "admin",
    status: "active",
    department: "TI",
    joinDate: "2022-05-10",
    lastLogin: "2024-01-16T07:20:00",
    ticketsAssigned: 5,
    ticketsResolved: 203,
    location: "São Paulo, SP",
    permissions: ["manage_users", "manage_tickets", "view_reports", "system_config", "security_admin"]
  },
  {
    id: "USR-008",
    name: "Empresa XYZ",
    email: "contato@empresaxyz.com",
    phone: "+55 11 92222-9876",
    role: "customer",
    status: "active",
    department: "N/A",
    joinDate: "2023-12-01",
    lastLogin: "2024-01-16T13:45:00",
    location: "Fortaleza, CE",
    permissions: ["create_tickets", "view_own_tickets", "bulk_operations"]
  }
];

const getRoleBadge = (role: UserData['role']) => {
  const roleMap = {
    admin: { label: 'Administrador', className: 'bg-red-100 text-red-800 hover:bg-red-200', icon: Crown },
    manager: { label: 'Gerente', className: 'bg-purple-100 text-purple-800 hover:bg-purple-200', icon: Shield },
    agent: { label: 'Agente', className: 'bg-blue-100 text-blue-800 hover:bg-blue-200', icon: UserCheck },
    customer: { label: 'Cliente', className: 'bg-green-100 text-green-800 hover:bg-green-200', icon: UserCheck }
  };

  const roleInfo = roleMap[role];
  const IconComponent = roleInfo.icon;
  
  return (
    <Badge className={roleInfo.className}>
      <IconComponent className="h-3 w-3 mr-1" />
      {roleInfo.label}
    </Badge>
  );
};

const getStatusBadge = (status: UserData['status']) => {
  const statusMap = {
    active: { label: 'Ativo', className: 'bg-green-100 text-green-800 hover:bg-green-200' },
    inactive: { label: 'Inativo', className: 'bg-gray-100 text-gray-800 hover:bg-gray-200' },
    suspended: { label: 'Suspenso', className: 'bg-red-100 text-red-800 hover:bg-red-200' }
  };

  const statusInfo = statusMap[status];
  return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const formatLastLogin = (lastLogin: string) => {
  const date = new Date(lastLogin);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Agora mesmo';
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  if (diffInHours < 48) return 'Ontem';
  return date.toLocaleDateString('pt-BR');
};

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || user.department === departmentFilter;
    
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  const stats = {
    total: mockUsers.length,
    active: mockUsers.filter(u => u.status === 'active').length,
    inactive: mockUsers.filter(u => u.status === 'inactive').length,
    suspended: mockUsers.filter(u => u.status === 'suspended').length,
    admins: mockUsers.filter(u => u.role === 'admin').length,
    agents: mockUsers.filter(u => u.role === 'agent').length,
    customers: mockUsers.filter(u => u.role === 'customer').length,
    managers: mockUsers.filter(u => u.role === 'manager').length,
  };

  const departments = [...new Set(mockUsers.map(u => u.department).filter(d => d !== 'N/A'))];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <UsersIcon className="h-8 w-8 mr-3 text-primary" />
              Gerenciamento de Usuários
            </h1>
            <p className="text-muted-foreground">
              Gerencie todos os usuários do sistema de tickets
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <UsersIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ativos</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inativos</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
                </div>
                <UserX className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Suspensos</p>
                  <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
                </div>
                <Shield className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Admins</p>
                  <p className="text-2xl font-bold text-red-600">{stats.admins}</p>
                </div>
                <Crown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Gerentes</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.managers}</p>
                </div>
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Agentes</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.agents}</p>
                </div>
                <UserCheck className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Clientes</p>
                  <p className="text-2xl font-bold text-green-600">{stats.customers}</p>
                </div>
                <UsersIcon className="h-8 w-8 text-green-600" />
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
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por nome, email, ID ou departamento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filtrar por função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as funções</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="manager">Gerente</SelectItem>
                  <SelectItem value="agent">Agente</SelectItem>
                  <SelectItem value="customer">Cliente</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="suspended">Suspenso</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filtrar por departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os departamentos</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Lista de Usuários ({filteredUsers.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Usuário</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Função</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Departamento</TableHead>
                    <TableHead className="font-semibold">Performance</TableHead>
                    <TableHead className="font-semibold">Último Login</TableHead>
                    <TableHead className="font-semibold">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.department}</Badge>
                      </TableCell>
                      <TableCell>
                        {user.role === 'agent' || user.role === 'admin' ? (
                          <div className="text-sm">
                            <div className="text-green-600 font-medium">
                              {user.ticketsResolved || 0} resolvidos
                            </div>
                            <div className="text-blue-600">
                              {user.ticketsAssigned || 0} atribuídos
                            </div>
                          </div>
                        ) : user.role === 'customer' ? (
                          <div className="text-sm text-muted-foreground">
                            Cliente
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            Gerencial
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatLastLogin(user.lastLogin)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Detalhes do Usuário - {selectedUser?.name}</DialogTitle>
                                <DialogDescription>
                                  Informações completas do usuário selecionado
                                </DialogDescription>
                              </DialogHeader>
                              {selectedUser && (
                                <div className="space-y-6">
                                  {/* User Profile Header */}
                                  <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                                    <Avatar className="h-16 w-16">
                                      <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                                        {getInitials(selectedUser.name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                                      <p className="text-muted-foreground">{selectedUser.email}</p>
                                      <div className="flex items-center space-x-2 mt-2">
                                        {getRoleBadge(selectedUser.role)}
                                        {getStatusBadge(selectedUser.status)}
                                      </div>
                                    </div>
                                  </div>

                                  {/* User Details Grid */}
                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                      <h4 className="font-semibold text-lg">Informações Pessoais</h4>
                                      
                                      <div>
                                        <label className="text-sm font-medium">ID do Usuário:</label>
                                        <p className="text-sm text-muted-foreground">{selectedUser.id}</p>
                                      </div>

                                      {selectedUser.phone && (
                                        <div>
                                          <label className="text-sm font-medium">Telefone:</label>
                                          <p className="text-sm text-muted-foreground flex items-center">
                                            <Phone className="h-4 w-4 mr-2" />
                                            {selectedUser.phone}
                                          </p>
                                        </div>
                                      )}

                                      {selectedUser.location && (
                                        <div>
                                          <label className="text-sm font-medium">Localização:</label>
                                          <p className="text-sm text-muted-foreground">{selectedUser.location}</p>
                                        </div>
                                      )}

                                      <div>
                                        <label className="text-sm font-medium">Data de Ingresso:</label>
                                        <p className="text-sm text-muted-foreground flex items-center">
                                          <Calendar className="h-4 w-4 mr-2" />
                                          {new Date(selectedUser.joinDate).toLocaleDateString('pt-BR')}
                                        </p>
                                      </div>

                                      <div>
                                        <label className="text-sm font-medium">Último Login:</label>
                                        <p className="text-sm text-muted-foreground">
                                          {formatLastLogin(selectedUser.lastLogin)}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="space-y-4">
                                      <h4 className="font-semibold text-lg">Informações Profissionais</h4>
                                      
                                      <div>
                                        <label className="text-sm font-medium">Departamento:</label>
                                        <p className="text-sm text-muted-foreground">{selectedUser.department}</p>
                                      </div>

                                      {(selectedUser.role === 'agent' || selectedUser.role === 'admin') && (
                                        <>
                                          <div>
                                            <label className="text-sm font-medium">Tickets Atribuídos:</label>
                                            <p className="text-sm text-blue-600 font-medium">{selectedUser.ticketsAssigned || 0}</p>
                                          </div>

                                          <div>
                                            <label className="text-sm font-medium">Tickets Resolvidos:</label>
                                            <p className="text-sm text-green-600 font-medium">{selectedUser.ticketsResolved || 0}</p>
                                          </div>

                                          {selectedUser.ticketsResolved && selectedUser.ticketsResolved > 0 && (
                                            <div>
                                              <label className="text-sm font-medium">Taxa de Resolução:</label>
                                              <p className="text-sm text-muted-foreground">
                                                {Math.round((selectedUser.ticketsResolved / (selectedUser.ticketsResolved + (selectedUser.ticketsAssigned || 0))) * 100)}%
                                              </p>
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {/* Permissions */}
                                  <div>
                                    <h4 className="font-semibold text-lg mb-3">Permissões</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedUser.permissions.map((permission, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                          <Settings className="h-3 w-3 mr-1" />
                                          {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </Badge>
                                      ))}
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
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum usuário encontrado com os filtros aplicados.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;
