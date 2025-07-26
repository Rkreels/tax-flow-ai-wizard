
import React, { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart as RechartsBarChart, Bar, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart2, LineChart as LineChartIcon, TrendingUp, Users } from "lucide-react";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";

const AnalyticsPage: React.FC = () => {
  const { speak, speakElementMessage } = useVoiceAssistant();

  useEffect(() => {
    speak("Analytics Dashboard loaded. You can review tax return statistics, user activity metrics, and system performance data.");
  }, [speak]);

  // Sample data for charts
  const monthlyData = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 600 },
    { name: "Apr", value: 800 },
    { name: "May", value: 500 },
    { name: "Jun", value: 700 },
  ];

  const userActivityData = [
    { name: "Mon", active: 120, new: 25 },
    { name: "Tue", active: 98, new: 15 },
    { name: "Wed", active: 130, new: 30 },
    { name: "Thu", active: 125, new: 22 },
    { name: "Fri", active: 85, new: 18 },
    { name: "Sat", active: 60, new: 10 },
    { name: "Sun", active: 45, new: 5 },
  ];

  return (
    <MainLayout requiredPermission="view_analytics">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => speak("Total Returns: 2,345 tax returns filed, showing a 20.1% increase from last month")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,345</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => speak("Active Users: 1,273 users are currently active, showing a 10.5% increase from last month")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,273</div>
              <p className="text-xs text-muted-foreground">+10.5% from last month</p>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => speak("Completion Rate: 78.3% of tax returns are completed successfully, up 2.1% from last month")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <LineChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78.3%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => speak("Average Time: Users spend an average of 24 minutes and 13 seconds completing their tax returns, down 1.5% from last month")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Average Time</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24m 13s</div>
              <p className="text-xs text-muted-foreground">-1.5% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Monthly Returns Filed</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#6366F1" name="Returns" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="active" stroke="#6366F1" name="Active Users" />
                  <Line type="monotone" dataKey="new" stroke="#4ADE80" name="New Users" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AnalyticsPage;
