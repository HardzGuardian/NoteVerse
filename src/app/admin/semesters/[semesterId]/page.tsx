
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/admin-layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Semester, Subject } from "@/lib/data";
import { PlusCircle, FileText, FolderOpen, MoreVertical, Edit, Trash2 } from "lucide-react";

export default function AdminSubjectsPage() {
  const params = useParams<{ semesterId: string }>();
  const [loading, setLoading] = useState(true);
  const [semester, setSemester] = useState<Semester | undefined>();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");

  const [subjectToEdit, setSubjectToEdit] = useState<Subject | null>(null);
  const [editedSubjectName, setEditedSubjectName] = useState("");
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);

  const { toast } = useToast();
  
  const setUpdateNote = (message: string) => {
    const currentDate = new Date().toISOString().split('T')[0];
    localStorage.setItem('update-note-text', message);
    localStorage.setItem('update-note-date', currentDate);
  };

  useEffect(() => {
    setLoading(true);
    const savedSemestersRaw = localStorage.getItem('semesters');
    const allSemesters = savedSemestersRaw ? JSON.parse(savedSemestersRaw) : [];
    const foundSemester = allSemesters.find((s) => s.id === params.semesterId);
    setSemester(foundSemester ? JSON.parse(JSON.stringify(foundSemester)) : undefined);
    setLoading(false);
  }, [params.semesterId]);

  const updateSemestersInStorage = (updatedSemesters: Semester[]) => {
    localStorage.setItem('semesters', JSON.stringify(updatedSemesters));
  };

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Subject name cannot be empty." });
      return;
    }
    if (!semester) return;

    const newSubject: Subject = {
      id: `sub${Date.now()}`,
      name: newSubjectName,
      pdfs: [],
    };

    const savedSemestersRaw = localStorage.getItem('semesters');
    const allSemesters = savedSemestersRaw ? JSON.parse(savedSemestersRaw) : [];
    const updatedSemesters = allSemesters.map(s => {
        if (s.id === semester.id) {
            return { ...s, subjects: [...s.subjects, newSubject] };
        }
        return s;
    });

    updateSemestersInStorage(updatedSemesters);
    setSemester(prev => prev ? { ...prev, subjects: [...prev.subjects, newSubject] } : undefined);
    setUpdateNote(`New subject "${newSubjectName}" was added to ${semester.name}.`);
    toast({ title: "Success", description: "New subject added." });
    setNewSubjectName("");
    setIsAddDialogOpen(false);
  };

  const handleOpenEditDialog = (subject: Subject) => {
    setSubjectToEdit(subject);
    setEditedSubjectName(subject.name);
  };

  const handleUpdateSubject = () => {
    if (!subjectToEdit || !editedSubjectName.trim() || !semester) {
      toast({ variant: "destructive", title: "Error", description: "Subject name cannot be empty." });
      return;
    }
    
    const savedSemestersRaw = localStorage.getItem('semesters');
    const allSemesters = savedSemestersRaw ? JSON.parse(savedSemestersRaw) : [];
    const updatedSemesters = allSemesters.map(s => {
        if (s.id === semester.id) {
            const updatedSubjects = s.subjects.map(sub => 
                sub.id === subjectToEdit.id ? { ...sub, name: editedSubjectName } : sub
            );
            return { ...s, subjects: updatedSubjects };
        }
        return s;
    });
    
    updateSemestersInStorage(updatedSemesters);
    setSemester(prev => prev ? {
      ...prev,
      subjects: prev.subjects.map(s => (s.id === subjectToEdit.id ? { ...s, name: editedSubjectName } : s))
    } : undefined);
    setUpdateNote(`Subject "${subjectToEdit.name}" was renamed to "${editedSubjectName}" in ${semester.name}.`);
    toast({ title: "Success", description: `Subject renamed to "${editedSubjectName}".` });
    setSubjectToEdit(null);
  };
  
  const handleDeleteSubject = () => {
    if (!subjectToDelete || !semester) return;

    const savedSemestersRaw = localStorage.getItem('semesters');
    const allSemesters = savedSemestersRaw ? JSON.parse(savedSemestersRaw) : [];
    const updatedSemesters = allSemesters.map(s => {
        if (s.id === semester.id) {
            return { ...s, subjects: s.subjects.filter(sub => sub.id !== subjectToDelete.id) };
        }
        return s;
    });

    updateSemestersInStorage(updatedSemesters);
    setSemester(prev => prev ? {
        ...prev,
        subjects: prev.subjects.filter(s => s.id !== subjectToDelete.id)
    } : undefined);
    setUpdateNote(`Subject "${subjectToDelete.name}" was deleted from ${semester.name}.`);
    toast({ variant: "destructive", title: "Deleted", description: `Subject "${subjectToDelete.name}" has been deleted.` });
    setSubjectToDelete(null);
  };

  if (!semester && !loading) {
    return (
      <AdminLayout pageTitle="Error">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Semester not found</h2>
          <p className="text-muted-foreground">The requested semester does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/semesters">Go Back</Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle={semester?.name || "Loading..."}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manage Subjects</h2>
          <p className="text-muted-foreground">Add, rename, delete or select a subject to manage its files.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90" onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Subject
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : semester && semester.subjects.length > 0 ? (
        <div className="space-y-4">
          {semester.subjects.map((subject) => (
            <Card key={subject.id} className="relative hover:shadow-md hover:border-primary/50 transition-all duration-300">
                <div className="absolute top-2 right-2 z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenEditDialog(subject)}>
                          <Edit className="mr-2 h-4 w-4" /> Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSubjectToDelete(subject)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                 </div>
              <Link href={`/admin/semesters/${semester.id}/subjects/${subject.id}`} className="block h-full">
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <FileText className="h-6 w-6 text-primary" />
                        <div>
                            <p className="font-semibold">{subject.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {subject.pdfs.length} {subject.pdfs.length === 1 ? "PDF" : "PDFs"}
                            </p>
                        </div>
                    </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-20 text-center">
            <CardHeader>
                <div className="mx-auto bg-secondary p-4 rounded-full">
                    <FolderOpen className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardTitle className="mt-4">No Subjects Yet</CardTitle>
                <CardDescription>Add the first subject for this semester.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="bg-accent hover:bg-accent/90" onClick={() => setIsAddDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add First Subject
                </Button>
            </CardContent>
        </Card>
      )}

      {/* Add Subject Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
            <DialogDescription>Enter a name for the new subject.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label htmlFor="subject-name">Subject Name</Label>
            <Input 
              id="subject-name" 
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="e.g., Advanced Algorithms"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSubject}>Add Subject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Subject Dialog */}
      <Dialog open={!!subjectToEdit} onOpenChange={(isOpen) => !isOpen && setSubjectToEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Subject</DialogTitle>
            <DialogDescription>Enter a new name for "{subjectToEdit?.name}".</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label htmlFor="subject-name-edit">Subject Name</Label>
            <Input 
              id="subject-name-edit" 
              value={editedSubjectName}
              onChange={(e) => setEditedSubjectName(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubjectToEdit(null)}>Cancel</Button>
            <Button onClick={handleUpdateSubject}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!subjectToDelete} onOpenChange={(isOpen) => !isOpen && setSubjectToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the subject "{subjectToDelete?.name}" and all its files.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSubjectToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteSubject} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </AdminLayout>
  );
}
