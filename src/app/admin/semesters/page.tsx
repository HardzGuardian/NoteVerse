
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin-layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { initialSemesters, Semester } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Book, RefreshCw, MoreVertical, Edit, Trash2 } from "lucide-react";

export default function AdminSemestersPage() {
  const [loading, setLoading] = useState(true);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const { toast } = useToast();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSemesterName, setNewSemesterName] = useState("");
  
  const [semesterToEdit, setSemesterToEdit] = useState<Semester | null>(null);
  const [editedSemesterName, setEditedSemesterName] = useState("");

  const [semesterToDelete, setSemesterToDelete] = useState<Semester | null>(null);

  useEffect(() => {
    const savedSemesters = localStorage.getItem('semesters');
    setSemesters(savedSemesters ? JSON.parse(savedSemesters) : initialSemesters);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const refreshData = () => {
    setLoading(true);
    localStorage.setItem('semesters', JSON.stringify(initialSemesters));
    setSemesters(initialSemesters);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleAddSemester = () => {
    if (!newSemesterName.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Semester name cannot be empty." });
      return;
    }
    const newSemester: Semester = {
      id: `sem${Date.now()}`,
      name: newSemesterName,
      subjects: [],
    };
    const updatedSemesters = [...semesters, newSemester];
    setSemesters(updatedSemesters);
    localStorage.setItem('semesters', JSON.stringify(updatedSemesters));
    toast({ title: "Success", description: "New semester added." });
    setNewSemesterName("");
    setIsAddDialogOpen(false);
  };

  const handleOpenEditDialog = (semester: Semester) => {
    setSemesterToEdit(semester);
    setEditedSemesterName(semester.name);
  };

  const handleUpdateSemester = () => {
    if (!semesterToEdit || !editedSemesterName.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Semester name cannot be empty." });
      return;
    }
    const updatedSemesters = semesters.map(s => (s.id === semesterToEdit.id ? { ...s, name: editedSemesterName } : s));
    setSemesters(updatedSemesters);
    localStorage.setItem('semesters', JSON.stringify(updatedSemesters));
    toast({ title: "Success", description: `Semester renamed to "${editedSemesterName}".` });
    setSemesterToEdit(null);
    setEditedSemesterName("");
  };

  const handleDeleteSemester = () => {
    if (!semesterToDelete) return;
    const updatedSemesters = semesters.filter(s => s.id !== semesterToDelete.id);
    setSemesters(updatedSemesters);
    localStorage.setItem('semesters', JSON.stringify(updatedSemesters));
    toast({ variant: "destructive", title: "Deleted", description: `Semester "${semesterToDelete.name}" has been deleted.` });
    setSemesterToDelete(null);
  };

  return (
    <AdminLayout pageTitle="Manage Semesters">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manage Semesters</h2>
          <p className="text-muted-foreground">Add, rename, or delete semesters.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData}><RefreshCw className="mr-2 h-4 w-4"/> Reset to Default</Button>
          <Button className="bg-accent hover:bg-accent/90" onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Semester
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-8 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))
          : semesters.map((semester) => (
              <Card key={semester.id} className="relative hover:shadow-lg hover:border-primary transition-all duration-300">
                 <div className="absolute top-2 right-2 z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenEditDialog(semester)}>
                          <Edit className="mr-2 h-4 w-4" /> Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSemesterToDelete(semester)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                 </div>
                <Link href={`/admin/semesters/${semester.id}`} className="block h-full">
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                      <Book className="h-6 w-6" />
                    </div>
                    <CardTitle className="font-headline text-2xl">{semester.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {semester.subjects.length} {semester.subjects.length === 1 ? "subject" : "subjects"}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))}
      </div>

      {/* Add Semester Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Semester</DialogTitle>
            <DialogDescription>Enter a name for the new semester.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label htmlFor="semester-name">Semester Name</Label>
            <Input 
              id="semester-name" 
              value={newSemesterName}
              onChange={(e) => setNewSemesterName(e.target.value)}
              placeholder="e.g., Semester 5"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSemester}>Add Semester</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Semester Dialog */}
      <Dialog open={!!semesterToEdit} onOpenChange={(isOpen) => !isOpen && setSemesterToEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Semester</DialogTitle>
            <DialogDescription>Enter a new name for "{semesterToEdit?.name}".</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label htmlFor="semester-name-edit">Semester Name</Label>
            <Input 
              id="semester-name-edit" 
              value={editedSemesterName}
              onChange={(e) => setEditedSemesterName(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSemesterToEdit(null)}>Cancel</Button>
            <Button onClick={handleUpdateSemester}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
       <AlertDialog open={!!semesterToDelete} onOpenChange={(isOpen) => !isOpen && setSemesterToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the semester "{semesterToDelete?.name}" and all its subjects and files.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setSemesterToDelete(null)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteSemester} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
