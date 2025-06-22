
"use client";

import { useState, useEffect, useRef } from "react";
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
import { Switch } from "@/components/ui/switch";

type UserRole = "Admin" | "Student" | "Uploader";

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [editedUserData, setEditedUserData] = useState<{ name: string; role: UserRole; canChangeName: boolean }>({
    name: '',
    role: 'Student',
    canChangeName: true,
  });

  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', password: '', role: 'Student' as UserRole });
  const { toast } = useToast();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const loadUsers = () => {
        const processedUsers = initialUsers.map(user => {
            const storedAvatar = localStorage.getItem(`user-avatar-${user.id}`);
            const storedName = localStorage.getItem(`user-name-${user.id}`);
            return {
                ...user,
                name: storedName || user.name,
                avatar: storedAvatar || user.avatar,
            };
        });
        setUsers(processedUsers);
    };

    loadUsers();

    // Listen for avatar updates to refresh the list
    window.addEventListener('avatar-updated', loadUsers);
    return () => {
        window.removeEventListener('avatar-updated', loadUsers);
    };
  }, []);

  const handleOpenEditDialog = (user: User) => {
    setUserToEdit(user);
    setEditedUserData({
      name: user.name,
      role: user.role,
      canChangeName: user.canChangeName,
    });
    setAvatarPreview(null);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveUser = () => {
    if (!userToEdit) return;

    if (!editedUserData.name.trim()) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "User name cannot be empty.",
        });
        return;
    }

    const originalName = userToEdit.name;
    let photoUpdated = false;
    if (avatarPreview) {
      localStorage.setItem(`user-avatar-${userToEdit.id}`, avatarPreview);
      photoUpdated = true;
    }

    localStorage.setItem(`user-name-${userToEdit.id}`, editedUserData.name);
    
    // In a real app, we'd save these to the database.
    // For this mock, we'll update the initialUsers array to simulate persistence across reloads on this page.
    const userInMemory = initialUsers.find(u => u.id === userToEdit.id);
    if(userInMemory) {
      userInMemory.canChangeName = editedUserData.canChangeName;
      userInMemory.name = editedUserData.name;
      userInMemory.role = editedUserData.role;
      if (avatarPreview) {
        userInMemory.avatar = avatarPreview;
      }
    }

    setUsers(users.map(u => 
        u.id === userToEdit.id 
        ? { ...u, 
            name: editedUserData.name, 
            role: editedUserData.role,
            canChangeName: editedUserData.canChangeName, 
            avatar: avatarPreview || u.avatar
          } 
        : u
    ));
    
    // Notify other components if the user's details were edited by the admin
    if (photoUpdated || editedUserData.name !== originalName) {
        window.dispatchEvent(new Event('avatar-updated'));
    }

    toast({
      title: "User Updated",
      description: `${editedUserData.name || userToEdit.email.split('@')[0]}'s details have been updated.`,
    });
    setUserToEdit(null);
  };
  
  const handleDeleteUser = () => {
    if (!userToDelete) return;
    setUsers(users.filter(u => u.id !== userToDelete.id));
    toast({
      variant: "destructive",
      title: "User Deleted",
      description: `${userToDelete.name || userToDelete.email.split('@')[0]} has been removed.`,
    });
    setUserToDelete(null);
  };
  
  const handleAddNewUser = () => {
    if (!newUserData.name || !newUserData.email || !newUserData.password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Name, email, and password are required.",
      });
      return;
    }
    // In a real app, this password would be securely sent to a backend
    // to be hashed and stored, not kept in frontend state.
    const newUser: User = {
        id: `usr${users.length + 1}`,
        name: newUserData.name,
        email: newUserData.email,
        role: newUserData.role,
        avatar: 'https://placehold.co/100x100.png',
        status: 'offline',
        displayNameHidden: true,
        canChangeName: true,
    };
    setUsers([...users, newUser]);
    toast({
        title: "User Added",
        description: `${newUser.name} has been added as a ${newUser.role}.`,
    });
    setIsAddUserDialogOpen(false);
    setNewUserData({ name: '', email: '', password: '', role: 'Student' });
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
                        <AvatarFallback>{(user.name || user.email).charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name || user.email.split('@')[0]}</span>
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
                        <DropdownMenuItem onClick={() => handleOpenEditDialog(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={newUserData.password}
                onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
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

      {/* Edit User Dialog */}
      <Dialog open={!!userToEdit} onOpenChange={(isOpen) => !isOpen && setUserToEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit: {userToEdit?.name || userToEdit?.email.split('@')[0]}</DialogTitle>
            <DialogDescription>
              Modify user details, permissions, and profile picture.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
             <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarPreview || userToEdit?.avatar} data-ai-hint="person avatar" />
                <AvatarFallback>{(userToEdit?.name || userToEdit?.email || 'U').charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoChange}
                className="hidden"
                accept="image/*"
              />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>Change Photo</Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editedUserData.name}
                onChange={(e) => setEditedUserData({ ...editedUserData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={userToEdit?.email || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-select-edit">Role</Label>
              <Select value={editedUserData.role} onValueChange={(value: UserRole) => setEditedUserData({ ...editedUserData, role: value })}>
                <SelectTrigger id="role-select-edit">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Uploader">Uploader</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3.5">
              <div>
                <Label htmlFor="name-ban-switch" className="font-medium">Allow Name Change</Label>
                <p className="text-sm text-muted-foreground">
                  {editedUserData.canChangeName ? "User can edit their name." : "User is banned from editing their name."}
                </p>
              </div>
              <Switch
                id="name-ban-switch"
                checked={editedUserData.canChangeName}
                onCheckedChange={(checked) => setEditedUserData({ ...editedUserData, canChangeName: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToEdit(null)}>Cancel</Button>
            <Button onClick={handleSaveUser}>Save Changes</Button>
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
                  <AlertDialogAction onClick={handleDeleteUser} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>

    </AdminLayout>
  );
}

    