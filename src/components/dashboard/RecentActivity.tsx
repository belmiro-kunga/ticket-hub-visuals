import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  ticket: string;
  time: string;
  avatar?: string;
}

const recentActivities: ActivityItem[] = [
  {
    id: "1",
    user: "Maria Santos",
    action: "resolveu o ticket",
    ticket: "TKT-003",
    time: "2 horas atrás"
  },
  {
    id: "2",
    user: "Pedro Oliveira",
    action: "comentou no ticket",
    ticket: "TKT-002",
    time: "4 horas atrás"
  },
  {
    id: "3",
    user: "João Silva",
    action: "criou o ticket",
    ticket: "TKT-001",
    time: "6 horas atrás"
  },
  {
    id: "4",
    user: "Ana Costa",
    action: "atualizou o ticket",
    ticket: "TKT-004",
    time: "8 horas atrás"
  },
  {
    id: "5",
    user: "Carlos Mendes",
    action: "fechou o ticket",
    ticket: "TKT-005",
    time: "1 dia atrás"
  }
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.avatar} />
                <AvatarFallback>
                  {activity.user.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-card-foreground">
                  <span className="font-medium">{activity.user}</span>{' '}
                  {activity.action}{' '}
                  <span className="font-medium text-primary">{activity.ticket}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}