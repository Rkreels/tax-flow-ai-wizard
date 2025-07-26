
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Upload, Check, AlertTriangle, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";

interface IncomeStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

const IncomeStep: React.FC<IncomeStepProps> = ({ onNext, onPrevious }) => {
  const { speak } = useVoiceAssistant();
  const [documents, setDocuments] = useState([
    { id: 1, name: "W-2 - Acme Inc.", status: "processed" },
    { id: 2, name: "1099-INT - First Bank", status: "processed" },
  ]);

  useEffect(() => {
    speak("Income Information step loaded. Upload your tax documents or manually enter income from wages, interest, and other sources.");
  }, [speak]);

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
            <Button>
              <Upload className="mr-2 h-4 w-4" /> Select Files
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Uploaded Documents</h3>
              <Badge variant="outline" className="font-normal">2 documents</Badge>
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
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="wages" className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    We found the following income from your documents
                  </h3>
                  <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                    <p>W-2 from Acme Inc. with wages of $72,000.00</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid gap-4">
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Employer: Acme Inc.</h4>
                  <Badge variant="outline">W-2</Badge>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="wages">Wages, Tips, Compensation</Label>
                    <Input id="wages" defaultValue="72000.00" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="federal-withheld">Federal Income Tax Withheld</Label>
                    <Input id="federal-withheld" defaultValue="14400.00" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ss-wages">Social Security Wages</Label>
                    <Input id="ss-wages" defaultValue="72000.00" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ss-withheld">Social Security Tax Withheld</Label>
                    <Input id="ss-withheld" defaultValue="4464.00" />
                  </div>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Another Employer
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="other" className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    We found the following interest income from your documents
                  </h3>
                  <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                    <p>1099-INT from First Bank with interest of $350.00</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">First Bank</h4>
                <Badge variant="outline">1099-INT</Badge>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="interest-income">Interest Income</Label>
                  <Input id="interest-income" defaultValue="350.00" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tax-exempt-interest">Tax-Exempt Interest</Label>
                  <Input id="tax-exempt-interest" defaultValue="0.00" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Add Additional Income Sources</h4>
              
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <Button variant="outline" className="justify-start h-auto py-3">
                  <div className="flex flex-col items-start">
                    <span>Dividends</span>
                    <span className="text-xs text-muted-foreground">1099-DIV</span>
                  </div>
                </Button>

                <Button variant="outline" className="justify-start h-auto py-3">
                  <div className="flex flex-col items-start">
                    <span>Self-Employment</span>
                    <span className="text-xs text-muted-foreground">Schedule C</span>
                  </div>
                </Button>

                <Button variant="outline" className="justify-start h-auto py-3">
                  <div className="flex flex-col items-start">
                    <span>Rental Income</span>
                    <span className="text-xs text-muted-foreground">Schedule E</span>
                  </div>
                </Button>

                <Button variant="outline" className="justify-start h-auto py-3">
                  <div className="flex flex-col items-start">
                    <span>Capital Gains</span>
                    <span className="text-xs text-muted-foreground">1099-B, Schedule D</span>
                  </div>
                </Button>

                <Button variant="outline" className="justify-start h-auto py-3">
                  <div className="flex flex-col items-start">
                    <span>Retirement Income</span>
                    <span className="text-xs text-muted-foreground">1099-R</span>
                  </div>
                </Button>

                <Button variant="outline" className="justify-start h-auto py-3">
                  <div className="flex flex-col items-start">
                    <span>Other Income</span>
                    <span className="text-xs text-muted-foreground">Miscellaneous</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="pt-4 flex justify-between">
        <Button variant="outline" onClick={() => {
          speak("Returning to personal information step");
          onPrevious();
        }}>
          Back to Personal Info
        </Button>
        <Button onClick={() => {
          speak("Proceeding to deductions step. You can choose between standard or itemized deductions.");
          onNext();
        }}>
          Continue to Deductions
        </Button>
      </div>
    </div>
  );
};

export default IncomeStep;
