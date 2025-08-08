
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertCircle, Check, LightbulbIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";
import { deductionsSchema, DeductionsForm } from "@/utils/formValidation";

interface DeductionsStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onSave: (data: DeductionsForm) => void;
  initialData?: DeductionsForm | null;
}

const DeductionsStep: React.FC<DeductionsStepProps> = ({ onNext, onPrevious, onSave, initialData }) => {
  const { speak } = useVoiceAssistant();
  const [selectedCredits, setSelectedCredits] = useState<string[]>([]);

  const form = useForm<DeductionsForm>({
    resolver: zodResolver(deductionsSchema),
    defaultValues: initialData || {
      deductionMethod: 'standard',
      medicalExpenses: 0,
      stateLocalTax: 0,
      realEstateTax: 0,
      mortgageInterest: 0,
      charitableCash: 0,
      charitableNonCash: 0
    }
  });

  const deductionMethod = form.watch('deductionMethod');

  useEffect(() => {
    speak("Deductions and Credits step loaded. Choose between standard deduction or itemize your deductions for potentially greater tax savings.");
  }, [speak]);

  const onSubmit = async (data: DeductionsForm) => {
    try {
      await onSave(data);
      speak("Deductions and credits saved successfully. Proceeding to review step.");
      onNext();
    } catch (error) {
      speak("There was an error saving your deductions. Please try again.");
    }
  };

  const calculateItemizedTotal = () => {
    const values = form.getValues();
    return (values.medicalExpenses || 0) + 
           (values.stateLocalTax || 0) + 
           (values.realEstateTax || 0) + 
           (values.mortgageInterest || 0) + 
           (values.charitableCash || 0) + 
           (values.charitableNonCash || 0);
  };

  const standardDeduction = 13850; // 2023 standard deduction for single
  const itemizedTotal = calculateItemizedTotal();
  const recommendStandard = standardDeduction > itemizedTotal;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Deductions & Credits</h2>
        <p className="text-sm text-muted-foreground">
          Maximize your tax savings with deductions and credits.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <p>
                {recommendStandard 
                  ? `The standard deduction ($${standardDeduction.toLocaleString()}) is likely better for you than itemizing (estimated: $${itemizedTotal.toLocaleString()}).`
                  : `Itemizing your deductions (estimated: $${itemizedTotal.toLocaleString()}) may be better than the standard deduction ($${standardDeduction.toLocaleString()}).`
                }
              </p>
            </CardContent>
          </Card>

          <FormField
            control={form.control}
            name="deductionMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Choose your deduction method</FormLabel>
                <FormControl>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div 
                      className={`relative rounded-lg border p-4 cursor-pointer ${
                        field.value === "standard" 
                          ? "border-primary bg-primary/5" 
                          : "hover:border-gray-400"
                      }`}
                      onClick={() => field.onChange("standard")}
                    >
                      {field.value === "standard" && (
                        <div className="absolute right-4 top-4">
                          <Check className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <RadioGroup value={field.value} onValueChange={field.onChange}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label htmlFor="standard" className="text-base font-medium">Standard Deduction</Label>
                        </div>
                      </RadioGroup>
                      <p className="ml-6 mt-1 text-sm text-muted-foreground">
                        Take a flat deduction amount (${standardDeduction.toLocaleString()} for single filers)
                      </p>
                      {recommendStandard && (
                        <div className="ml-6 mt-2">
                          <Badge variant="secondary">Recommended for you</Badge>
                        </div>
                      )}
                    </div>
                    
                    <div 
                      className={`relative rounded-lg border p-4 cursor-pointer ${
                        field.value === "itemized" 
                          ? "border-primary bg-primary/5" 
                          : "hover:border-gray-400"
                      }`}
                      onClick={() => field.onChange("itemized")}
                    >
                      {field.value === "itemized" && (
                        <div className="absolute right-4 top-4">
                          <Check className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <RadioGroup value={field.value} onValueChange={field.onChange}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="itemized" id="itemized" />
                          <Label htmlFor="itemized" className="text-base font-medium">Itemized Deductions</Label>
                        </div>
                      </RadioGroup>
                      <p className="ml-6 mt-1 text-sm text-muted-foreground">
                        List out individual deductions that may exceed the standard deduction
                      </p>
                      {!recommendStandard && (
                        <div className="ml-6 mt-2">
                          <Badge variant="secondary">May be better for you</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          {deductionMethod === "itemized" && (
            <div className="space-y-4">
              <h3 className="text-base font-medium">Itemized Deductions</h3>
              
              <div className="rounded-lg border p-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Medical and Dental Expenses</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="medicalExpenses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Medical Expenses</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              placeholder="0.00" 
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Taxes Paid</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="stateLocalTax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State and Local Income Taxes</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              placeholder="0.00" 
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="realEstateTax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Real Estate Taxes</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              placeholder="0.00" 
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Interest Paid</h4>
                  <FormField
                    control={form.control}
                    name="mortgageInterest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Mortgage Interest</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0.00" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Charitable Contributions</h4>
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="charitableCash"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cash Donations</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              placeholder="0.00" 
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="charitableNonCash"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Non-Cash Donations</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              placeholder="0.00" 
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total itemized deductions: ${itemizedTotal.toLocaleString()}
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
              {[
                { id: 'education', name: 'Education Credits', description: 'American Opportunity or Lifetime Learning credits for higher education expenses' },
                { id: 'childcare', name: 'Child and Dependent Care Credit', description: 'Credit for expenses paid for care of qualifying individuals' },
                { id: 'retirement', name: 'Retirement Savings Contribution Credit', description: 'Credit for contributions to retirement accounts' },
                { id: 'energy', name: 'Residential Energy Credits', description: 'Credits for energy-efficient home improvements' }
              ].map((credit) => (
                <div key={credit.id} className="flex items-start space-x-2">
                  <Checkbox 
                    id={`credit-${credit.id}`}
                    checked={selectedCredits.includes(credit.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCredits(prev => [...prev, credit.id]);
                      } else {
                        setSelectedCredits(prev => prev.filter(id => id !== credit.id));
                      }
                    }}
                  />
                  <div>
                    <Label htmlFor={`credit-${credit.id}`} className="font-medium text-base">
                      {credit.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {credit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <Button type="button" variant="outline" onClick={() => {
              speak("Returning to the income step");
              onPrevious();
            }}>
              Back to Income
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Continue to Review"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DeductionsStep;
