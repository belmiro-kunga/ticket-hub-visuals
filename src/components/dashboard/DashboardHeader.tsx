import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DashboardHeader() {
  return (
    <header className="bg-header text-header-foreground h-16 px-4 md:px-6 flex items-center justify-between border-b border-border">
      <div className="flex items-center space-x-2 md:space-x-4">
        <h1 className="text-sm md:text-lg font-semibold truncate">
          <span className="hidden sm:inline">Sistema de Tickets de Suporte</span>
          <span className="sm:hidden">Tickets</span>
        </h1>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="relative hidden md:block max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tickets..."
            className="pl-10 bg-white/10 border-white/20 text-header-foreground placeholder:text-white/70"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="text-header-foreground hover:bg-white/10 md:hidden">
          <Search className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-header-foreground hover:bg-white/10">
          <Bell className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-header-foreground hover:bg-white/10">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}