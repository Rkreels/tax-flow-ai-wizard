
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Save, CheckCircle2, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import IncomeStep from "./steps/IncomeStep";
import DeductionsStep from "./steps/DeductionsStep";
import ReviewStep from "./steps/ReviewStep";

export type TaxFilingStep = "personal" | "income" | "deductions" | "review";

const steps: { id: TaxFilingStep; label: string }[] = [
  { id: "personal", label: "Personal Information" },
  { id: "income", label: "Income" },
  { id: "deductions", label: "Deductions" },
  { id: "review", label: "Review & Submit" },
];

const TaxFilingWizard: React.FC = () => {
  const { speak } = useVoiceAssistant();
  const [currentStep, setCurrentStep] = useState<TaxFilingStep>("personal");
  const [completedSteps, setCompletedSteps] = useState<Set<TaxFilingStep>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Provide voice guidance when component mounts
  useEffect(() => {
    speak("Welcome to the tax filing wizard. Complete each step to file your tax return. You are currently on the personal information step.");
  }, [speak]);

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  const handleNext = () => {
    // Mark current step as completed
    const newCompletedSteps = new Set(completedSteps);
    newCompletedSteps.add(currentStep);
    setCompletedSteps(newCompletedSteps);

    // Move to the next step
    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      setCurrentStep(nextStep.id);
      speak(`Moving to ${nextStep.label} step.`);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      const prevStep = steps[currentStepIndex - 1];
      setCurrentStep(prevStep.id);
      speak(`Going back to ${prevStep.label} step.`);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    speak("Saving your tax return progress.");
    
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Tax return saved successfully");
    speak("Your tax return has been saved. You can continue filing later from where you left off.");
    setIsSaving(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    speak("Submitting your tax return to the IRS. Please wait.");
    
    // Simulate submission process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    toast.success("Tax return submitted successfully!");
    speak("Congratulations! Your tax return has been successfully submitted to the IRS. You will receive a confirmation email shortly.");
    setIsSubmitting(false);
  };

  const handleHelp = () => {
    speak("Opening tax assistant for help. You can ask questions about tax filing, deductions, or any step in the process.");
    // In a real app, this would open the tax assistant
    toast.info("Tax assistant is available to help you with any questions");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "personal":
        return <PersonalInfoStep onNext={handleNext} />;
      case "income":
        return <IncomeStep onNext={handleNext} onPrevious={handlePrevious} />;
      case "deductions":
        return <DeductionsStep onNext={handleNext} onPrevious={handlePrevious} />;
      case "review":
        return <ReviewStep onPrevious={handlePrevious} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">File Your Tax Return</h1>
        <p className="text-muted-foreground">Complete each step to file your tax return.</p>
      </div>

      <div className="relative mb-8">
        <div className="absolute left-0 right-0 h-1 top-5 bg-gray-200 dark:bg-gray-700"></div>
        <div
          className="absolute left-0 h-1 top-5 bg-gradient-to-r from-taxBlue-600 to-taxTeal-500"
          style={{
            width: `${((currentStepIndex + 0.5) / steps.length) * 100}%`,
            transition: "width 0.5s ease-in-out",
          }}
        ></div>
        <div className="relative flex justify-between items-center">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = completedSteps.has(step.id);
            const isPending = index > currentStepIndex && !isCompleted;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`h-10 w-10 flex items-center justify-center rounded-full border-2 z-10 ${
                    isActive
                      ? "border-taxBlue-600 bg-white text-taxBlue-600 dark:bg-gray-900 dark:text-blue-400"
                      : isCompleted
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-300 bg-white text-gray-400 dark:bg-gray-800 dark:border-gray-600"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isActive
                      ? "text-taxBlue-600 dark:text-blue-400"
                      : isPending
                      ? "text-gray-400 dark:text-gray-500"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardContent className="p-6">{renderStepContent()}</CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="mr-2 h-4 w-4" /> 
            {isSaving ? "Saving..." : "Save for Later"}
          </Button>
          
          {currentStep !== "review" && (
            <Button onClick={handleNext}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          
          {currentStep === "review" && (
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Return"} 
              <CheckCircle2 className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={handleHelp}>
                <HelpCircle className="mr-2 h-4 w-4" /> Need help?
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Chat with our tax assistant for help</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default TaxFilingWizard;
