
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, HelpCircle, MessageSquare, Search } from "lucide-react";
import { toast } from "sonner";

const HelpPage: React.FC = () => {
  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Your question has been submitted. We'll respond shortly.");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        </div>

        <div className="relative bg-primary/10 rounded-lg p-6 mb-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-2xl font-bold">How can we help you today?</h2>
            <form className="flex max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="search"
                placeholder="Search for help topics..."
                className="rounded-r-none"
              />
              <Button type="submit" className="rounded-l-none">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>
          </div>
        </div>

        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 md:grid-cols-3">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
          </TabsList>
          
          <TabsContent value="faq" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                  Find answers to the most common questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do I start a new tax return?</AccordionTrigger>
                    <AccordionContent>
                      To start a new tax return, navigate to the dashboard and click on "New Tax Filing" or use the "Start New Return" button. This will take you to our step-by-step tax filing wizard that will guide you through the entire process.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How do I upload my tax documents?</AccordionTrigger>
                    <AccordionContent>
                      You can upload your tax documents by going to the "Documents" section in the sidebar navigation. Click on the "Upload Document" button, select your file, add any relevant details, and submit. We support PDF, JPG, PNG, and ZIP files.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>What is the deadline for filing taxes?</AccordionTrigger>
                    <AccordionContent>
                      The standard deadline for filing individual tax returns in the United States is April 15th. However, this date may change if it falls on a weekend or holiday. Be sure to check the IRS website for the most current deadline information.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>How secure is my tax information?</AccordionTrigger>
                    <AccordionContent>
                      We take security very seriously. All data is encrypted both in transit and at rest using industry-standard encryption protocols. We employ multiple layers of security including two-factor authentication, regular security audits, and strict access controls.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>Can I file taxes for previous years?</AccordionTrigger>
                    <AccordionContent>
                      Yes, you can file tax returns for previous years. When starting a new return, you'll be able to select the tax year you want to file for. Keep in mind that there may be different forms and rules depending on the tax year.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-6">
                    <AccordionTrigger>How do I check the status of my tax return?</AccordionTrigger>
                    <AccordionContent>
                      You can check the status of your tax return by going to the "My Returns" section. Each return will display its current status, such as "Draft," "In Progress," "Submitted," or "Approved."
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="guides" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Tax Filing Guides
                </CardTitle>
                <CardDescription>
                  Step-by-step instructions for common tax filing scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Filing Your First Tax Return</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        A comprehensive guide for first-time tax filers
                      </p>
                      <Button variant="outline" size="sm">View Guide</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Self-Employment Taxes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Everything you need to know about filing taxes as a freelancer
                      </p>
                      <Button variant="outline" size="sm">View Guide</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Rental Income Guide</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        How to report income and expenses from rental properties
                      </p>
                      <Button variant="outline" size="sm">View Guide</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Maximizing Deductions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Tips for finding all eligible tax deductions
                      </p>
                      <Button variant="outline" size="sm">View Guide</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Investment Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        How to report dividends, interest, and capital gains
                      </p>
                      <Button variant="outline" size="sm">View Guide</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Filing an Extension</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Step-by-step guide to requesting more time to file
                      </p>
                      <Button variant="outline" size="sm">View Guide</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Contact Support
                </CardTitle>
                <CardDescription>
                  Can't find what you're looking for? Send us a message
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSubmitQuestion}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Your Name</label>
                      <Input id="name" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Your Email</label>
                      <Input id="email" type="email" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                    <Input id="subject" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <textarea
                      id="message"
                      required
                      className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background resize-y"
                    ></textarea>
                  </div>
                  <Button type="submit">Submit Question</Button>
                </form>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm"><strong>Email:</strong> support@taxflow-example.com</p>
                        <p className="text-sm"><strong>Phone:</strong> 1-800-TAX-HELP</p>
                        <p className="text-sm"><strong>Hours:</strong> Mon-Fri, 8am-8pm EST</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Response Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        We strive to respond to all inquiries within 24 hours during business days.
                        During tax season (January - April), response times may be slightly longer.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default HelpPage;
