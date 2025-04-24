
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { VoiceAssistantProvider } from "@/contexts/VoiceAssistantContext";

interface MainLayoutProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, requiredPermission }) => {
  const { isAuthenticated, isLoading, hasPermission, user } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Check if user has required permission
  const userHasAccess = !requiredPermission || hasPermission(requiredPermission);

  useEffect(() => {
    // Only show the toast if the user is authenticated but doesn't have permission
    // This prevents showing the toast during initial loading or when not logged in
    if (isAuthenticated && requiredPermission && !userHasAccess) {
      toast({
        title: "Access Denied",
        description: `You don't have permission to access this page.`,
        variant: "destructive",
      });
    }
  }, [requiredPermission, userHasAccess, isAuthenticated, location.pathname, toast]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to unauthorized page if missing required permission
  if (requiredPermission && !userHasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <VoiceAssistantProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Desktop sidebar */}
        <Sidebar />

        {/* Mobile sidebar */}
        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar onMenuClick={toggleMobileSidebar} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </VoiceAssistantProvider>
  );
};

export default MainLayout;
