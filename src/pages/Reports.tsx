import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { 
  BarChart3, 
  Download, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Users,
  Ticket,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  Award,
  Activity,
  FileText,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  BarChart as BarChartIcon
} from "lucide-react";

// Mock data for charts
const ticketsByMonth = [
  { month: 'Jan', created: 45, resolved: 42, pending: 8 },
  { month: 'Fev', created: 52, resolved: 48, pending: 12 },
  { month: 'Mar', created: 38, resolved: 41, pending: 9 },
  { month: 'Abr', created: 61, resolved: 55, pending: 15 },
  { month: 'Mai', created: 49, resolved: 52, pending: 12 },
  { month: 'Jun', created: 67, resolved: 59, pending: 20 }
];

const ticketsByPriority = [
  { name: 'Baixa', value: 156, color: '#10B981' },
  { name: 'Média', value: 234, color: '#F59E0B' },
  { name: 'Alta', value: 89, color: '#EF4444' },
  { name: 'Urgente', value: 23, color: '#DC2626' }
];

const ticketsByStatus = [
  { name: 'Abertos', value: 87, color: '#3B82F6' },
  { name: 'Pendentes', value: 45, color: '#F59E0B' },
  { name: 'Resolvidos', value: 312, color: '#10B981' },
  { name: 'Fechados', value: 158, color: '#6B7280' }
];

const agentPerformance = [
  { name: 'Maria Santos', resolved: 142, assigned: 15, satisfaction: 4.8 },
  { name: 'João Silva', resolved: 89, assigned: 8, satisfaction: 4.6 },
  { name: 'Pedro Oliveira', resolved: 76, assigned: 12, satisfaction: 4.7 },
  { name: 'Ana Costa', resolved: 65, assigned: 9, satisfaction: 4.5 }
];

const responseTimeData = [
  { period: 'Sem 1', avgResponse: 2.4, target: 4.0 },
  { period: 'Sem 2', avgResponse: 3.1, target: 4.0 },
  { period: 'Sem 3', avgResponse: 2.8, target: 4.0 },
  { period: 'Sem 4', avgResponse: 2.2, target: 4.0 }
];

const satisfactionTrend = [
  { month: 'Jan', satisfaction: 4.2 },
  { month: 'Fev', satisfaction: 4.4 },
  { month: 'Mar', satisfaction: 4.3 },
  { month: 'Abr', satisfaction: 4.6 },
  { month: 'Mai', satisfaction: 4.5 },
  { month: 'Jun', satisfaction: 4.7 }
];

