import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileText } from "lucide-react";
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

interface DocumentViewerProps {
  document: TaxDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, isOpen, onClose }) => {
  const { speak } = useVoiceAssistant();

  if (!document) return null;

  const handleDownload = () => {
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

  const handlePreview = () => {
    speak("Opening document preview.");
    
    if (document.file) {
      const url = URL.createObjectURL(document.file);
      window.open(url, '_blank');
    } else {
      // For demo documents, show a preview window
      const previewWindow = window.open('', '_blank');
      if (previewWindow) {
        previewWindow.document.write(`
          <html>
            <head>
              <title>${document.name} - Preview</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                .content { line-height: 1.6; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Document Preview: ${document.name}</h1>
                <p><strong>Type:</strong> ${document.type} | <strong>Size:</strong> ${document.size}</p>
                <p><strong>Category:</strong> ${document.category} | <strong>Tax Year:</strong> ${document.taxYear}</p>
                <p><strong>Upload Date:</strong> ${document.uploadDate}</p>
              </div>
              <div class="content">
                <h2>Document Contents</h2>
                <p>This is a preview of the ${document.name} document.</p>
                <p>In a real application, this would show the actual document content.</p>
                <p>Document details:</p>
                <ul>
                  <li>Category: ${document.category.charAt(0).toUpperCase() + document.category.slice(1)}</li>
                  <li>Tax Year: ${document.taxYear}</li>
                  <li>File Type: ${document.type}</li>
                  <li>Uploaded: ${document.uploadDate}</li>
                </ul>
              </div>
            </body>
          </html>
        `);
        previewWindow.document.close();
      }
    }
  };

  const getDocumentIcon = () => {
    switch (document.type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-16 w-16 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FileText className="h-16 w-16 text-blue-500" />;
      case 'zip':
        return <FileText className="h-16 w-16 text-amber-500" />;
      default:
        return <FileText className="h-16 w-16 text-gray-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Document Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Document Icon and Basic Info */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {getDocumentIcon()}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{document.name}</h3>
              <p className="text-sm text-muted-foreground">{document.type} • {document.size}</p>
            </div>
          </div>
          
          {/* Document Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">Category:</span>
              <p className="mt-1 capitalize">{document.category}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Tax Year:</span>
              <p className="mt-1">{document.taxYear}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Upload Date:</span>
              <p className="mt-1">{document.uploadDate}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">File Size:</span>
              <p className="mt-1">{document.size}</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button onClick={handlePreview} variant="outline" className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleDownload} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;