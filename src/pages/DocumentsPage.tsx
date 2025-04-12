
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Download, EyeIcon, FileText, MoreVertical, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  category: "income" | "deduction" | "personal" | "other";
  taxYear: string;
}

const DocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  
  // Sample documents data
  const [documents, setDocuments] = useState<Document[]>([
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
    setDocuments(documents.filter(doc => doc.id !== id));
    toast.success("Document deleted successfully");
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

  const handleUpload = () => {
    setIsUploadDialogOpen(false);
    toast.success("Document uploaded successfully");
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
            <Button onClick={() => setIsUploadDialogOpen(true)}>
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
                    />
                  ))
                }
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Upload Document Dialog */}
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Upload tax-related documents to your account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="border rounded-md border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 p-6">
                <div className="rounded-full bg-gray-100 p-3">
                  <Upload className="h-6 w-6 text-gray-500" />
                </div>
                <p className="text-sm text-center font-medium">Drag and drop files here or click to browse</p>
                <p className="text-xs text-center text-gray-500">Supports: PDF, JPG, PNG, ZIP (max 10MB)</p>
                <Button size="sm" variant="outline" className="mt-2">Browse Files</Button>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="document-name" className="text-sm font-medium">Document Name</label>
                <Input id="document-name" placeholder="My tax document" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="document-category" className="text-sm font-medium">Category</label>
                <select
                  id="document-category"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="income">Income</option>
                  <option value="deduction">Deduction</option>
                  <option value="personal">Personal</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="tax-year" className="text-sm font-medium">Tax Year</label>
                <select
                  id="tax-year"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpload}>Upload</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

interface DocumentCardProps {
  document: Document;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, isSelected, onToggleSelect, onDelete }) => {
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
              <DropdownMenuItem>
                <EyeIcon className="mr-2 h-4 w-4" />
                <span>View</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
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
