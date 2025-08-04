import { ReactNode } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="h-screen bg-background flex flex-col">
      <DashboardHeader />
      
      <div className="flex flex-1 overflow-hidden relative">
        <DashboardSidebar />
        
        <main className="flex-1 overflow-auto w-full md:w-auto">
          <div className="p-4 md:p-6 pt-16 md:pt-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}