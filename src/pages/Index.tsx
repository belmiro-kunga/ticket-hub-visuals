import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { TicketsTable } from "@/components/dashboard/TicketsTable";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  TrendingUp,
  Users
} from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Visão geral do sistema de tickets de suporte
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Novo Ticket</span>
            <span className="sm:hidden">Novo</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title="Total de Tickets"
            value="1,234"
            icon={<Ticket className="h-5 w-5" />}
            description="Todos os tickets criados"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Tickets Abertos"
            value="87"
            icon={<Clock className="h-5 w-5" />}
            description="Aguardando atendimento"
            trend={{ value: 5, isPositive: false }}
          />
          <StatCard
            title="Tickets Resolvidos"
            value="1,089"
            icon={<CheckCircle className="h-5 w-5" />}
            description="Resolvidos este mês"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Tickets Urgentes"
            value="23"
            icon={<AlertTriangle className="h-5 w-5" />}
            description="Requerem atenção imediata"
            trend={{ value: 3, isPositive: false }}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Tickets Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Ticket className="h-5 w-5 mr-2" />
                  Tickets Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TicketsTable />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <RecentActivity />

            {/* Performance Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Performance da Equipe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Taxa de Resolução</span>
                    <span className="text-sm text-success font-medium">94%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tempo Médio</span>
                    <span className="text-sm text-muted-foreground">2.5 horas</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Satisfação</span>
                    <span className="text-sm text-success font-medium">4.8/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Status da Equipe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Online</span>
                    <span className="text-sm font-medium text-success">8 agentes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ocupados</span>
                    <span className="text-sm font-medium text-warning">3 agentes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Offline</span>
                    <span className="text-sm font-medium text-muted-foreground">2 agentes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
