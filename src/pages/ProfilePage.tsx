
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { User, Lock, File, Bell } from "lucide-react";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    address: "123 Tax Street, San Francisco, CA 94107",
    company: "TaxFlow Inc."
  });

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully");
  };
  
  const handleSavePassword = () => {
    toast.success("Password updated successfully");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Avatar className="h-20 w-20">
              {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
              <AvatarFallback className="text-xl">{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{user?.name}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
              <p className="text-sm capitalize">Role: {user?.role}</p>
            </div>
          </div>
          <Button>Upload Picture</Button>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 md:grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input 
                      id="company" 
                      value={profileData.company}
                      onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Manage your notification settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="email-notifications" defaultChecked className="rounded border-gray-300" />
                  <Label htmlFor="email-notifications">Email notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="tax-updates" className="rounded border-gray-300" />
                  <Label htmlFor="tax-updates">Tax law updates</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="return-status" defaultChecked className="rounded border-gray-300" />
                  <Label htmlFor="return-status">Return status changes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="marketing" className="rounded border-gray-300" />
                  <Label htmlFor="marketing">Marketing communications</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSavePassword}>Update Password</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Two-factor authentication is not enabled yet.</p>
                <p className="text-sm text-muted-foreground">
                  Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to sign in.
                </p>
              </CardContent>
              <CardFooter>
                <Button>Enable 2FA</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <File className="h-5 w-5" />
                  My Documents
                </CardTitle>
                <CardDescription>
                  View and manage your uploaded documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">W-2 Form (2023)</h3>
                      <p className="text-sm text-muted-foreground">Uploaded on: April 5, 2025</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">View</Button>
                      <Button size="sm" variant="outline">Delete</Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">1099-INT (2023)</h3>
                      <p className="text-sm text-muted-foreground">Uploaded on: April 10, 2025</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">View</Button>
                      <Button size="sm" variant="outline">Delete</Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 p-6">
                  <div className="rounded-full bg-gray-100 p-3">
                    <File className="h-6 w-6 text-gray-500" />
                  </div>
                  <p className="text-sm text-center font-medium">Drag and drop files here or click to browse</p>
                  <p className="text-xs text-center text-gray-500">Upload your tax-related documents here</p>
                  <Button size="sm" variant="outline" className="mt-2">Upload Document</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
