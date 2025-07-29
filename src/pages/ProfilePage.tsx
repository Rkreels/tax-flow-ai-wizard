
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
import { User, Lock, File, Bell, Camera } from "lucide-react";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { speak } = useVoiceAssistant();
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    address: "123 Tax Street, San Francisco, CA 94107",
    company: "TaxFlow Inc."
  });
  
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [notifications, setNotifications] = useState({
    email: true,
    taxUpdates: false,
    returnStatus: true,
    marketing: false
  });

  // Voice guidance when page loads
  React.useEffect(() => {
    speak("Profile page loaded. Here you can manage your personal information, security settings, and documents. Use the tabs to navigate between different sections.");
  }, [speak]);

  const handleSaveProfile = () => {
    speak("Saving your profile information.");
    // Simulate API call
    setTimeout(() => {
      toast.success("Profile updated successfully");
      speak("Your profile has been updated successfully.");
    }, 500);
  };
  
  const handleSavePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error("New passwords don't match");
      speak("Password update failed. The new passwords don't match.");
      return;
    }
    
    if (passwordData.new.length < 6) {
      toast.error("Password must be at least 6 characters");
      speak("Password update failed. Password must be at least 6 characters long.");
      return;
    }

    speak("Updating your password.");
    // Simulate API call
    setTimeout(() => {
      toast.success("Password updated successfully");
      speak("Your password has been updated successfully.");
      setPasswordData({ current: "", new: "", confirm: "" });
    }, 500);
  };

  const handleSaveNotifications = () => {
    speak("Saving your notification preferences.");
    // Simulate API call
    setTimeout(() => {
      toast.success("Notification preferences saved");
      speak("Your notification preferences have been saved.");
    }, 500);
  };

  const handleUploadPicture = () => {
    speak("Opening file selector to upload a new profile picture.");
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast.success("Profile picture uploaded");
        speak("Profile picture has been uploaded successfully.");
      }
    };
    input.click();
  };

  const handleViewDocument = (docName: string, url: string) => {
    speak(`Opening ${docName} for viewing.`);
    // Open document in new tab/window
    window.open(url, '_blank');
  };

  const handleDeleteDocument = (docName: string) => {
    speak(`Deleting ${docName}.`);
    toast.success(`${docName} deleted successfully`);
  };

  const handleUploadDocument = () => {
    speak("Opening file selector to upload a new document.");
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.jpg,.png';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast.success("Document uploaded successfully");
        speak("Document has been uploaded successfully.");
      }
    };
    input.click();
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
          <Button onClick={handleUploadPicture}>
            <Camera className="mr-2 h-4 w-4" />
            Upload Picture
          </Button>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 md:grid-cols-3">
            <TabsTrigger value="profile" onClick={() => speak("Profile information tab selected.")}>Profile</TabsTrigger>
            <TabsTrigger value="security" onClick={() => speak("Security settings tab selected.")}>Security</TabsTrigger>
            <TabsTrigger value="documents" onClick={() => speak("Documents management tab selected.")}>Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and contact details
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
                  Manage how you receive notifications and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive general notifications via email</p>
                  </div>
                  <input 
                    type="checkbox" 
                    id="email-notifications" 
                    checked={notifications.email}
                    onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                    className="rounded border-gray-300" 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="tax-updates">Tax law updates</Label>
                    <p className="text-sm text-muted-foreground">Stay informed about tax law changes</p>
                  </div>
                  <input 
                    type="checkbox" 
                    id="tax-updates" 
                    checked={notifications.taxUpdates}
                    onChange={(e) => setNotifications({...notifications, taxUpdates: e.target.checked})}
                    className="rounded border-gray-300" 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="return-status">Return status changes</Label>
                    <p className="text-sm text-muted-foreground">Get notified when your return status changes</p>
                  </div>
                  <input 
                    type="checkbox" 
                    id="return-status" 
                    checked={notifications.returnStatus}
                    onChange={(e) => setNotifications({...notifications, returnStatus: e.target.checked})}
                    className="rounded border-gray-300" 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing">Marketing communications</Label>
                    <p className="text-sm text-muted-foreground">Receive promotional emails and offers</p>
                  </div>
                  <input 
                    type="checkbox" 
                    id="marketing" 
                    checked={notifications.marketing}
                    onChange={(e) => setNotifications({...notifications, marketing: e.target.checked})}
                    className="rounded border-gray-300" 
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveNotifications}>Save Preferences</Button>
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
                  <Input 
                    id="current-password" 
                    type="password" 
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                  />
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
                <Button onClick={() => {
                  speak("Two-factor authentication setup coming soon.");
                  toast.info("Two-factor authentication setup coming soon");
                }}>Enable 2FA</Button>
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
                  View and manage your uploaded tax documents
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
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewDocument("W-2 Form (2023)", "/documents/w2-2023.pdf")}
                      >
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteDocument("W-2 Form (2023)")}
                      >
                        Delete
                      </Button>
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
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewDocument("1099-INT (2023)", "/documents/1099-int-2023.pdf")}
                      >
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteDocument("1099-INT (2023)")}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 p-6">
                  <div className="rounded-full bg-gray-100 p-3">
                    <File className="h-6 w-6 text-gray-500" />
                  </div>
                  <p className="text-sm text-center font-medium">Drag and drop files here or click to browse</p>
                  <p className="text-xs text-center text-gray-500">Upload your tax-related documents here</p>
                  <Button size="sm" variant="outline" className="mt-2" onClick={handleUploadDocument}>
                    Upload Document
                  </Button>
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
