
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";

interface UserRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: "open" | "answered" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  dateCreated: string;
  lastUpdated: string;
}

const RequestsPage: React.FC = () => {
  const { speak } = useVoiceAssistant();
  const [searchTerm, setSearchTerm] = useState("");
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);

  useEffect(() => {
    speak("User Requests dashboard loaded. You can view, filter, and respond to support tickets from this interface.");
  }, [speak]);
  const [selectedRequest, setSelectedRequest] = useState<UserRequest | null>(null);
  const [replyText, setReplyText] = useState("");
  
  const [filteredStatus, setFilteredStatus] = useState<string>("all");

  // Sample user requests data
  const [userRequests, setUserRequests] = useState<UserRequest[]>([
    {
      id: "1",
      userId: "user1",
      userName: "John Doe",
      userEmail: "john@example.com",
      subject: "Issue with W-2 Upload",
      message: "I'm having trouble uploading my W-2 form. The system keeps saying the file is too large, but it's only 2MB.",
      status: "open",
      priority: "high",
      dateCreated: "2025-04-12 10:23",
      lastUpdated: "2025-04-12 10:23"
    },
    {
      id: "2",
      userId: "user2",
      userName: "Sarah Johnson",
      userEmail: "sarah@example.com",
      subject: "Tax Credit Eligibility Question",
      message: "I'm wondering if I'm eligible for the Child and Dependent Care Credit. I have two children under 5 years old and pay for daycare.",
      status: "open",
      priority: "medium",
      dateCreated: "2025-04-11 14:45",
      lastUpdated: "2025-04-11 14:45"
    },
    {
      id: "3",
      userId: "user3",
      userName: "Michael Brown",
      userEmail: "michael@example.com",
      subject: "Need help with form 1099-MISC",
      message: "I received multiple 1099-MISC forms this year and I'm not sure how to properly report them on my tax return.",
      status: "answered",
      priority: "medium",
      dateCreated: "2025-04-10 09:15",
      lastUpdated: "2025-04-11 11:30"
    },
    {
      id: "4",
      userId: "user4",
      userName: "Lisa Chen",
      userEmail: "lisa@example.com",
      subject: "Password Reset Assistance",
      message: "I can't reset my password. The reset email never arrives. I've checked my spam folder.",
      status: "closed",
      priority: "low",
      dateCreated: "2025-04-08 16:20",
      lastUpdated: "2025-04-09 08:45"
    },
    {
      id: "5",
      userId: "user5",
      userName: "James Wilson",
      userEmail: "james@example.com",
      subject: "Amended Return Question",
      message: "I need to amend my 2022 tax return. How do I initiate this process through the platform?",
      status: "open",
      priority: "urgent",
      dateCreated: "2025-04-12 08:05",
      lastUpdated: "2025-04-12 08:05"
    }
  ]);

  const handleSendReply = () => {
    if (!selectedRequest || !replyText.trim()) return;
    
    // Update the request status to answered
    const updatedRequests = userRequests.map(request => {
      if (request.id === selectedRequest.id) {
        return {
          ...request,
          status: "answered" as const,
          lastUpdated: new Date().toISOString().split('T')[0] + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return request;
    });
    
    setUserRequests(updatedRequests);
    setIsReplyDialogOpen(false);
    setReplyText("");
    speak("Reply sent successfully. The user has been notified of your response.");
    toast.success("Reply sent successfully");
  };

  const handleCloseRequest = (id: string) => {
    const updatedRequests = userRequests.map(request => {
      if (request.id === id) {
        return {
          ...request,
          status: "closed" as const,
          lastUpdated: new Date().toISOString().split('T')[0] + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return request;
    });
    
    setUserRequests(updatedRequests);
    toast.success("Request marked as closed");
  };

  const filteredRequests = userRequests.filter(request => {
    const matchesSearch = 
      request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filteredStatus === "all" || request.status === filteredStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "urgent": return "destructive";
      case "high": return "outline";
      case "medium": return "secondary";
      case "low": return "default";
      default: return "default";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "open": return "outline";
      case "answered": return "secondary";
      case "closed": return "default";
      default: return "default";
    }
  };

  return (
    <MainLayout requiredPermission="answer_questions">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">User Requests</h1>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4 mb-4">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  type="search"
                  placeholder="Search requests..."
                  className="w-full"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <Button type="submit" variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant={filteredStatus === "all" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilteredStatus("all")}
                >
                  All
                </Button>
                <Button 
                  variant={filteredStatus === "open" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilteredStatus("open")}
                >
                  Open
                </Button>
                <Button 
                  variant={filteredStatus === "answered" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilteredStatus("answered")}
                >
                  Answered
                </Button>
                <Button 
                  variant={filteredStatus === "closed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilteredStatus("closed")}
                >
                  Closed
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Date Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.userName}</div>
                          <div className="text-xs text-muted-foreground">{request.userEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{request.subject}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(request.status)}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityBadgeVariant(request.priority)}>
                          {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.dateCreated}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRequest(request);
                              setIsReplyDialogOpen(true);
                            }}
                            disabled={request.status === "closed"}
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span className="sr-only">Reply</span>
                          </Button>
                          {request.status !== "closed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCloseRequest(request.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span className="sr-only">Mark as Closed</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Reply Dialog */}
        <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reply to Request</DialogTitle>
              <DialogDescription>
                Send a response to the user's inquiry
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {selectedRequest && (
                <>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">From: {selectedRequest.userName}</h4>
                    <h4 className="text-sm font-medium">Subject: {selectedRequest.subject}</h4>
                    <div className="rounded-md bg-muted p-3">
                      <p className="text-sm">{selectedRequest.message}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="reply" className="text-sm font-medium">Your Reply</label>
                    <textarea
                      id="reply"
                      className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background resize-y"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    ></textarea>
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSendReply}>Send Reply</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default RequestsPage;
