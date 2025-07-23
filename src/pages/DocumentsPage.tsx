
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Download, EyeIcon, FileText, MoreVertical, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";
import DocumentUpload from "@/components/documents/DocumentUpload";
import DocumentViewer from "@/components/documents/DocumentViewer";

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

const DocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const { speak } = useVoiceAssistant();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [viewingDocument, setViewingDocument] = useState<TaxDocument | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  
  // Sample documents data
  const [documents, setDocuments] = useState<TaxDocument[]>([
    {
      id: "1",
      name: "W-2 Form.pdf",
      type: "PDF",
      size: "1.2 MB",
      uploadDate: "2025-04-10",
      category: "income",
      taxYear: "2023"
    },
    {
      id: "2",
      name: "1099-INT.pdf",
      type: "PDF",
      size: "843 KB",
      uploadDate: "2025-04-08",
      category: "income",
      taxYear: "2023"
    },
    {
      id: "3",
      name: "Mortgage Interest Statement.pdf",
      type: "PDF",
      size: "1.5 MB",
      uploadDate: "2025-04-07",
      category: "deduction",
      taxYear: "2023"
    },
    {
      id: "4",
      name: "Charitable Donation Receipts.zip",
      type: "ZIP",
      size: "4.2 MB",
      uploadDate: "2025-04-05",
      category: "deduction",
      taxYear: "2023"
    },
    {
      id: "5",
      name: "Social Security Card.jpg",
      type: "JPG",
      size: "1.8 MB",
      uploadDate: "2025-03-20",
      category: "personal",
      taxYear: "2023"
    },
    {
      id: "6",
      name: "Driver's License.jpg",
      type: "JPG",
      size: "2.1 MB",
      uploadDate: "2025-03-15",
      category: "personal",
      taxYear: "2023"
    }
  ]);

  const handleDeleteDocument = (id: string) => {
    const doc = documents.find(d => d.id === id);
    setDocuments(documents.filter(doc => doc.id !== id));
    toast.success("Document deleted successfully");
    speak(`${doc?.name || 'Document'} deleted successfully.`);
  };

  const handleDeleteSelected = () => {
    setDocuments(documents.filter(doc => !selectedDocuments.includes(doc.id)));
    setSelectedDocuments([]);
    toast.success(`${selectedDocuments.length} documents deleted successfully`);
  };

  const handleToggleSelect = (id: string) => {
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(selectedDocuments.filter(docId => docId !== id));
    } else {
      setSelectedDocuments([...selectedDocuments, id]);
    }
  };

  const handleUpload = (newDocument: TaxDocument) => {
    setDocuments(prev => [...prev, newDocument]);
  };

  const handleViewDocument = (document: TaxDocument) => {
    setViewingDocument(document);
    setIsViewerOpen(true);
    speak(`Opening ${document.name} for viewing.`);
  };

  const handleDownloadDocument = (document: TaxDocument) => {
    speak(`Downloading ${document.name}.`);
    
    // Create a blob URL for download
    if (document.file) {
      const url = URL.createObjectURL(document.file);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Simulate download for demo documents
      const element = window.document.createElement('a');
      const file = new Blob([`This is a demo ${document.name} document for tax year ${document.taxYear}`], 
        { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = document.name;
      window.document.body.appendChild(element);
      element.click();
      window.document.body.removeChild(element);
    }
    
    toast.success("Document downloaded successfully");
    speak("Document downloaded to your device.");
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf": return "📄";
      case "jpg": return "🖼️";
      case "zip": return "🗃️";
      default: return "📄";
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || doc.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <MainLayout requiredPermission="upload_documents">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Documents</h1>
          
          <div className="flex space-x-2">
            {selectedDocuments.length > 0 && (
              <Button variant="outline" onClick={handleDeleteSelected}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected ({selectedDocuments.length})
              </Button>
            )}
            <Button onClick={() => {
              speak("Opening document upload dialog.");
              setIsUploadDialogOpen(true);
            }}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <Input
            className="w-full md:max-w-sm"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="deduction">Deductions</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredDocuments.map((doc) => (
                <DocumentCard 
                  key={doc.id}
                  document={doc}
                  isSelected={selectedDocuments.includes(doc.id)}
                  onToggleSelect={handleToggleSelect}
                  onDelete={handleDeleteDocument}
                  onView={handleViewDocument}
                  onDownload={handleDownloadDocument}
                />
              ))}
            </div>
          </TabsContent>
          
          {["income", "deduction", "personal", "other"].map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredDocuments
                  .filter(doc => doc.category === category)
                  .map((doc) => (
                    <DocumentCard 
                      key={doc.id}
                      document={doc}
                      isSelected={selectedDocuments.includes(doc.id)}
                      onToggleSelect={handleToggleSelect}
                      onDelete={handleDeleteDocument}
                      onView={handleViewDocument}
                      onDownload={handleDownloadDocument}
                    />
                  ))
                }
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Upload Document Dialog */}
        <DocumentUpload
          isOpen={isUploadDialogOpen}
          onClose={() => setIsUploadDialogOpen(false)}
          onUpload={handleUpload}
        />

        {/* Document Viewer */}
        <DocumentViewer
          document={viewingDocument}
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
        />
      </div>
    </MainLayout>
  );
};

interface DocumentCardProps {
  document: TaxDocument;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (document: TaxDocument) => void;
  onDownload: (document: TaxDocument) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, isSelected, onToggleSelect, onDelete, onView, onDownload }) => {
  const getDocumentTypeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf": return "bg-red-100 text-red-700";
      case "jpg": return "bg-blue-100 text-blue-700";
      case "zip": return "bg-amber-100 text-amber-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };
  
  return (
    <Card className={`overflow-hidden ${isSelected ? "ring-2 ring-primary" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(document.id)}
              className="mr-2 rounded border-gray-300"
            />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getDocumentTypeClass(document.type)}`}>
              <FileText className="h-4 w-4" />
            </div>
            <div className="ml-2">
              <CardTitle className="text-base">{document.name}</CardTitle>
              <CardDescription className="text-xs">{document.type} • {document.size}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(document)}>
                <EyeIcon className="mr-2 h-4 w-4" />
                <span>View</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload(document)}>
                <Download className="mr-2 h-4 w-4" />
                <span>Download</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(document.id)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Uploaded on: {document.uploadDate}</span>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            {document.taxYear}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsPage;
