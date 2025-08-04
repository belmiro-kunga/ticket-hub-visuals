import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  RefreshCw,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  Users as UsersIcon,
  UserPlus,
  Shield,
  Activity,
  X,
  AlertTriangle,
} from "lucide-react";
import { useUsers, type User } from "@/contexts/UsersContext";
import { CreateUserModal } from "@/components/modals/CreateUserModal";
import { EditUserModal } from "@/components/modals/EditUserModal";

function UsersPage() {
  const { users, stats, isLoading, error, refreshData, updateUser, deleteUser, testAuthentication } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Get unique departments for filter
  const departments = Array.from(new Set(users.map(user => user.department)));

  // Load data on component mount
  useEffect(() => {
    refreshData();
  }, []);

  // Debug function to test API connection
  const handleDebugTest = async () => {
    console.log('🔍 Starting debug test...');
    setDebugInfo('Testando conexão...');
    
    try {
      // Test health endpoint
      const healthResponse = await fetch('http://localhost:3001/health');
      const healthData = await healthResponse.json();
      setDebugInfo(`Health: ${healthData.success ? 'OK' : 'FALHOU'}`);
      
      // Test API test endpoint
      const testResponse = await fetch('http://localhost:3001/api/test');
      const testData = await testResponse.json();
      setDebugInfo(prev => `${prev} | API Test: ${testData.success ? 'OK' : 'FALHOU'}`);
      
      // Test authentication
      const isAuth = await testAuthentication();
      setDebugInfo(prev => `${prev} | Auth: ${isAuth ? 'OK' : 'FALHOU'}`);
      
    } catch (error: any) {
      setDebugInfo(`Erro: ${error.message}`);
    }
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || user.department === departmentFilter;
    
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  // Use stats from context or calculate from users
  const totalUsers = stats?.total || users.length;
  const activeUsers = stats?.active || users.filter(user => user.status === 'active').length;
  const adminUsers = stats?.admins || users.filter(user => user.role === 'admin').length;
  const newUsersThisMonth = stats?.newThisMonth || 0;

  const getRoleBadge = (role: User['role']) => {
    const roleMap = {
      admin: { label: 'Administrador', className: 'bg-red-100 text-red-800 hover:bg-red-200', icon: Shield },
      user: { label: 'Usuário', className: 'bg-blue-100 text-blue-800 hover:bg-blue-200', icon: UserCheck }
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

  const getStatusBadge = (status: User['status']) => {
    const statusMap = {
      active: { label: 'Ativo', className: 'bg-green-100 text-green-800 hover:bg-green-200' },
      inactive: { label: 'Inativo', className: 'bg-gray-100 text-gray-800 hover:bg-gray-200' },
      suspended: { label: 'Suspenso', className: 'bg-red-100 text-red-800 hover:bg-red-200' }
    };

    const statusInfo = statusMap[status];
    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
  };

  const getPriorityBadge = (priority?: User['defaultPriority']) => {
    if (!priority) return <Badge className="bg-gray-100 text-gray-800">Não definida</Badge>;
    
    const priorityMap = {
      baixa: { label: 'Baixa', className: 'bg-green-100 text-green-800 hover:bg-green-200', color: 'bg-green-500' },
      media: { label: 'Média', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200', color: 'bg-yellow-500' },
      alta: { label: 'Alta', className: 'bg-orange-100 text-orange-800 hover:bg-orange-200', color: 'bg-orange-500' },
      urgente: { label: 'Urgente', className: 'bg-red-100 text-red-800 hover:bg-red-200', color: 'bg-red-500' }
    };

    const priorityInfo = priorityMap[priority];
    return (
      <Badge className={priorityInfo.className}>
        <div className={`w-2 h-2 rounded-full ${priorityInfo.color} mr-1`}></div>
        {priorityInfo.label}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return 'Nunca';
    
    const date = new Date(lastLogin);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
    if (diffInHours < 1) return 'Agora mesmo';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInHours < 48) return 'Ontem';
    return date.toLocaleDateString('pt-BR');
  };

  const formatJoinDate = (joinDate: string) => {
    return new Date(joinDate).toLocaleDateString('pt-BR');
  };

  // Handle edit user
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // Handle delete user
  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteConfirmOpen(true);
  };

  // Confirm delete user
  const confirmDeleteUser = async () => {
    if (userToDelete) {
      const success = await deleteUser(userToDelete.id);
      if (success) {
        setIsDeleteConfirmOpen(false);
        setUserToDelete(null);
      }
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Carregando usuários...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={refreshData}>Tentar novamente</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
            <p className="text-muted-foreground">
              Gerencie usuários e suas permissões no sistema
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={refreshData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
            <Button 
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleDebugTest}
            >
              Debug Test
            </Button>
          </div>
        </div>

        {/* Debug Info */}
        {debugInfo && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-800">Debug Info</h3>
                  <p className="text-sm text-blue-600">{debugInfo}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDebugInfo('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{totalUsers}</p>
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
                  <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Administradores</p>
                  <p className="text-2xl font-bold text-red-600">{adminUsers}</p>
                </div>
                <Shield className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Novos este mês</p>
                  <p className="text-2xl font-bold text-blue-600">{newUsersThisMonth}</p>
                </div>
                <UserPlus className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome, email ou departamento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Todas as funções" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as funções</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="user">Usuário</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="suspended">Suspenso</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Todos os departamentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os departamentos</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuários ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Último Login</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="text-muted-foreground">
                          <UsersIcon className="h-8 w-8 mx-auto mb-2" />
                          <p>Nenhum usuário encontrado</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {user.email}
                              </div>
                              {user.phone && (
                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {user.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>{getPriorityBadge(user.defaultPriority)}</TableCell>
                        <TableCell>{formatLastLogin(user.lastLogin)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatJoinDate(user.joinDate)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600"
                                onClick={() => handleDeleteUser(user)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Create User Modal */}
        <CreateUserModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
        />

        {/* Edit User Modal */}
        <EditUserModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)}
          user={selectedUser}
        />

        {/* Delete Confirmation Modal */}
        {isDeleteConfirmOpen && userToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={cancelDelete}
            />
            
            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Confirmar Exclusão
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Esta ação não pode ser desfeita
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelDelete}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                      <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Excluir {userToDelete.name}?
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      O usuário será desativado e não poderá mais acessar o sistema.
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                      <p className="font-medium">Atenção:</p>
                      <p>Esta ação irá desativar o usuário. Todos os tickets atribuídos a ele permanecerão intactos.</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelDelete}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={confirmDeleteUser}
                    className="flex-1"
                  >
                    Sim, Excluir
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default UsersPage;
