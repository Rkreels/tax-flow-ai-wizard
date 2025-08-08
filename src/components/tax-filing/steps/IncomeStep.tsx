
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Upload, Check, AlertTriangle, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";
import { incomeSchema, IncomeForm } from "@/utils/formValidation";

interface IncomeStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onSave: (data: IncomeForm) => void;
  initialData?: IncomeForm | null;
}

const IncomeStep: React.FC<IncomeStepProps> = ({ onNext, onPrevious, onSave, initialData }) => {
  const { speak } = useVoiceAssistant();
  const [documents, setDocuments] = useState([
    { id: 1, name: "W-2 - Acme Inc.", status: "processed" },
    { id: 2, name: "1099-INT - First Bank", status: "processed" },
  ]);

  const form = useForm<IncomeForm>({
    resolver: zodResolver(incomeSchema),
    defaultValues: initialData || {
      wages: 0,
      federalWithheld: 0,
      ssWages: 0,
      ssWithheld: 0,
      interestIncome: 0,
      taxExemptInterest: 0
    }
  });

  useEffect(() => {
    speak("Income Information step loaded. Upload your tax documents or manually enter income from wages, interest, and other sources.");
  }, [speak]);

  const onSubmit = async (data: IncomeForm) => {
    try {
      await onSave(data);
      speak("Income information saved successfully. Proceeding to deductions step.");
      onNext();
    } catch (error) {
      speak("There was an error saving your income information. Please try again.");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file, index) => {
        const newDoc = {
          id: Date.now() + index,
          name: file.name,
          status: "processing" as const
        };
        setDocuments(prev => [...prev, newDoc]);
        
        // Simulate processing
        setTimeout(() => {
          setDocuments(prev => 
            prev.map(doc => 
              doc.id === newDoc.id 
                ? { ...doc, status: "processed" as const }
                : doc
            )
          );
        }, 2000);
      });
      
      speak(`${files.length} document${files.length > 1 ? 's' : ''} uploaded and processing.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Income Information</h2>
        <p className="text-sm text-muted-foreground">
          Report all sources of income for the tax year.
        </p>
      </div>

      <Tabs defaultValue="documents">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents">Upload Documents</TabsTrigger>
          <TabsTrigger value="wages">Wages & Salary</TabsTrigger>
          <TabsTrigger value="other">Other Income</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="space-y-4 pt-4">
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 dark:border-gray-700">
            <Upload className="mb-2 h-8 w-8 text-gray-400" />
            <p className="mb-2 font-medium">Upload your income documents</p>
            <p className="mb-4 text-sm text-muted-foreground text-center">
              Drag and drop your W-2, 1099, and other income documents here, or click to browse files
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" /> Select Files
              </label>
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Uploaded Documents</h3>
              <Badge variant="outline" className="font-normal">{documents.length} documents</Badge>
            </div>
            
            <div className="space-y-2">
              {documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="flex items-center justify-between p-3">
                    <div className="flex items-center">
                      <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <div className="flex items-center">
                          {doc.status === "processed" ? (
                            <>
                              <Check className="mr-1 h-3 w-3 text-green-600 dark:text-green-400" />
                              <span className="text-xs text-green-600 dark:text-green-400">Processed</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="mr-1 h-3 w-3 text-amber-600 dark:text-amber-400" />
                              <span className="text-xs text-amber-600 dark:text-amber-400">Processing</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => speak(`Viewing ${doc.name}`)}>
                      View
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="wages" className="space-y-6 pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Enter your wage information from your W-2 forms
                    </h3>
                  </div>
                </div>
              </div>
              
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Wages and Tax Information</h4>
                  <Badge variant="outline">W-2</Badge>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="wages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wages, Tips, Compensation</FormLabel>
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
                    name="federalWithheld"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Federal Income Tax Withheld</FormLabel>
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
                    name="ssWages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Social Security Wages</FormLabel>
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
                    name="ssWithheld"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Social Security Tax Withheld</FormLabel>
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
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="other" className="space-y-6 pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Interest Income</h4>
                  <Badge variant="outline">1099-INT</Badge>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="interestIncome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interest Income</FormLabel>
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
                    name="taxExemptInterest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax-Exempt Interest</FormLabel>
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
            </form>
          </Form>
        </TabsContent>
      </Tabs>

      <div className="pt-4 flex justify-between">
        <Button variant="outline" onClick={() => {
          speak("Returning to personal information step");
          onPrevious();
        }}>
          Back to Personal Info
        </Button>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Continue to Deductions"}
        </Button>
      </div>
    </div>
  );
};

export default IncomeStep;
