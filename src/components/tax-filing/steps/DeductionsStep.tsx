
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle, Check, LightbulbIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";

interface DeductionsStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

const DeductionsStep: React.FC<DeductionsStepProps> = ({ onNext, onPrevious }) => {
  const { speak } = useVoiceAssistant();
  const [deductionMethod, setDeductionMethod] = useState<"standard" | "itemized">("standard");

  useEffect(() => {
    speak("Deductions and Credits step loaded. Choose between standard deduction or itemize your deductions for potentially greater tax savings.");
  }, [speak]);
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Deductions & Credits</h2>
        <p className="text-sm text-muted-foreground">
          Maximize your tax savings with deductions and credits.
        </p>
      </div>

      <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20">
        <CardHeader className="pb-2">
          <div className="flex items-start space-x-2">
            <LightbulbIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <CardTitle className="text-blue-800 dark:text-blue-300 text-base">AI Tax Assistant Suggestion</CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-400">
                Based on your profile, we recommend the following:
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-blue-700 dark:text-blue-300">
          <p>The standard deduction ($13,850) is likely better for you than itemizing, as your potential itemized deductions are estimated at $11,200.</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Label className="text-base font-medium">Choose your deduction method</Label>
        <div className="grid gap-4 md:grid-cols-2">
          <div 
            className={`relative rounded-lg border p-4 cursor-pointer ${
              deductionMethod === "standard" 
                ? "border-taxBlue-600 bg-taxBlue-50 dark:border-taxBlue-500 dark:bg-taxBlue-900/20" 
                : "hover:border-gray-400"
            }`}
            onClick={() => setDeductionMethod("standard")}
          >
            {deductionMethod === "standard" && (
              <div className="absolute right-4 top-4">
                <Check className="h-5 w-5 text-taxBlue-600 dark:text-taxBlue-400" />
              </div>
            )}
            <RadioGroup value={deductionMethod} onValueChange={(v) => setDeductionMethod(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard" className="text-base font-medium">Standard Deduction</Label>
              </div>
            </RadioGroup>
            <p className="ml-6 mt-1 text-sm text-muted-foreground">
              Take a flat deduction amount ($13,850 for single filers)
            </p>
            <div className="ml-6 mt-2">
              <Badge variant="secondary">Recommended for you</Badge>
            </div>
          </div>
          
          <div 
            className={`relative rounded-lg border p-4 cursor-pointer ${
              deductionMethod === "itemized" 
                ? "border-taxBlue-600 bg-taxBlue-50 dark:border-taxBlue-500 dark:bg-taxBlue-900/20" 
                : "hover:border-gray-400"
            }`}
            onClick={() => setDeductionMethod("itemized")}
          >
            {deductionMethod === "itemized" && (
              <div className="absolute right-4 top-4">
                <Check className="h-5 w-5 text-taxBlue-600 dark:text-taxBlue-400" />
              </div>
            )}
            <RadioGroup value={deductionMethod} onValueChange={(v) => setDeductionMethod(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="itemized" id="itemized" />
                <Label htmlFor="itemized" className="text-base font-medium">Itemized Deductions</Label>
              </div>
            </RadioGroup>
            <p className="ml-6 mt-1 text-sm text-muted-foreground">
              List out individual deductions that may exceed the standard deduction
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {deductionMethod === "itemized" && (
        <div className="space-y-4">
          <h3 className="text-base font-medium">Itemized Deductions</h3>
          
          <div className="rounded-lg border p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Medical and Dental Expenses</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="medical-expenses">Total Medical Expenses</Label>
                  <Input id="medical-expenses" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medical-insurance">Health Insurance Premiums</Label>
                  <Input id="medical-insurance" placeholder="0.00" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Taxes Paid</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="state-local-tax">State and Local Income Taxes</Label>
                  <Input id="state-local-tax" placeholder="0.00" defaultValue="4800.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="real-estate-tax">Real Estate Taxes</Label>
                  <Input id="real-estate-tax" placeholder="0.00" defaultValue="3600.00" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Interest Paid</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mortgage-interest">Home Mortgage Interest</Label>
                  <Input id="mortgage-interest" placeholder="0.00" defaultValue="2800.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="investment-interest">Investment Interest</Label>
                  <Input id="investment-interest" placeholder="0.00" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Charitable Contributions</h4>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cash-donations">Cash Donations</Label>
                  <Input id="cash-donations" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="non-cash-donations">Non-Cash Donations</Label>
                  <Input id="non-cash-donations" placeholder="0.00" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-base font-medium">Tax Credits</h3>
        
        <div className="rounded-md bg-amber-50 p-4 dark:bg-amber-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                You may qualify for these tax credits
              </h3>
              <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                <p>Based on your information, please review these potential tax credits:</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox id="credit-education" />
            <div>
              <Label
                htmlFor="credit-education"
                className="font-medium text-base"
              >
                Education Credits
              </Label>
              <p className="text-sm text-muted-foreground">
                American Opportunity or Lifetime Learning credits for higher education expenses
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox id="credit-child-dependent" />
            <div>
              <Label
                htmlFor="credit-child-dependent"
                className="font-medium text-base"
              >
                Child and Dependent Care Credit
              </Label>
              <p className="text-sm text-muted-foreground">
                Credit for expenses paid for care of qualifying individuals
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox id="credit-retirement" />
            <div>
              <Label
                htmlFor="credit-retirement"
                className="font-medium text-base"
              >
                Retirement Savings Contribution Credit
              </Label>
              <p className="text-sm text-muted-foreground">
                Credit for contributions to retirement accounts
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox id="credit-energy" />
            <div>
              <Label
                htmlFor="credit-energy"
                className="font-medium text-base"
              >
                Residential Energy Credits
              </Label>
              <p className="text-sm text-muted-foreground">
                Credits for energy-efficient home improvements
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-between">
        <Button variant="outline" onClick={() => {
          speak("Returning to the income step");
          onPrevious();
        }}>
          Back to Income
        </Button>
        <Button onClick={() => {
          speak("Proceeding to review step. You can review all your tax information before submitting.");
          onNext();
        }}>
          Continue to Review
        </Button>
      </div>
    </div>
  );
};

export default DeductionsStep;
