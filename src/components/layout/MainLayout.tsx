
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";

interface MainLayoutProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, requiredPermission }) => {
  const { isAuthenticated, isLoading, hasPermission, user } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  const { speak } = useVoiceAssistant();
  
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Check if user has required permission - accountants should have access to returns page
  const userHasAccess = !requiredPermission || 
                        hasPermission(requiredPermission) || 
                        (user?.role === "accountant" && 
                         (location.pathname === "/returns" || 
                          location.pathname === "/filing" ||
                          location.pathname === "/documents" ||
                          location.pathname === "/analytics"));

  // Announce permission issues with voice assistant
  useEffect(() => {
    if (isAuthenticated && requiredPermission && !userHasAccess) {
      speak(`Access denied. You don't have permission to access this page. Your role is ${user?.role}, which doesn't have the required ${requiredPermission} permission.`);
      
      toast({
        title: "Access Denied",
        description: `You don't have permission to access this page.`,
        variant: "destructive",
      });
    }
  }, [requiredPermission, userHasAccess, isAuthenticated, location.pathname, toast, speak, user?.role]);

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
  );
};

export default MainLayout;
