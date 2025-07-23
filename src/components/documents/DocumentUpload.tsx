import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";

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

interface DocumentUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (document: TaxDocument) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ isOpen, onClose, onUpload }) => {
  const { speak } = useVoiceAssistant();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [documentName, setDocumentName] = useState("");
  const [category, setCategory] = useState<string>("income");
  const [taxYear, setTaxYear] = useState<string>("2023");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/zip'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name}: Invalid file type. Please use PDF, JPG, PNG, or ZIP files.`);
        return false;
      }
      
      if (file.size > maxSize) {
        toast.error(`${file.name}: File too large. Maximum size is 10MB.`);
        return false;
      }
      
      return true;
    });

    setSelectedFiles(validFiles);
    speak(`${validFiles.length} file${validFiles.length !== 1 ? 's' : ''} selected for upload.`);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    speak("File removed from upload queue.");
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file to upload.");
      return;
    }

    if (!documentName.trim()) {
      toast.error("Please enter a document name.");
      return;
    }

    setIsUploading(true);
    speak("Uploading documents. Please wait.");

    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));

    selectedFiles.forEach((file, index) => {
      const newDocument: TaxDocument = {
        id: Date.now().toString() + index,
        name: selectedFiles.length === 1 ? documentName : `${documentName} (${index + 1})`,
        type: file.type.split('/')[1].toUpperCase(),
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        uploadDate: new Date().toISOString().split('T')[0],
        category: category as "income" | "deduction" | "personal" | "other",
        taxYear,
        file
      };
      onUpload(newDocument);
    });

    toast.success(`${selectedFiles.length} document${selectedFiles.length !== 1 ? 's' : ''} uploaded successfully!`);
    speak(`Documents uploaded successfully. ${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''} added to your document library.`);
    
    // Reset form
    setSelectedFiles([]);
    setDocumentName("");
    setCategory("income");
    setTaxYear("2023");
    setIsUploading(false);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Tax Documents</DialogTitle>
          <DialogDescription>
            Upload your tax-related documents securely. Supported formats: PDF, JPG, PNG, ZIP (max 10MB each)
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* File Upload Area */}
          <div 
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files);
              const fakeEvent = { target: { files } } as any;
              handleFileSelect(fakeEvent);
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.zip"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">Click to browse or drag files here</p>
            <p className="text-xs text-muted-foreground">PDF, JPG, PNG, ZIP • Max 10MB per file</p>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Files:</Label>
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">({formatFileSize(file.size)})</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Document Name */}
          <div className="space-y-2">
            <Label htmlFor="document-name">Document Name *</Label>
            <Input
              id="document-name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="e.g., W-2 Form, 1099-INT, Mortgage Interest"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income Documents</SelectItem>
                <SelectItem value="deduction">Deduction Documents</SelectItem>
                <SelectItem value="personal">Personal Information</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tax Year */}
          <div className="space-y-2">
            <Label htmlFor="tax-year">Tax Year *</Label>
            <Select value={taxYear} onValueChange={setTaxYear}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isUploading || selectedFiles.length === 0}>
            {isUploading ? "Uploading..." : `Upload ${selectedFiles.length} File${selectedFiles.length !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUpload;