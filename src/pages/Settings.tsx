import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Settings as SettingsIcon, 
  Mail, 
  Users, 
  Shield, 
  Tag, 
  Building2, 
  Ticket, 
  Bell, 
  Globe, 
  Database,
  Plus,
  Edit,
  Trash2,
  Save,
  RefreshCw
} from "lucide-react";

// Mock data
const mockUserRoles = [
  { id: 1, name: "Administrador", permissions: ["all"], color: "red", description: "Acesso total ao sistema" },
  { id: 2, name: "Gerente", permissions: ["manage_tickets", "view_reports"], color: "blue", description: "Gerenciamento de equipe" },
  { id: 3, name: "Agente", permissions: ["manage_tickets"], color: "green", description: "Atendimento de tickets" },
  { id: 4, name: "Cliente", permissions: ["create_ticket"], color: "gray", description: "Criação de tickets" }
];

const mockTicketStatus = [
  { id: 1, name: "Aberto", color: "blue", description: "Ticket recém criado", order: 1 },
  { id: 2, name: "Em Andamento", color: "yellow", description: "Ticket sendo trabalhado", order: 2 },
  { id: 3, name: "Resolvido", color: "green", description: "Ticket resolvido", order: 3 },
  { id: 4, name: "Fechado", color: "gray", description: "Ticket finalizado", order: 4 }
];

const mockDepartments = [
  { id: 1, name: "Suporte Técnico", manager: "João Silva", email: "suporte@empresa.com" },
  { id: 2, name: "Vendas", manager: "Maria Santos", email: "vendas@empresa.com" },
  { id: 3, name: "Financeiro", manager: "Carlos Lima", email: "financeiro@empresa.com" }
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const getStatusBadge = (color: string) => {
    const variants: any = {
      blue: "default",
      yellow: "secondary",
      green: "outline",
      gray: "secondary",
      red: "destructive"
    };
    return variants[color] || "default";
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
            <p className="text-muted-foreground">
              Gerencie todas as configurações da aplicação
            </p>
          </div>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general" className="gap-2">
              <SettingsIcon className="h-4 w-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="tickets" className="gap-2">
              <Ticket className="h-4 w-4" />
              Tickets
            </TabsTrigger>
            <TabsTrigger value="departments" className="gap-2">
              <Building2 className="h-4 w-4" />
              Departamentos
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Segurança
            </TabsTrigger>
          </TabsList>

          {/* Aba Geral */}
          <TabsContent value="general" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Configurações Gerais
                  </CardTitle>
                  <CardDescription>
                    Configurações básicas da aplicação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nome da Empresa</Label>
                    <Input id="company-name" defaultValue="Ticket Hub" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuso Horário</Label>
                    <Select defaultValue="africa/luanda">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="africa/luanda">África/Luanda</SelectItem>
                        <SelectItem value="europe/lisbon">Europa/Lisboa</SelectItem>
                        <SelectItem value="america/sao_paulo">América/São Paulo</SelectItem>
                        <SelectItem value="europe/london">Europa/Londres</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select defaultValue="pt-pt">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-pt">Português (Portugal)</SelectItem>
                        <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                        <SelectItem value="en-us">English (US)</SelectItem>
                        <SelectItem value="es-es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notificações
                  </CardTitle>
                  <CardDescription>
                    Configure as notificações do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="browser-notifications">Notificações do Navegador</Label>
                    <Switch id="browser-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sound-notifications">Notificações Sonoras</Label>
                    <Switch id="sound-notifications" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="desktop-notifications">Notificações Desktop</Label>
                    <Switch id="desktop-notifications" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba Email */}
          <TabsContent value="email" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Configurações SMTP
                  </CardTitle>
                  <CardDescription>
                    Configure o servidor de email para envio de notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-server">Servidor SMTP</Label>
                    <Input id="smtp-server" defaultValue="smtp.gmail.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">Porta</Label>
                    <Input id="smtp-port" defaultValue="587" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-username">Usuário</Label>
                    <Input id="smtp-username" defaultValue="noreply@tickethub.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-password">Senha</Label>
                    <Input id="smtp-password" type="password" placeholder="••••••••" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-ssl">Usar SSL/TLS</Label>
                    <Switch id="enable-ssl" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notificações por Email</CardTitle>
                  <CardDescription>
                    Configure quando enviar notificações por email
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-new-ticket">Novo Ticket</Label>
                    <Switch id="notify-new-ticket" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-status-change">Mudança de Status</Label>
                    <Switch id="notify-status-change" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-assignment">Atribuição de Ticket</Label>
                    <Switch id="notify-assignment" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="daily-report">Relatório Diário</Label>
                    <Switch id="daily-report" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="weekly-report">Relatório Semanal</Label>
                    <Switch id="weekly-report" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba Usuários */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Funções de Usuário
                    </CardTitle>
                    <CardDescription>
                      Gerencie as funções e permissões dos usuários
                    </CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nova Função
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Permissões</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUserRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell>
                          <Badge variant={getStatusBadge(role.color)}>
                            {role.name}
                          </Badge>
                        </TableCell>
                        <TableCell>{role.description}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.slice(0, 2).map((perm) => (
                              <Badge key={perm} variant="outline" className="text-xs">
                                {perm}
                              </Badge>
                            ))}
                            {role.permissions.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{role.permissions.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Tickets */}
          <TabsContent value="tickets" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Status de Tickets
                    </CardTitle>
                    <CardDescription>
                      Configure os status disponíveis para tickets
                    </CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Status
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Ordem</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTicketStatus.map((status) => (
                      <TableRow key={status.id}>
                        <TableCell>
                          <Badge variant={getStatusBadge(status.color)}>
                            {status.name}
                          </Badge>
                        </TableCell>
                        <TableCell>{status.description}</TableCell>
                        <TableCell>{status.order}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Departamentos */}
          <TabsContent value="departments" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Departamentos
                    </CardTitle>
                    <CardDescription>
                      Gerencie os departamentos da organização
                    </CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Departamento
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Gerente</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockDepartments.map((dept) => (
                      <TableRow key={dept.id}>
                        <TableCell className="font-medium">{dept.name}</TableCell>
                        <TableCell>{dept.manager}</TableCell>
                        <TableCell>{dept.email}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Segurança */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Políticas de Senha
                  </CardTitle>
                  <CardDescription>
                    Configure os requisitos de segurança para senhas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-length">Comprimento Mínimo</Label>
                    <Input id="min-length" type="number" defaultValue="8" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="require-uppercase">Exigir Maiúsculas</Label>
                    <Switch id="require-uppercase" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="require-numbers">Exigir Números</Label>
                    <Switch id="require-numbers" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="require-symbols">Exigir Símbolos</Label>
                    <Switch id="require-symbols" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Backup e Sistema
                  </CardTitle>
                  <CardDescription>
                    Configure backup e manutenção do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-backup">Backup Automático</Label>
                    <Switch id="auto-backup" defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backup-frequency">Frequência</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">A cada hora</SelectItem>
                        <SelectItem value="daily">Diariamente</SelectItem>
                        <SelectItem value="weekly">Semanalmente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Executar Backup
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
