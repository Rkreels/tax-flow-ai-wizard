
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Lock, Plus, Search, Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";
import { UserRole } from "@/contexts/AuthContext";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "inactive" | "pending";
  lastLogin: string;
}

const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user" as UserRole,
    password: ""
  });

  // Sample users data
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      status: "active",
      lastLogin: "2025-04-12 09:32"
    },
    {
      id: "2",
      name: "John Doe",
      email: "user@example.com",
      role: "user",
      status: "active",
      lastLogin: "2025-04-11 14:15"
    },
    {
      id: "3",
      name: "Support Agent",
      email: "support@example.com",
      role: "support",
      status: "active",
      lastLogin: "2025-04-10 11:20"
    },
    {
      id: "4",
      name: "Tax Professional",
      email: "accountant@example.com",
      role: "accountant",
      status: "active",
      lastLogin: "2025-04-09 16:45"
    },
    {
      id: "5",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "user",
      status: "inactive",
      lastLogin: "2025-03-15 08:22"
    }
  ]);

  const handleAddUser = () => {
    const user = {
      id: `${users.length + 1}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "active" as const,
      lastLogin: "Never"
    };

    setUsers([...users, user]);
    setIsAddDialogOpen(false);
    setNewUser({ name: "", email: "", role: "user", password: "" });
    toast.success("User added successfully");
  };

  const handleEditUser = () => {
    if (!selectedUser) return;

    const updatedUsers = users.map(user => {
      if (user.id === selectedUser.id) {
        return selectedUser;
      }
      return user;
    });

    setUsers(updatedUsers);
    setIsEditDialogOpen(false);
    toast.success("User updated successfully");
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    const updatedUsers = users.filter(user => user.id !== selectedUser.id);
    setUsers(updatedUsers);
    setIsDeleteDialogOpen(false);
    toast.success("User deleted successfully");
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800";
      case "accountant": return "bg-green-100 text-green-800";
      case "support": return "bg-blue-100 text-blue-800";
      case "user": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <MainLayout requiredPermission="manage_users">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
              <Input
                type="search"
                placeholder="Search users..."
                className="w-full"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Button type="submit" variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getRoleBadgeClass(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeClass(user.status)}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </div>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Add User Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">Role</label>
                <select
                  id="role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="user">User</option>
                  <option value="accountant">Accountant</option>
                  <option value="support">Support</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information.
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="edit-name" className="text-sm font-medium">Full Name</label>
                  <Input
                    id="edit-name"
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-email" className="text-sm font-medium">Email Address</label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-role" className="text-sm font-medium">Role</label>
                  <select
                    id="edit-role"
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value as UserRole })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="user">User</option>
                    <option value="accountant">Accountant</option>
                    <option value="support">Support</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-status" className="text-sm font-medium">Status</label>
                  <select
                    id="edit-status"
                    value={selectedUser.status}
                    onChange={(e) => setSelectedUser({ 
                      ...selectedUser, 
                      status: e.target.value as "active" | "inactive" | "pending" 
                    })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary">
                    <Lock className="h-4 w-4 mr-1" />
                    Reset Password
                  </Button>
                  <Button size="sm" variant="secondary">
                    <UserCog className="h-4 w-4 mr-1" />
                    Manage Permissions
                  </Button>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEditUser}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedUser && (
                <div className="space-y-2">
                  <p><strong>Name:</strong> {selectedUser.name}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Role:</strong> {selectedUser.role}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteUser}>Delete User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default UsersPage;
