
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowDown, Download, Printer } from "lucide-react";
import { toast } from "sonner";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";

interface ReviewStepProps {
  onPrevious: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ onPrevious }) => {
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    speak("Review and submit step. Please review your tax return summary, personal information, income, and deductions before submitting. Your estimated refund is $5,018.");
  }, [speak]);

  const handlePrintPreview = () => {
    speak("Opening print preview of your tax return.");
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Tax Return - Print Preview</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
              .section { margin-bottom: 20px; }
              .summary { background: #f8f9fa; padding: 15px; border-radius: 8px; }
              .highlight { background: #e8f5e9; padding: 10px; border-radius: 4px; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>2023 Tax Return Summary</h1>
              <h2>John Doe</h2>
            </div>
            <div class="section summary">
              <h3>Tax Summary</h3>
              <p><strong>Total Income:</strong> $72,350.00</p>
              <p><strong>Adjusted Gross Income:</strong> $71,150.00</p>
              <p><strong>Taxable Income:</strong> $57,300.00</p>
              <p><strong>Federal Tax:</strong> $9,382.00</p>
              <p><strong>Tax Already Paid:</strong> $14,400.00</p>
              <div class="highlight">
                <p><strong>Your Refund: $5,018.00</strong></p>
              </div>
            </div>
            <div class="section">
              <h3>Personal Information</h3>
              <p>Name: John Doe</p>
              <p>SSN: XXX-XX-6789</p>
              <p>Filing Status: Single</p>
              <p>Address: 123 Main St, San Francisco, CA 94105</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    
    toast.success("Print preview opened");
    speak("Print preview has been opened in a new window.");
  };

  const handleDownloadPDF = () => {
    speak("Downloading your tax return as a PDF file.");
    
    // Create a downloadable file
    const content = `TAX RETURN SUMMARY 2023
======================

TAXPAYER INFORMATION
Name: John Doe
SSN: XXX-XX-6789
Filing Status: Single
Address: 123 Main St, San Francisco, CA 94105

INCOME SUMMARY
Total Income: $72,350.00
Wages (W-2): $72,000.00
Interest (1099-INT): $350.00

TAX CALCULATION
Adjusted Gross Income: $71,150.00
Standard Deduction: $13,850.00
Taxable Income: $57,300.00
Federal Tax: $9,382.00
Tax Already Paid: $14,400.00

REFUND: $5,018.00

Generated on: ${new Date().toLocaleDateString()}
`;
    
    const element = window.document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'Tax_Return_2023_Summary.txt';
    window.document.body.appendChild(element);
    element.click();
    window.document.body.removeChild(element);
    
    toast.success("Tax return PDF downloaded");
    speak("Your tax return summary has been downloaded to your device.");
  };

  const handleSaveForLater = () => {
    speak("Saving your tax return for later completion.");
    
    // Simulate saving
    setTimeout(() => {
      toast.success("Tax return saved successfully");
      speak("Your tax return has been saved. You can continue from where you left off later.");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Review & Submit</h2>
        <p className="text-sm text-muted-foreground">
          Review your tax return before final submission.
        </p>
      </div>

      <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Tax Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Federal Filing Status</span>
              <span className="font-medium">Single</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Income</span>
              <span className="font-medium">$72,350.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Adjustments</span>
              <span className="font-medium">-$1,200.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Adjusted Gross Income</span>
              <span className="font-medium">$71,150.00</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">Standard Deduction</span>
              <span className="font-medium">-$13,850.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Taxable Income</span>
              <span className="font-medium">$57,300.00</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">Federal Tax</span>
              <span className="font-medium">$9,382.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Credits</span>
              <span className="font-medium">-$0.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Tax Already Paid</span>
              <span className="font-medium">-$14,400.00</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Your Refund</span>
              <span className="text-green-600 dark:text-green-400">$5,018.00</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="space-y-2">
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Name:</span>
                <span>John Doe</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">SSN:</span>
                <span>XXX-XX-6789</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Filing Status:</span>
                <span>Single</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Address:</span>
                <span>123 Main St, San Francisco, CA 94105</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Income</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="space-y-2">
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Wages (W-2):</span>
                <span>$72,000.00</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Interest (1099-INT):</span>
                <span>$350.00</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Other Income:</span>
                <span>$0.00</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Total Income:</span>
                <span className="font-medium">$72,350.00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Deductions & Credits</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="space-y-2">
            <div className="grid grid-cols-2">
              <span className="text-muted-foreground">Deduction Type:</span>
              <span>Standard Deduction</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-muted-foreground">Deduction Amount:</span>
              <span>$13,850.00</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-muted-foreground">Credits:</span>
              <span>None claimed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md bg-amber-50 dark:bg-amber-900/20 p-4">
        <h3 className="text-base font-medium text-amber-800 dark:text-amber-300 mb-2">Next Steps</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-amber-700 dark:text-amber-300">
          <li>Submit your return electronically</li>
          <li>Set up direct deposit for faster refund</li>
          <li>Save a copy of your return for your records</li>
          <li>Track your refund status after submission</li>
        </ul>
      </div>

      <div className="flex flex-wrap gap-3 justify-center pt-2">
        <Button variant="outline" size="sm" onClick={handlePrintPreview}>
          <Printer className="mr-2 h-4 w-4" /> Print Preview
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
          <Download className="mr-2 h-4 w-4" /> Download PDF
        </Button>
        <Button variant="outline" size="sm" onClick={handleSaveForLater}>
          <ArrowDown className="mr-2 h-4 w-4" /> Save for Later
        </Button>
      </div>

      <div className="pt-4 flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Back to Deductions
        </Button>
        <Button className="bg-green-600 hover:bg-green-700">
          Submit Tax Return
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;
