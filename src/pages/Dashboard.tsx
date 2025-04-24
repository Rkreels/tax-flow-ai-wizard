import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, FileText, FileCheck, Receipt, Activity, Users, BookOpen, Settings } from "lucide-react";

// User-specific dashboard components
const UserDashboard: React.FC = () => {
  const { speakElementMessage } = useVoiceAssistant();
  const navigate = useNavigate();
  
  const handleButtonClick = (path: string, elementId: string) => {
    speakElementMessage(elementId);
    navigate(path);
  };
  
  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <Card className="bg-taxBlue-50 border-taxBlue-100 dark:bg-taxBlue-900/20 dark:border-taxBlue-700/30">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to TaxFlow AI</CardTitle>
          <CardDescription className="text-lg">
            Your smart tax filing assistant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-2">Let's get started with your tax filing:</p>
            <Progress value={15} className="h-2" />
            <p className="mt-1 text-sm text-muted-foreground">Progress: 15% complete</p>
          </div>
          <Button 
            className="mt-2" 
            onClick={() => handleButtonClick("/filing", "navFiling")}
          >
            Continue Filing <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Action Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-taxTeal-50 to-white opacity-60 dark:from-taxTeal-900/20 dark:to-transparent"></div>
          <CardHeader className="relative">
            <FileText className="h-8 w-8 text-taxTeal-600 dark:text-taxTeal-400" />
            <CardTitle className="mt-2">Start New Return</CardTitle>
            <CardDescription>
              Begin a new tax filing for 2023-2024
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <Button 
              variant="secondary" 
              onClick={() => handleButtonClick("/filing", "navFiling")}
            >
              Get Started
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-taxBlue-50 to-white opacity-60 dark:from-taxBlue-900/20 dark:to-transparent"></div>
          <CardHeader className="relative">
            <FileCheck className="h-8 w-8 text-taxBlue-600 dark:text-taxBlue-400" />
            <CardTitle className="mt-2">Upload Documents</CardTitle>
            <CardDescription>
              Upload W-2, 1099s, and other tax documents
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <Button 
              variant="secondary" 
              onClick={() => handleButtonClick("/documents", "uploadDocument")}
            >
              Upload
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white opacity-60 dark:from-purple-900/20 dark:to-transparent"></div>
          <CardHeader className="relative">
            <Receipt className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <CardTitle className="mt-2">Tax Deductions</CardTitle>
            <CardDescription>
              Find all possible deductions with AI assistance
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <Button 
              variant="secondary" 
              onClick={() => handleButtonClick("/assistant", "navAssistant")}
            >
              Explore
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center border-b pb-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Started 2023 Tax Return</p>
                <p className="text-xs text-muted-foreground">April 10, 2025</p>
              </div>
            </div>
            <div className="flex items-center border-b pb-2">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 mr-3">
                <FileCheck className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Uploaded W-2 from Acme Inc.</p>
                <p className="text-xs text-muted-foreground">April 9, 2025</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Admin-specific dashboard components
const AdminDashboard: React.FC = () => {
  const { speakElementMessage } = useVoiceAssistant();
  const navigate = useNavigate();
  
  const handleButtonClick = (path: string, elementId: string) => {
    speakElementMessage(elementId);
    navigate(path);
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-taxBlue-50 border-taxBlue-100 dark:bg-taxBlue-900/20 dark:border-taxBlue-700/30">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
          <CardDescription className="text-lg">System overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col space-y-1.5 rounded-lg border p-4">
              <div className="text-sm font-medium text-muted-foreground">Total Users</div>
              <div className="text-3xl font-bold">2,417</div>
            </div>
            <div className="flex flex-col space-y-1.5 rounded-lg border bg-green-50 dark:bg-green-900/20 p-4">
              <div className="text-sm font-medium text-muted-foreground">Active Returns</div>
              <div className="text-3xl font-bold">1,892</div>
            </div>
            <div className="flex flex-col space-y-1.5 rounded-lg border bg-amber-50 dark:bg-amber-900/20 p-4">
              <div className="text-sm font-medium text-muted-foreground">Support Tickets</div>
              <div className="text-3xl font-bold">14</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground text-center">User activity chart will be displayed here</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between" id="authStatus" onClick={() => speakElementMessage("authStatus")}>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Authentication Service</span>
                </div>
                <span className="text-sm text-green-600 dark:text-green-400">Operational</span>
              </div>
              <div className="flex items-center justify-between" id="taxEngineStatus" onClick={() => speakElementMessage("taxEngineStatus")}>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Tax Calculation Engine</span>
                </div>
                <span className="text-sm text-green-600 dark:text-green-400">Operational</span>
              </div>
              <div className="flex items-center justify-between" id="docProcessingStatus" onClick={() => speakElementMessage("docProcessingStatus")}>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Document Processing</span>
                </div>
                <span className="text-sm text-green-600 dark:text-green-400">Operational</span>
              </div>
              <div className="flex items-center justify-between" id="aiAssistantStatus" onClick={() => speakElementMessage("aiAssistantStatus")}>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                  <span>AI Assistant</span>
                </div>
                <span className="text-sm text-amber-600 dark:text-amber-400">Degraded</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button 
          id="allReturnsBtn"
          className="flex flex-col items-center justify-center p-6 h-auto gap-3"
          onClick={() => handleButtonClick("/returns", "allReturnsBtn")}
        >
          <FileText className="h-8 w-8" />
          <span>All Returns</span>
        </Button>
        <Button 
          id="usersBtn"
          className="flex flex-col items-center justify-center p-6 h-auto gap-3"
          onClick={() => handleButtonClick("/users", "usersBtn")}
        >
          <Users className="h-8 w-8" />
          <span>Users</span>
        </Button>
        <Button 
          id="taxRulesBtn"
          className="flex flex-col items-center justify-center p-6 h-auto gap-3"
          onClick={() => handleButtonClick("/tax-rules", "taxRulesBtn")}
        >
          <BookOpen className="h-8 w-8" />
          <span>Tax Rules</span>
        </Button>
        <Button 
          id="analyticsBtn"
          className="flex flex-col items-center justify-center p-6 h-auto gap-3"
          onClick={() => handleButtonClick("/analytics", "analyticsBtn")}
        >
          <Activity className="h-8 w-8" />
          <span>Analytics</span>
        </Button>
      </div>

      <div className="flex justify-end">
        <Button 
          id="settingsBtn"
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => handleButtonClick("/settings", "settingsBtn")}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Button>
      </div>
    </div>
  );
};

