
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import TaxAssistant from "@/components/ai/TaxAssistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileQuestion, BookOpen, Calculator, FileText } from "lucide-react";

const AssistantPage: React.FC = () => {
  return (
    <MainLayout requiredPermission="use_ai_assistant">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Tax Assistant</h1>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div className="h-[600px]">
              <TaxAssistant />
            </div>
          </div>
          
          <div className="space-y-6">
            <Tabs defaultValue="faq">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="faq">FAQ</TabsTrigger>
                <TabsTrigger value="glossary">Glossary</TabsTrigger>
                <TabsTrigger value="tools">Tools</TabsTrigger>
              </TabsList>
              
              <TabsContent value="faq" className="space-y-4 pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <FileQuestion className="h-4 w-4 mr-2" />
                      Common Tax Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-2">
                      <li>
                        <button 
                          className="text-left text-primary hover:underline"
                          onClick={() => document.getElementById('chat-input')?.focus()}
                        >
                          When is the tax filing deadline?
                        </button>
                      </li>
                      <li>
                        <button 
                          className="text-left text-primary hover:underline"
                          onClick={() => document.getElementById('chat-input')?.focus()}
                        >
                          What forms do I need for self-employment income?
                        </button>
                      </li>
                      <li>
                        <button 
                          className="text-left text-primary hover:underline"
                          onClick={() => document.getElementById('chat-input')?.focus()}
                        >
                          How do I check the status of my refund?
                        </button>
                      </li>
                      <li>
                        <button 
                          className="text-left text-primary hover:underline"
                          onClick={() => document.getElementById('chat-input')?.focus()}
                        >
                          Can I deduct my home office expenses?
                        </button>
                      </li>
                      <li>
                        <button 
                          className="text-left text-primary hover:underline"
                          onClick={() => document.getElementById('chat-input')?.focus()}
                        >
                          What is the difference between tax credits and deductions?
                        </button>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="glossary" className="space-y-4 pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Tax Glossary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <dl className="space-y-2">
                      <div>
                        <dt className="font-medium">Adjusted Gross Income (AGI)</dt>
                        <dd className="text-muted-foreground">
                          Total income minus specific deductions, used to determine tax bracket.
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium">Standard Deduction</dt>
                        <dd className="text-muted-foreground">
                          Flat-dollar reduction in taxable income that varies by filing status.
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium">Tax Credit</dt>
                        <dd className="text-muted-foreground">
                          Dollar-for-dollar reduction in the tax amount owed.
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium">Tax Deduction</dt>
                        <dd className="text-muted-foreground">
                          Reduction in taxable income, lowering your tax liability.
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="tools" className="space-y-4 pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Calculator className="h-4 w-4 mr-2" />
                      Tax Tools
                    </CardTitle>
                    <CardDescription>
                      Helpful calculators and tools
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Calculator className="h-4 w-4 mr-2 text-gray-400" />
                        <button 
                          className="text-primary hover:underline"
                          onClick={() => window.open('https://www.irs.gov/help/ita/tax-withholding-estimator', '_blank')}
                        >
                          Tax Bracket Calculator
                        </button>
                      </li>
                      <li className="flex items-center">
                        <Calculator className="h-4 w-4 mr-2 text-gray-400" />
                        <button 
                          className="text-primary hover:underline"
                          onClick={() => window.open('https://www.irs.gov/forms-pubs/about-form-1040es', '_blank')}
                        >
                          Estimated Tax Payment Calculator
                        </button>
                      </li>
                      <li className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-400" />
                        <button 
                          className="text-primary hover:underline"
                          onClick={() => window.open('https://www.irs.gov/individuals/tax-withholding-estimator', '_blank')}
                        >
                          W-4 Withholding Calculator
                        </button>
                      </li>
                      <li className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-400" />
                        <button 
                          className="text-primary hover:underline"
                          onClick={() => window.open('https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes', '_blank')}
                        >
                          Self-Employment Tax Estimator
                        </button>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <ul className="space-y-2">
                  <li className="border-b pb-2">
                    <div className="font-medium">Asked about tax credits</div>
                    <div className="text-xs text-muted-foreground">10 minutes ago</div>
                  </li>
                  <li className="border-b pb-2">
                    <div className="font-medium">Explored deduction options</div>
                    <div className="text-xs text-muted-foreground">Yesterday</div>
                  </li>
                  <li>
                    <div className="font-medium">Checked filing deadline</div>
                    <div className="text-xs text-muted-foreground">2 days ago</div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AssistantPage;
