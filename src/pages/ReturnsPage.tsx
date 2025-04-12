
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, FileText, PenLine, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface TaxReturn {
  id: string;
  name: string;
  year: string;
  status: "draft" | "in_progress" | "submitted" | "approved";
  type: string;
  lastUpdated: string;
}

const ReturnsPage: React.FC = () => {
  const { user } = useAuth();
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
  ]);

  const [selectedReturn, setSelectedReturn] = useState<TaxReturn | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleDelete = (id: string) => {
    setReturns(returns.filter(r => r.id !== id));
    setIsDeleteDialogOpen(false);
    toast.success("Tax return deleted successfully");
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
          <h1 className="text-3xl font-bold tracking-tight">{isAdmin ? "All Tax Returns" : "My Tax Returns"}</h1>
          
          {!isSupport && (
            <Button onClick={() => window.location.href = "/filing"}>
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
                      onClick={() => window.location.href = `/filing?id=${taxReturn.id}`}
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
              <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
              {selectedReturn && canEdit(selectedReturn.status) && (
                <Button onClick={() => window.location.href = `/filing?id=${selectedReturn.id}`}>
                  Continue Filing
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
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button 
                variant="destructive" 
                onClick={() => selectedReturn && handleDelete(selectedReturn.id)}
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
