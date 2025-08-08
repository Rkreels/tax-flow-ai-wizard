
import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import IncomeStep from "./steps/IncomeStep";
import DeductionsStep from "./steps/DeductionsStep";
import ReviewStep from "./steps/ReviewStep";
import { useTaxFiling } from "@/hooks/useTaxFiling";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";
import { PersonalInfoForm, IncomeForm, DeductionsForm } from "@/utils/formValidation";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
const steps = [
  { title: "Personal Info", description: "Basic information" },
  { title: "Income", description: "Income sources" },
  { title: "Deductions", description: "Deductions & credits" },
  { title: "Review", description: "Review & submit" },
];

const TaxFilingWizard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const returnId = searchParams.get('id') || undefined;
  const { user } = useAuth();
  
  const {
    taxReturn,
    isLoading,
    currentStep,
    setCurrentStep,
    savePersonalInfo,
    saveIncome,
    saveDeductions,
    submitTaxReturn,
    calculateRefund,
    updateReturnName,
    isComplete
  } = useTaxFiling(returnId);
  
  const { speak } = useVoiceAssistant();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handlePersonalInfoSave = async (data: PersonalInfoForm) => {
    await savePersonalInfo(data);
    setCurrentStep(1);
  };

  const handleIncomeSave = async (data: IncomeForm) => {
    await saveIncome(data);
    setCurrentStep(2);
  };

  const handleDeductionsSave = async (data: DeductionsForm) => {
    await saveDeductions(data);
    setCurrentStep(3);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const success = await submitTaxReturn();
    if (success) {
      speak("Your tax return has been successfully submitted to the IRS. You will receive a confirmation email shortly.");
      // In a real app, redirect to a success page or dashboard
      setTimeout(() => {
        window.location.href = '/returns';
      }, 3000);
    }
    setIsSubmitting(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your tax return...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Tax Filing Wizard</h1>
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          <div className="w-72">
            <Input
              value={taxReturn?.name || ""}
              onChange={(e) => updateReturnName(e.target.value)}
              placeholder="Name this tax return"
            />
          </div>
        </div>
        
        <Progress value={progress} className="w-full" />
        
        <div className="flex justify-center">
          <div className="flex space-x-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col items-center space-y-2 ${
                  index <= currentStep
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    index < currentStep
                      ? "bg-primary border-primary text-primary-foreground"
                      : index === currentStep
                      ? "border-primary bg-background"
                      : "border-muted"
                  }`}
                >
                  {index < currentStep ? "✓" : index + 1}
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        {currentStep === 0 && (
          <PersonalInfoStep
            onNext={handleNext}
            onSave={handlePersonalInfoSave}
            initialData={taxReturn?.personalInfo}
          />
        )}
        {currentStep === 1 && (
          <IncomeStep
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSave={handleIncomeSave}
            initialData={taxReturn?.income}
          />
        )}
        {currentStep === 2 && (
          <DeductionsStep
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSave={handleDeductionsSave}
            initialData={taxReturn?.deductions}
          />
        )}
        {currentStep === 3 && (
          <ReviewStep
            onPrevious={handlePrevious}
            onSubmit={handleSubmit}
            personalInfo={taxReturn?.personalInfo || null}
            income={taxReturn?.income || null}
            deductions={taxReturn?.deductions || null}
            refundAmount={calculateRefund()}
            isSubmitting={isSubmitting}
            status={taxReturn?.status || 'draft'}
            userRole={user?.role || 'user'}
            requestedDocuments={taxReturn?.requestedDocuments || []}
          />
        )}
      </div>
    </div>
  );
};

export default TaxFilingWizard;
