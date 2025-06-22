
"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Trash2, Edit, UserPlus } from "lucide-react";
import { users as initialUsers, User } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type UserRole = "Admin" | "Student" | "Uploader";

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("Student");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', role: 'Student' as UserRole });
  const { toast } = useToast();

  const handleEditRole = (user: User) => {
    setUserToEdit(user);
    setSelectedRole(user.role);
  };

  const handleSaveRole = () => {
    if (!userToEdit) return;
    setUsers(users.map(u => u.id === userToEdit.id ? { ...u, role: selectedRole } : u));
    toast({
      title: "Role Updated",
      description: `${userToEdit.name}'s role has been updated to ${selectedRole}.`,
    });
    setUserToEdit(null);
  };
  
  const handleDeleteUser = () => {
    if (!userToDelete) return;
    setUsers(users.filter(u => u.id !== userToDelete.id));
    toast({
      variant: "destructive",
      title: "User Deleted",
      description: `${userToDelete.name} has been removed.`,
    });
    setUserToDelete(null);
  };
  
  const handleAddNewUser = () => {
    if (!newUserData.name || !newUserData.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Name and email are required.",
      });
      return;
    }
    const newUser: User = {
        id: `usr${users.length + 1}`,
        name: newUserData.name,
        email: newUserData.email,
        role: newUserData.role,
        avatar: 'https://placehold.co/100x100.png',
    };
    setUsers([...users, newUser]);
    toast({
        title: "User Added",
        description: `${newUser.name} has been added as a ${newUser.role}.`,
    });
    setIsAddUserDialogOpen(false);
    setNewUserData({ name: '', email: '', role: 'Student' });
  };

  const roleVariant = (role: UserRole) => {
    switch(role) {
      case 'Admin': return 'default';
      case 'Uploader': return 'secondary';
      case 'Student': return 'outline';
      default: return 'outline';
    }
  }

  return (
    <AdminLayout pageTitle="User Management">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manage Users</h2>
          <p className="text-muted-foreground">Edit roles or remove users from the system.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90" onClick={() => setIsAddUserDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} data-ai-hint="person avatar" />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={roleVariant(user.role)}>{user.role}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">User Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                         <DropdownMenuLabel>Actions</DropdownMenuLabel>
                         <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditRole(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setUserToDelete(user)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Enter the details for the new user and assign them a role.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
             <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                    id="name" 
                    placeholder="John Doe"
                    value={newUserData.name} 
                    onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                    id="email" 
                    type="email"
                    placeholder="john.doe@example.com"
                    value={newUserData.email} 
                    onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                />
            </div>
             <div className="space-y-2">
              <Label htmlFor="role-select-add">Role</Label>
              <Select value={newUserData.role} onValueChange={(value: UserRole) => setNewUserData({...newUserData, role: value})}>
                  <SelectTrigger id="role-select-add">
                      <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Uploader">Uploader</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddNewUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={!!userToEdit} onOpenChange={(isOpen) => !isOpen && setUserToEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role for {userToEdit?.name}</DialogTitle>
            <DialogDescription>
              Changing a user's role will alter their permissions across the application.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="role-select">User Role</Label>
            <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                <SelectTrigger id="role-select">
                    <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Uploader">Uploader</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToEdit(null)}>Cancel</Button>
            <Button onClick={handleSaveRole}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={(isOpen) => !isOpen && setUserToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the user account for {userToDelete?.name} and remove their data from our servers.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteUser}>Continue</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>

    </AdminLayout>
  );
}
