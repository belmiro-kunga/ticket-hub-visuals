import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Edit } from "lucide-react";

interface Ticket {
  id: string;
  subject: string;
  customer: string;
  status: 'open' | 'pending' | 'solved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  created: string;
  updated: string;
}

const mockTickets: Ticket[] = [
  {
    id: "TKT-001",
    subject: "Problema com login no sistema",
    customer: "João Silva",
    status: "open",
    priority: "high",
    assignee: "Maria Santos",
    created: "2024-01-15",
    updated: "2024-01-15"
  },
  {
    id: "TKT-002",
    subject: "Erro na geração de relatórios",
    customer: "Ana Costa",
    status: "pending",
    priority: "medium",
    assignee: "Pedro Oliveira",
    created: "2024-01-14",
    updated: "2024-01-15"
  },
  {
    id: "TKT-003",
    subject: "Solicitação de nova funcionalidade",
    customer: "Carlos Mendes",
    status: "solved",
    priority: "low",
    assignee: "Maria Santos",
    created: "2024-01-12",
    updated: "2024-01-14"
  },
  {
    id: "TKT-004",
    subject: "Sistema lento durante picos de acesso",
    customer: "Empresa XYZ",
    status: "closed",
    priority: "urgent",
    assignee: "Tech Team",
    created: "2024-01-10",
    updated: "2024-01-13"
  }
];

const getStatusBadge = (status: Ticket['status']) => {
  const statusMap = {
    open: { label: 'Aberto', className: 'status-open' },
    pending: { label: 'Pendente', className: 'status-pending' },
    solved: { label: 'Resolvido', className: 'status-solved' },
    closed: { label: 'Fechado', className: 'status-closed' }
  };

  const statusInfo = statusMap[status];
  return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
};

const getPriorityBadge = (priority: Ticket['priority']) => {
  const priorityMap = {
    low: { label: 'Baixa', variant: 'secondary' as const },
    medium: { label: 'Média', variant: 'outline' as const },
    high: { label: 'Alta', variant: 'destructive' as const },
    urgent: { label: 'Urgente', variant: 'destructive' as const }
  };

  const priorityInfo = priorityMap[priority];
  return <Badge variant={priorityInfo.variant}>{priorityInfo.label}</Badge>;
};

export function TicketsTable() {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">ID</TableHead>
            <TableHead className="font-semibold">Assunto</TableHead>
            <TableHead className="font-semibold">Cliente</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Prioridade</TableHead>
            <TableHead className="font-semibold">Responsável</TableHead>
            <TableHead className="font-semibold">Criado</TableHead>
            <TableHead className="font-semibold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockTickets.map((ticket) => (
            <TableRow key={ticket.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{ticket.id}</TableCell>
              <TableCell className="max-w-xs truncate">{ticket.subject}</TableCell>
              <TableCell>{ticket.customer}</TableCell>
              <TableCell>{getStatusBadge(ticket.status)}</TableCell>
              <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
              <TableCell>{ticket.assignee}</TableCell>
              <TableCell>{new Date(ticket.created).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}