const departmentStats = [
  { department: 'TI', tickets: 234, resolved: 89.7, avgTime: 2.3 },
  { department: 'Suporte', tickets: 189, resolved: 92.1, avgTime: 1.8 },
  { department: 'Vendas', tickets: 156, resolved: 87.2, avgTime: 3.1 },
  { department: 'RH', tickets: 78, resolved: 94.9, avgTime: 1.5 }
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState("last30days");
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate key metrics
  const totalTickets = ticketsByMonth.reduce((sum, month) => sum + month.created, 0);
  const totalResolved = ticketsByMonth.reduce((sum, month) => sum + month.resolved, 0);
  const totalPending = ticketsByMonth.reduce((sum, month) => sum + month.pending, 0);
  const resolutionRate = ((totalResolved / totalTickets) * 100).toFixed(1);
  const avgSatisfaction = (satisfactionTrend.reduce((sum, month) => sum + month.satisfaction, 0) / satisfactionTrend.length).toFixed(1);
  const avgResponseTime = (responseTimeData.reduce((sum, week) => sum + week.avgResponse, 0) / responseTimeData.length).toFixed(1);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <BarChart3 className="h-8 w-8 mr-3 text-primary" />
              Relatórios e Analytics
            </h1>
            <p className="text-muted-foreground">
              Análise detalhada de performance e métricas do sistema
            </p>
          </div>
          <div className="flex space-x-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7days">Últimos 7 dias</SelectItem>
                <SelectItem value="last30days">Últimos 30 dias</SelectItem>
                <SelectItem value="last90days">Últimos 90 dias</SelectItem>
                <SelectItem value="lastyear">Último ano</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Tickets</p>
                  <p className="text-2xl font-bold">{totalTickets}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% vs mês anterior
                  </p>
                </div>
                <Ticket className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taxa de Resolução</p>
                  <p className="text-2xl font-bold">{resolutionRate}%</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +3.2% vs mês anterior
                  </p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tempo Médio</p>
                  <p className="text-2xl font-bold">{avgResponseTime}h</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -15min vs mês anterior
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Satisfação</p>
                  <p className="text-2xl font-bold">{avgSatisfaction}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +0.3 vs mês anterior
                  </p>
                </div>
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tickets Pendentes</p>
                  <p className="text-2xl font-bold">{totalPending}</p>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5 vs semana anterior
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Agentes Ativos</p>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    8 online agora
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center">
              <BarChartIcon className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <PieChartIcon className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Relatórios
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tickets por Mês */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChartIcon className="h-5 w-5 mr-2" />
                    Tickets por Mês
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ticketsByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="created" fill="#3B82F6" name="Criados" />
                      <Bar dataKey="resolved" fill="#10B981" name="Resolvidos" />
                      <Bar dataKey="pending" fill="#F59E0B" name="Pendentes" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Tickets por Prioridade */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChartIcon className="h-5 w-5 mr-2" />
                    Distribuição por Prioridade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={ticketsByPriority}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {ticketsByPriority.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Tempo de Resposta */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Tempo de Resposta (Horas)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avgResponse" stroke="#3B82F6" strokeWidth={2} name="Tempo Médio" />
                    <Line type="monotone" dataKey="target" stroke="#EF4444" strokeDasharray="5 5" name="Meta" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance dos Agentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Performance dos Agentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={agentPerformance} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="resolved" fill="#10B981" name="Resolvidos" />
                      <Bar dataKey="assigned" fill="#F59E0B" name="Atribuídos" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Satisfação ao Longo do Tempo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Tendência de Satisfação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={satisfactionTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[3.5, 5]} />
                      <Tooltip />
                      <Area type="monotone" dataKey="satisfaction" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} name="Satisfação" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Estatísticas por Departamento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Performance por Departamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentStats.map((dept, index) => (
                    <div key={dept.department} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <div>
                          <h4 className="font-semibold">{dept.department}</h4>
                          <p className="text-sm text-muted-foreground">{dept.tickets} tickets processados</p>
                        </div>
                      </div>
                      <div className="flex space-x-6 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-green-600">{dept.resolved}%</p>
                          <p className="text-muted-foreground">Taxa de Resolução</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-blue-600">{dept.avgTime}h</p>
                          <p className="text-muted-foreground">Tempo Médio</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChartIcon className="h-5 w-5 mr-2" />
                    Distribuição por Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={ticketsByStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {ticketsByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Insights e Recomendações */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Insights e Recomendações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <h4 className="font-semibold text-green-800">Excelente Performance</h4>
                    </div>
                    <p className="text-sm text-green-700">
                      Taxa de resolução acima da meta (90%). Continue o bom trabalho!
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                      <h4 className="font-semibold text-yellow-800">Atenção Necessária</h4>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Aumento de 15% nos tickets pendentes. Considere redistribuir a carga de trabalho.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-semibold text-blue-800">Oportunidade</h4>
                    </div>
                    <p className="text-sm text-blue-700">
                      Departamento de RH com melhor performance. Aplicar suas práticas em outros setores.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <Badge variant="secondary">Mensal</Badge>
                  </div>
                  <h3 className="font-semibold mb-2">Relatório de Performance</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Análise completa da performance da equipe e métricas de produtividade.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar PDF
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <BarChart3 className="h-8 w-8 text-green-600" />
                    <Badge variant="secondary">Semanal</Badge>
                  </div>
                  <h3 className="font-semibold mb-2">Dashboard Executivo</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Resumo executivo com KPIs principais e tendências do negócio.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar PDF
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="h-8 w-8 text-purple-600" />
                    <Badge variant="secondary">Mensal</Badge>
                  </div>
                  <h3 className="font-semibold mb-2">Análise de Satisfação</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Relatório detalhado sobre satisfação do cliente e feedback.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar PDF
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
