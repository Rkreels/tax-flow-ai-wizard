
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./pages/Unauthorized";
import TaxFilingPage from "./pages/TaxFilingPage";
import AssistantPage from "./pages/AssistantPage";
import NotFound from "./pages/NotFound";
import ReturnsPage from "./pages/ReturnsPage";
import ProfilePage from "./pages/ProfilePage";
import DocumentsPage from "./pages/DocumentsPage";
import HelpPage from "./pages/HelpPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import TaxRulesPage from "./pages/TaxRulesPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import RequestsPage from "./pages/RequestsPage";
import KnowledgeBasePage from "./pages/KnowledgeBasePage";
import React from "react";

// Create a client
const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/filing" element={<TaxFilingPage />} />
              <Route path="/assistant" element={<AssistantPage />} />
              <Route path="/returns" element={<ReturnsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/tax-rules" element={<TaxRulesPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/requests" element={<RequestsPage />} />
              <Route path="/knowledge" element={<KnowledgeBasePage />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
