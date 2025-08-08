
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Printer, Save, Send, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";
import { useAuth } from "@/contexts/AuthContext";

interface TaxReturn {
  id: string;
  name: string;
  year: string;
  status: "draft" | "in_progress" | "submitted" | "approved" | "needs_info" | "resubmitted";
  type: string;
  lastUpdated: string;
  ownerName?: string;
}


interface TaxReturnActionsProps {
  taxReturn: TaxReturn;
  onSave?: (id: string) => void;
  onSubmit?: (id: string) => void;
}

const TaxReturnActions: React.FC<TaxReturnActionsProps> = ({ taxReturn, onSave, onSubmit }) => {
  const { speak } = useVoiceAssistant();
  const { user } = useAuth();
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    speak(`Saving ${taxReturn.ownerName ? taxReturn.ownerName + "'s" : "your"} ${taxReturn.year} tax return.`);
    
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave?.(taxReturn.id);
    toast.success("Tax return saved successfully");
    speak("Tax return saved successfully.");
    setIsSaving(false);
  };

  const handlePrint = () => {
    speak(`Preparing to print ${taxReturn.ownerName ? taxReturn.ownerName + "'s" : "your"} ${taxReturn.year} tax return.`);
    
    // Create a print-friendly version
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${taxReturn.name} - Print Version</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
              .section { margin-bottom: 20px; }
              .label { font-weight: bold; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Tax Return Summary</h1>
              <h2>${taxReturn.name}</h2>
            </div>
            <div class="section">
              <p><span class="label">Tax Year:</span> ${taxReturn.year}</p>
              <p><span class="label">Return Type:</span> ${taxReturn.type}</p>
              <p><span class="label">Status:</span> ${taxReturn.status.replace("_", " ").toUpperCase()}</p>
              <p><span class="label">Last Updated:</span> ${taxReturn.lastUpdated}</p>
              ${taxReturn.ownerName ? `<p><span class="label">Client:</span> ${taxReturn.ownerName}</p>` : ''}
            </div>
            <div class="section">
              <h3>Return Details</h3>
              <p>This is a summary of the tax return. The complete return would include all forms, schedules, and supporting documentation.</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    
    toast.success("Print dialog opened");
    speak("Print dialog has been opened.");
  };

  const handleDownload = () => {
    speak(`Downloading ${taxReturn.ownerName ? taxReturn.ownerName + "'s" : "your"} ${taxReturn.year} tax return as PDF.`);
    
    // Simulate download
    const element = document.createElement('a');
    const file = new Blob([`Tax Return: ${taxReturn.name}\nYear: ${taxReturn.year}\nType: ${taxReturn.type}\nStatus: ${taxReturn.status}`], 
      { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${taxReturn.name.replace(/\s+/g, '_')}_${taxReturn.year}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast.success("Tax return downloaded");
    speak("Tax return has been downloaded to your device.");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    speak(`Submitting ${taxReturn.ownerName ? taxReturn.ownerName + "'s" : "your"} ${taxReturn.year} tax return to the IRS.`);
    
    // Simulate submit operation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onSubmit?.(taxReturn.id);
    toast.success("Tax return submitted successfully");
    speak("Tax return has been successfully submitted to the IRS. You will receive a confirmation shortly.");
    setIsSubmitting(false);
    setIsSubmitDialogOpen(false);
  };

  const canSubmit = (taxReturn.status === "in_progress" || taxReturn.status === "needs_info") && (user?.role === "user" || user?.role === "admin" || user?.role === "accountant");

  return (
    <div className="flex space-x-2">
      <Button
        size="sm"
        variant="outline"
        onClick={handleSave}
        disabled={isSaving}
      >
        <Save className="h-4 w-4 mr-1" />
        {isSaving ? "Saving..." : "Save"}
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={handlePrint}
      >
        <Printer className="h-4 w-4 mr-1" />
        Print
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={handleDownload}
      >
        <Download className="h-4 w-4 mr-1" />
        Download
      </Button>
      
      {canSubmit && (
        <Button
          size="sm"
          onClick={() => setIsSubmitDialogOpen(true)}
          disabled={isSubmitting}
        >
          <Send className="h-4 w-4 mr-1" />
          Submit
        </Button>
      )}

      {/* Submit Confirmation Dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Tax Return</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit {taxReturn.name} to the IRS? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit to IRS"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaxReturnActions;
