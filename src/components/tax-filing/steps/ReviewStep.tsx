
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowDown, Download, Printer } from "lucide-react";
import { toast } from "sonner";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";
import { PersonalInfoForm, IncomeForm, DeductionsForm } from "@/utils/formValidation";

interface ReviewStepProps {
  onPrevious: () => void;
  onSubmit: () => void;
  personalInfo: PersonalInfoForm | null;
  income: IncomeForm | null;
  deductions: DeductionsForm | null;
  refundAmount: number;
  isSubmitting: boolean;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ 
  onPrevious, 
  onSubmit, 
  personalInfo, 
  income, 
  deductions,
  refundAmount,
  isSubmitting
}) => {
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    const refundText = refundAmount > 0 ? `Your estimated refund is $${refundAmount.toLocaleString()}` : `You owe $${Math.abs(refundAmount).toLocaleString()}`;
    speak(`Review and submit step. Please review your tax return summary, personal information, income, and deductions before submitting. ${refundText}.`);
  }, [speak, refundAmount]);

  if (!personalInfo || !income || !deductions) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Incomplete Tax Return</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Please complete all previous steps before reviewing your return.
          </p>
          <Button className="mt-4" onClick={onPrevious}>
            Back to Previous Step
          </Button>
        </div>
      </div>
    );
  }

  const totalIncome = income.wages + income.interestIncome;
  const standardDeduction = 13850;
  const deductionAmount = deductions.deductionMethod === 'standard' ? standardDeduction : 
    (deductions.medicalExpenses || 0) + 
    (deductions.stateLocalTax || 0) + 
    (deductions.realEstateTax || 0) + 
    (deductions.mortgageInterest || 0) + 
    (deductions.charitableCash || 0) + 
    (deductions.charitableNonCash || 0);
  
  const adjustedGrossIncome = totalIncome;
  const taxableIncome = Math.max(0, adjustedGrossIncome - deductionAmount);
  const federalTax = taxableIncome * 0.22; // Simplified calculation
  const finalRefund = income.federalWithheld - federalTax;

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
              <h2>${personalInfo.firstName} ${personalInfo.lastName}</h2>
            </div>
            <div class="section summary">
              <h3>Tax Summary</h3>
              <p><strong>Total Income:</strong> $${totalIncome.toLocaleString()}</p>
              <p><strong>Adjusted Gross Income:</strong> $${adjustedGrossIncome.toLocaleString()}</p>
              <p><strong>Taxable Income:</strong> $${taxableIncome.toLocaleString()}</p>
              <p><strong>Federal Tax:</strong> $${federalTax.toLocaleString()}</p>
              <p><strong>Tax Already Paid:</strong> $${income.federalWithheld.toLocaleString()}</p>
              <div class="highlight">
                <p><strong>${finalRefund >= 0 ? 'Your Refund' : 'Amount Owed'}: $${Math.abs(finalRefund).toLocaleString()}</strong></p>
              </div>
            </div>
            <div class="section">
              <h3>Personal Information</h3>
              <p>Name: ${personalInfo.firstName} ${personalInfo.lastName}</p>
              <p>SSN: XXX-XX-${personalInfo.ssn.slice(-4)}</p>
              <p>Filing Status: ${personalInfo.filingStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              <p>Address: ${personalInfo.street}, ${personalInfo.city}, ${personalInfo.state} ${personalInfo.zipCode}</p>
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
    
    const content = `TAX RETURN SUMMARY 2023
======================

TAXPAYER INFORMATION
Name: ${personalInfo.firstName} ${personalInfo.lastName}
SSN: XXX-XX-${personalInfo.ssn.slice(-4)}
Filing Status: ${personalInfo.filingStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
Address: ${personalInfo.street}, ${personalInfo.city}, ${personalInfo.state} ${personalInfo.zipCode}

INCOME SUMMARY
Total Income: $${totalIncome.toLocaleString()}
Wages (W-2): $${income.wages.toLocaleString()}
Interest (1099-INT): $${income.interestIncome.toLocaleString()}

TAX CALCULATION
Adjusted Gross Income: $${adjustedGrossIncome.toLocaleString()}
${deductions.deductionMethod === 'standard' ? 'Standard' : 'Itemized'} Deduction: $${deductionAmount.toLocaleString()}
Taxable Income: $${taxableIncome.toLocaleString()}
Federal Tax: $${federalTax.toLocaleString()}
Tax Already Paid: $${income.federalWithheld.toLocaleString()}

${finalRefund >= 0 ? 'REFUND' : 'AMOUNT OWED'}: $${Math.abs(finalRefund).toLocaleString()}

Generated on: ${new Date().toLocaleDateString()}
`;
    
    const element = window.document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Tax_Return_2023_${personalInfo.firstName}_${personalInfo.lastName}.txt`;
    window.document.body.appendChild(element);
    element.click();
    window.document.body.removeChild(element);
    
    toast.success("Tax return summary downloaded");
    speak("Your tax return summary has been downloaded to your device.");
  };

  const handleSaveForLater = () => {
    speak("Your tax return has already been saved automatically.");
    toast.success("Tax return is automatically saved");
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
              <span className="font-medium">{personalInfo.filingStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Income</span>
              <span className="font-medium">${totalIncome.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Adjusted Gross Income</span>
              <span className="font-medium">${adjustedGrossIncome.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">{deductions.deductionMethod === 'standard' ? 'Standard' : 'Itemized'} Deduction</span>
              <span className="font-medium">-${deductionAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Taxable Income</span>
              <span className="font-medium">${taxableIncome.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">Federal Tax</span>
              <span className="font-medium">${federalTax.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Tax Already Paid</span>
              <span className="font-medium">-${income.federalWithheld.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-lg font-bold">
              <span>{finalRefund >= 0 ? 'Your Refund' : 'Amount Owed'}</span>
              <span className={finalRefund >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                ${Math.abs(finalRefund).toLocaleString()}
              </span>
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
                <span>{personalInfo.firstName} {personalInfo.lastName}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">SSN:</span>
                <span>XXX-XX-{personalInfo.ssn.slice(-4)}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Filing Status:</span>
                <span>{personalInfo.filingStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Address:</span>
                <span>{personalInfo.street}, {personalInfo.city}, {personalInfo.state} {personalInfo.zipCode}</span>
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
                <span>${income.wages.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Interest (1099-INT):</span>
                <span>${income.interestIncome.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Total Income:</span>
                <span className="font-medium">${totalIncome.toLocaleString()}</span>
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
              <span>{deductions.deductionMethod === 'standard' ? 'Standard Deduction' : 'Itemized Deductions'}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-muted-foreground">Deduction Amount:</span>
              <span>${deductionAmount.toLocaleString()}</span>
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
        <Button variant="outline" onClick={onPrevious} disabled={isSubmitting}>
          Back to Deductions
        </Button>
        <Button 
          className="bg-green-600 hover:bg-green-700" 
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Tax Return"}
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;
