
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, FileText, Trash2, Upload, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";
import DocumentViewer from "@/components/documents/DocumentViewer";
import DocumentUpload from "@/components/documents/DocumentUpload";
import ProfileSettings from "@/components/profile/ProfileSettings";

interface TaxDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  category: "income" | "deduction" | "personal" | "other";
  taxYear: string;
  file?: File;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState<'profile' | 'documents'>('profile');
  const [documents, setDocuments] = useState<TaxDocument[]>([
    {
      id: "1",
      name: "W-2_2023_AcmeInc.pdf",
      type: "PDF",
      size: "245 KB",
      uploadDate: "2024-01-15",
      category: "income",
      taxYear: "2023"
    },
    {
      id: "2",
      name: "1099-INT_2023_FirstBank.pdf",
      type: "PDF",
      size: "123 KB",
      uploadDate: "2024-01-20",
      category: "income",
      taxYear: "2023"
    },
    {
      id: "3",
      name: "MortgageInterest_2023.pdf",
      type: "PDF",
      size: "189 KB",
      uploadDate: "2024-01-25",
      category: "deduction",
      taxYear: "2023"
    }
  ]);

  const [selectedDocument, setSelectedDocument] = useState<TaxDocument | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  React.useEffect(() => {
    speak(`${user?.name}'s profile page. Manage your personal information, notification preferences, and uploaded tax documents.`);
  }, [speak, user?.name]);

  const handleViewDocument = (document: TaxDocument) => {
    speak(`Opening ${document.name} for viewing.`);
    setSelectedDocument(document);
    setIsViewerOpen(true);
  };

  const handleDeleteDocument = (document: TaxDocument) => {
    speak(`Preparing to delete ${document.name}. Please confirm this action.`);
    setSelectedDocument(document);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedDocument) {
      setDocuments(documents.filter(doc => doc.id !== selectedDocument.id));
      toast.success("Document deleted successfully");
      speak(`${selectedDocument.name} has been deleted.`);
      setIsDeleteDialogOpen(false);
      setSelectedDocument(null);
    }
  };

  const handleUploadDocument = (document: TaxDocument) => {
    setDocuments([...documents, document]);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "income": return "bg-green-100 text-green-800";
      case "deduction": return "bg-blue-100 text-blue-800";
      case "personal": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) return null;

  return (
    <MainLayout requiredPermission="view_profile">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <Badge variant="outline" className="mt-1 capitalize">
                {user.role}
              </Badge>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b">
          <nav className="flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('profile');
                speak("Profile settings tab selected.");
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }`}
            >
              Profile Settings
            </button>
            <button
              onClick={() => {
                setActiveTab('documents');
                speak("Documents tab selected. View and manage your uploaded tax documents.");
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }`}
            >
              My Documents ({documents.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && <ProfileSettings />}

        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Documents</h2>
              <Button onClick={() => {
                speak("Opening document upload dialog.");
                setIsUploadOpen(true);
              }}>
                <Upload className="mr-2 h-4 w-4" /> Upload Document
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {documents.map((document) => (
                <Card key={document.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <Badge variant="outline" className={getCategoryColor(document.category)}>
                        {document.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{document.name}</CardTitle>
                    <CardDescription>
                      {document.type} • {document.size} • {document.taxYear}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-sm text-muted-foreground mb-3">
                      Uploaded: {document.uploadDate}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDocument(document)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDeleteDocument(document)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {documents.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No documents uploaded</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Upload your tax documents to keep them organized and easily accessible.
                  </p>
                  <Button onClick={() => setIsUploadOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" /> Upload Your First Document
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Document Viewer Modal */}
        <DocumentViewer
          document={selectedDocument}
          isOpen={isViewerOpen}
          onClose={() => {
            speak("Closing document viewer.");
            setIsViewerOpen(false);
          }}
        />

        {/* Document Upload Modal */}
        <DocumentUpload
          isOpen={isUploadOpen}
          onClose={() => {
            speak("Closing document upload dialog.");
            setIsUploadOpen(false);
          }}
          onUpload={handleUploadDocument}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Document</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedDocument?.name}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                speak("Document deletion canceled.");
                setIsDeleteDialogOpen(false);
              }}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
