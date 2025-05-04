
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, FileText, PenLine, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";
import { useLocation } from "react-router-dom";

interface TaxReturn {
  id: string;
  name: string;
  year: string;
  status: "draft" | "in_progress" | "submitted" | "approved";
  type: string;
  lastUpdated: string;
  clientId?: string;
  clientName?: string;
}

const ReturnsPage: React.FC = () => {
  const { user } = useAuth();
  const { speak } = useVoiceAssistant();
  const location = useLocation();
  
  const isAdmin = user?.role === "admin";
  const isAccountant = user?.role === "accountant";
  const isSupport = user?.role === "support";
  
  // Sample data - in a real app, this would come from an API
  const [returns, setReturns] = useState<TaxReturn[]>([
    {
      id: "1",
      name: "2023 Personal Tax Return",
      year: "2023",
      status: "in_progress",
      type: "Individual",
      lastUpdated: "2025-04-10"
    },
    {
      id: "2",
      name: "2022 Personal Tax Return",
      year: "2022",
      status: "submitted",
      type: "Individual",
      lastUpdated: "2024-03-15"
    },
    ...(isAccountant ? [
      {
        id: "client-ml",
        name: "2023 Individual Return",
        year: "2023",
        status: "in_progress",
        type: "Individual",
        lastUpdated: "2025-04-08",
        clientId: "client-ml",
        clientName: "Mary Lee"
      },
      {
        id: "client-rg",
        name: "2023 Schedule C Business",
        year: "2023",
        status: "submitted",
        type: "Business",
        lastUpdated: "2025-04-05",
        clientId: "client-rg",
        clientName: "Robert Garcia"
      },
      {
        id: "client-tw",
        name: "2023 Rental Income",
        year: "2023",
        status: "draft",
        type: "Schedule E",
        lastUpdated: "2025-04-02",
        clientId: "client-tw",
        clientName: "Tina Williams"
      }
    ] : [])
  ]);

  const [selectedReturn, setSelectedReturn] = useState<TaxReturn | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Provide voice guidance when the page loads
  React.useEffect(() => {
    const pageDescription = isAccountant ? 
      "Client tax returns page. Review and manage tax returns for your clients. You can view details, review returns, and track their status." :
      isAdmin ? 
      "All tax returns page. View and manage all users' tax returns. You have full access to view, edit, and delete returns." : 
      "My tax returns page. View and manage your personal tax returns. You can continue filing incomplete returns or check the status of submitted returns.";
    
    speak(pageDescription);
  }, [speak, isAdmin, isAccountant]);

  const handleDelete = (id: string) => {
    setReturns(returns.filter(r => r.id !== id));
    setIsDeleteDialogOpen(false);
    toast.success("Tax return deleted successfully");
    speak("Tax return deleted successfully.");
  };

  const handleReview = (taxReturn: TaxReturn) => {
    speak(`Opening ${taxReturn.clientName ? taxReturn.clientName + "'s" : "your"} ${taxReturn.year} ${taxReturn.type} return for ${isAccountant ? "review" : "filing"}.`);
    window.location.href = `/filing?id=${taxReturn.id}${taxReturn.clientId ? `&clientId=${taxReturn.clientId}` : ''}`;
  };

  const canEdit = (status: string) => {
    return status !== "approved" && (user?.role === "user" || isAdmin || isAccountant);
  };

  const canDelete = () => {
    return user?.role === "user" || isAdmin;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "submitted": return "bg-amber-100 text-amber-800";
      case "approved": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <MainLayout requiredPermission={isAdmin ? "view_all_returns" : 
                                 isAccountant ? "view_assigned_returns" : 
                                 isSupport ? "view_user_status" : "view_own_returns"}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            {isAdmin ? "All Tax Returns" : 
             isAccountant ? "Client Tax Returns" : 
             "My Tax Returns"}
          </h1>
          
          {!isSupport && (
            <Button 
              onClick={() => {
                speak("Creating a new tax return.");
                window.location.href = "/filing";
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> New Return
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {returns.map((taxReturn) => (
            <Card key={taxReturn.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                  {taxReturn.name}
                </CardTitle>
                {taxReturn.clientName && (
                  <CardDescription>
                    Client: {taxReturn.clientName}
                  </CardDescription>
                )}
                <CardDescription>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(taxReturn.status)}`}>
                    {taxReturn.status.replace("_", " ").toUpperCase()}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <p><span className="font-medium">Year:</span> {taxReturn.year}</p>
                <p><span className="font-medium">Type:</span> {taxReturn.type}</p>
                <p><span className="font-medium">Last Updated:</span> {taxReturn.lastUpdated}</p>
              </CardContent>
              <CardFooter className="flex justify-end border-t bg-muted/50 p-2">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      speak(`Viewing details for ${taxReturn.clientName ? taxReturn.clientName + "'s" : ""} ${taxReturn.year} ${taxReturn.type} return.`);
                      setSelectedReturn(taxReturn);
                      setIsViewDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  
                  {canEdit(taxReturn.status) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReview(taxReturn)}
                    >
                      <PenLine className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  )}
                  
                  {canDelete() && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => {
                        speak("Preparing to delete tax return. Please confirm this action.");
                        setSelectedReturn(taxReturn);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedReturn?.name}</DialogTitle>
              <DialogDescription>
                {selectedReturn?.clientName ? `Client: ${selectedReturn.clientName} - ` : ''}
                Return details for {selectedReturn?.year}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Year:</div>
                <div>{selectedReturn?.year}</div>
                <div className="font-medium">Status:</div>
                <div className="capitalize">{selectedReturn?.status.replace("_", " ")}</div>
                <div className="font-medium">Type:</div>
                <div>{selectedReturn?.type}</div>
                <div className="font-medium">Last Updated:</div>
                <div>{selectedReturn?.lastUpdated}</div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => {
                speak("Closing details view.");
                setIsViewDialogOpen(false);
              }}>Close</Button>
              {selectedReturn && canEdit(selectedReturn.status) && (
                <Button onClick={() => handleReview(selectedReturn)}>
                  {isAccountant ? "Review Return" : "Continue Filing"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Tax Return</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedReturn?.name}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                speak("Deletion canceled.");
                setIsDeleteDialogOpen(false);
              }}>Cancel</Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  if (selectedReturn) {
                    handleDelete(selectedReturn.id);
                  }
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default ReturnsPage;
