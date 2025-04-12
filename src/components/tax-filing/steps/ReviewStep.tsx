
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowDown, Download, Printer } from "lucide-react";

interface ReviewStepProps {
  onPrevious: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ onPrevious }) => {
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
        <Button variant="outline" size="sm">
          <Printer className="mr-2 h-4 w-4" /> Print Preview
        </Button>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" /> Download PDF
        </Button>
        <Button variant="outline" size="sm">
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