// Support agent dashboard
const SupportDashboard: React.FC = () => {
  const { speakElementMessage } = useVoiceAssistant();
  const navigate = useNavigate();
  
  const handleButtonClick = (path: string, elementId: string) => {
    speakElementMessage(elementId);
    navigate(path);
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-taxBlue-50 border-taxBlue-100 dark:bg-taxBlue-900/20 dark:border-taxBlue-700/30">
        <CardHeader>
          <CardTitle className="text-2xl">Support Dashboard</CardTitle>
          <CardDescription className="text-lg">Monitor user requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col space-y-1.5 rounded-lg border p-4">
              <div className="text-sm font-medium text-muted-foreground">Total Tickets</div>
              <div className="text-3xl font-bold">14</div>
            </div>
            <div className="flex flex-col space-y-1.5 rounded-lg border bg-red-50 dark:bg-red-900/20 p-4">
              <div className="text-sm font-medium text-muted-foreground">Urgent</div>
              <div className="text-3xl font-bold">3</div>
            </div>
            <div className="flex flex-col space-y-1.5 rounded-lg border bg-green-50 dark:bg-green-900/20 p-4">
              <div className="text-sm font-medium text-muted-foreground">Resolved Today</div>
              <div className="text-3xl font-bold">7</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Support Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center border-b pb-2">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 mr-3">
                <span className="text-xs font-bold">U</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Issue with W-2 Upload</p>
                <p className="text-xs text-muted-foreground">Sarah Johnson • 32 minutes ago</p>
              </div>
              <Button size="sm" variant="outline">View</Button>
            </div>
            <div className="flex items-center border-b pb-2">
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mr-3">
                <span className="text-xs font-bold">M</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Tax Credit Eligibility Question</p>
                <p className="text-xs text-muted-foreground">Michael Brown • 1 hour ago</p>
              </div>
              <Button size="sm" variant="outline">View</Button>
            </div>
            <div className="flex items-center border-b pb-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                <span className="text-xs font-bold">J</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Password Reset Assistance</p>
                <p className="text-xs text-muted-foreground">James Wilson • 2 hours ago</p>
              </div>
              <Button size="sm" variant="outline">View</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Tax professional dashboard
const AccountantDashboard: React.FC = () => {
  const { speakElementMessage } = useVoiceAssistant();
  const navigate = useNavigate();
  
  const handleButtonClick = (path: string, elementId: string) => {
    speakElementMessage(elementId);
    navigate(path);
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-taxBlue-50 border-taxBlue-100 dark:bg-taxBlue-900/20 dark:border-taxBlue-700/30">
        <CardHeader>
          <CardTitle className="text-2xl">Tax Professional Dashboard</CardTitle>
          <CardDescription className="text-lg">Client overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col space-y-1.5 rounded-lg border p-4">
              <div className="text-sm font-medium text-muted-foreground">Total Clients</div>
              <div className="text-3xl font-bold">42</div>
            </div>
            <div className="flex flex-col space-y-1.5 rounded-lg border bg-amber-50 dark:bg-amber-900/20 p-4">
              <div className="text-sm font-medium text-muted-foreground">Pending Review</div>
              <div className="text-3xl font-bold">12</div>
            </div>
            <div className="flex flex-col space-y-1.5 rounded-lg border bg-green-50 dark:bg-green-900/20 p-4">
              <div className="text-sm font-medium text-muted-foreground">Completed</div>
              <div className="text-3xl font-bold">29</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Priority Client Returns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center border-b pb-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                <span className="text-xs font-bold">ML</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Mary Lee • 1040 Individual Return</p>
                <p className="text-xs text-muted-foreground">Due: Apr 15, 2025 • Complexity: Medium</p>
              </div>
              <Button size="sm">Review</Button>
            </div>
            <div className="flex items-center border-b pb-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                <span className="text-xs font-bold">RG</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Robert Garcia • Schedule C Business</p>
                <p className="text-xs text-muted-foreground">Due: Apr 15, 2025 • Complexity: High</p>
              </div>
              <Button size="sm">Review</Button>
            </div>
            <div className="flex items-center border-b pb-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                <span className="text-xs font-bold">TW</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Tina Williams • Rental Income</p>
                <p className="text-xs text-muted-foreground">Due: Apr 15, 2025 • Complexity: Medium</p>
              </div>
              <Button size="sm">Review</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center text-red-700 mr-3">
                  <span className="text-sm font-bold">15</span>
                </div>
                <div>
                  <p className="font-medium">April 15, 2025</p>
                  <p className="text-sm text-muted-foreground">Individual Tax Filing Deadline</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                  <span className="text-sm font-bold">15</span>
                </div>
                <div>
                  <p className="font-medium">June 15, 2025</p>
                  <p className="text-sm text-muted-foreground">Second Quarter Estimated Taxes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-2 border-blue-500 pl-3">
                <p className="text-sm">New Child Tax Credit Guidelines Published</p>
                <p className="text-xs text-muted-foreground">April 11, 2025</p>
              </div>
              <div className="border-l-2 border-blue-500 pl-3">
                <p className="text-sm">Federal Standard Deduction Updates for 2025</p>
                <p className="text-xs text-muted-foreground">April 5, 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Render dashboard based on user role
  const renderDashboard = () => {
    switch (user?.role) {
      case "admin":
        return <AdminDashboard />;
      case "support":
        return <SupportDashboard />;
      case "accountant":
        return <AccountantDashboard />;
      case "user":
      default:
        return <UserDashboard />;
    }
  };

  return <MainLayout>{renderDashboard()}</MainLayout>;
};

export default Dashboard;
