import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  Shield,
  Eye,
  EyeOff,
  X,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsers, type User as UserType, type UpdateUserData } from "@/contexts/UsersContext";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
}

export function EditUserModal({ isOpen, onClose, user }: EditUserModalProps) {
  const { updateUser, isLoading, error } = useUsers();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    role: 'user' as 'admin' | 'user',
    status: 'active' as 'active' | 'inactive' | 'suspended',
    defaultPriority: 'media' as 'baixa' | 'media' | 'alta' | 'urgente'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Update form data when user prop changes
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '', // Keep password empty for security
        phone: user.phone || '',
        department: user.department,
        role: user.role,
        status: user.status,
        defaultPriority: user.defaultPriority || 'media'
      });
      setFormErrors({});
    }
  }, [user, isOpen]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Formato de email inválido';
    }

    if (!formData.department) {
      errors.department = 'Departamento é obrigatório';
    }

    if (!formData.role) {
      errors.role = 'Função é obrigatória';
    }

    // Password is optional for updates
    if (formData.password && formData.password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) {
      return;
    }

    // Prepare update data (only include password if provided)
    const updateData: UpdateUserData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      department: formData.department,
      role: formData.role,
      status: formData.status,
      defaultPriority: formData.defaultPriority
    };

    // Only include password if it was changed
    if (formData.password.trim()) {
      updateData.password = formData.password;
    }

    const success = await updateUser(user.id, updateData);
    
    if (success) {
      handleClose();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      department: '',
      role: 'user',
      status: 'active',
      defaultPriority: 'media'
    });
    setFormErrors({});
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Editar Usuário
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Atualize as informações do usuário {user.name}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-sm font-medium">
              Nome completo *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="edit-name"
                type="text"
                placeholder="Digite o nome completo"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`pl-10 ${formErrors.name ? 'border-red-500' : ''}`}
              />
            </div>
            {formErrors.name && (
              <p className="text-xs text-red-600 dark:text-red-400">{formErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="edit-email" className="text-sm font-medium">
              Email *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="edit-email"
                type="email"
                placeholder="usuario@empresa.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`pl-10 ${formErrors.email ? 'border-red-500' : ''}`}
              />
            </div>
            {formErrors.email && (
              <p className="text-xs text-red-600 dark:text-red-400">{formErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="edit-password" className="text-sm font-medium">
              Nova Senha (opcional)
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="edit-password"
                type={showPassword ? "text" : "password"}
                placeholder="Deixe em branco para manter a senha atual"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`pl-10 pr-10 ${formErrors.password ? 'border-red-500' : ''}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {formErrors.password && (
              <p className="text-xs text-red-600 dark:text-red-400">{formErrors.password}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="edit-phone" className="text-sm font-medium">
              Telefone
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="edit-phone"
                type="tel"
                placeholder="+244 900 000 000"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label htmlFor="edit-department" className="text-sm font-medium">
              Departamento *
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
              <Select
                value={formData.department}
                onValueChange={(value) => handleInputChange('department', value)}
              >
                <SelectTrigger className={`pl-10 ${formErrors.department ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Selecione o departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TI">Tecnologia da Informação</SelectItem>
                  <SelectItem value="RH">Recursos Humanos</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="Comercial">Comercial</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Operações">Operações</SelectItem>
                  <SelectItem value="Suporte">Suporte</SelectItem>
                  <SelectItem value="Administração">Administração</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formErrors.department && (
              <p className="text-xs text-red-600 dark:text-red-400">{formErrors.department}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="edit-role" className="text-sm font-medium">
              Função *
            </Label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
              <Select
                value={formData.role}
                onValueChange={(value: 'admin' | 'user') => handleInputChange('role', value)}
              >
                <SelectTrigger className={`pl-10 ${formErrors.role ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formErrors.role && (
              <p className="text-xs text-red-600 dark:text-red-400">{formErrors.role}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="edit-status" className="text-sm font-medium">
              Status *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'inactive' | 'suspended') => handleInputChange('status', value)}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="suspended">Suspenso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="edit-priority" className="text-sm font-medium">
              Prioridade de Atendimento *
            </Label>
            <div className="relative">
              <AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
              <Select
                value={formData.defaultPriority}
                onValueChange={(value: 'baixa' | 'media' | 'alta' | 'urgente') => handleInputChange('defaultPriority', value)}
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Selecione a prioridade padrão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>Baixa</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="media">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span>Média</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="alta">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <span>Alta</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="urgente">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span>Urgente</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-gray-500">
              Esta será a prioridade padrão para os tickets criados por este usuário
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
