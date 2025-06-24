
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/admin-layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PDF, Subject, Semester } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Download, Trash2, FolderOpen, MoreVertical, FileText, Edit, Eye, Link2, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type PDFTableProps = {
  pdfs: PDF[];
  onDownload: (pdf: PDF) => void;
  onRename: (pdf: PDF) => void;
  onDelete: (pdf: PDF) => void;
  onAdd: () => void;
  type: 'Note' | 'Exam';
};

const PDFTable = ({ pdfs, onDownload, onRename, onDelete, onAdd, type }: PDFTableProps) => {
  if (pdfs.length === 0) {
    return (
      <CardContent className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mx-auto bg-secondary p-4 rounded-full">
          <FolderOpen className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No {type}s Available</h3>
        <p className="text-muted-foreground">Add the first {type.toLowerCase()} for this subject.</p>
        <Button className="mt-4 bg-accent hover:bg-accent/90" onClick={onAdd}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add First {type}
        </Button>
      </CardContent>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead className="hidden md:table-cell">Date Added</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pdfs.map((pdf) => (
          <TableRow key={pdf.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground"/>
                <span>{pdf.title}</span>
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell text-muted-foreground">{pdf.createdAt}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                      <Link href={`/view-pdf?fileId=${pdf.fileId}&title=${encodeURIComponent(pdf.title)}`} target="_blank">
                          <Eye className="mr-2 h-4 w-4" /> View
                      </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDownload(pdf)}>
                    <Download className="mr-2 h-4 w-4" /> Download
                  </DropdownMenuItem>
                   <DropdownMenuItem onClick={() => onRename(pdf)}>
                    <Edit className="mr-2 h-4 w-4" /> Rename
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                      onClick={() => onDelete(pdf)}
                      className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};


export default function AdminPDFsPage() {
  const params = useParams<{ semesterId: string; subjectId: string }>();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const [subject, setSubject] = useState<Subject | undefined>();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPdfData, setNewPdfData] = useState({ title: "", fileId: "", category: "Note" as "Note" | "Exam" });
  
  const [pdfToEdit, setPdfToEdit] = useState<PDF | null>(null);
  const [editedPdfTitle, setEditedPdfTitle] = useState("");
  
  const [pdfToDelete, setPdfToDelete] = useState<PDF | null>(null);

  const setUpdateNote = (message: string) => {
    const currentDate = new Date().toISOString().split('T')[0];
    localStorage.setItem('update-note-text', message);
    localStorage.setItem('update-note-date', currentDate);
  };

  useEffect(() => {
    setLoading(true);
    const savedSemestersRaw = localStorage.getItem('semesters');
    const allSemesters = savedSemestersRaw ? JSON.parse(savedSemestersRaw) : [];
    const currentSemester = allSemesters.find((s) => s.id === params.semesterId);
    const currentSubject = currentSemester?.subjects.find((sub) => sub.id === params.subjectId);
    setSubject(currentSubject ? JSON.parse(JSON.stringify(currentSubject)) : undefined);
    setLoading(false);
  }, [params.semesterId, params.subjectId]);

  const updateSemestersInStorage = (updatedSemesters: Semester[]) => {
    localStorage.setItem('semesters', JSON.stringify(updatedSemesters));
  };
  
  const handleDownload = (pdf: PDF) => {
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${pdf.fileId}`;
    window.open(downloadUrl, '_blank');
    toast({
      title: "Downloading...",
      description: `${pdf.title} has started downloading.`,
    });
  };
  
  const handleOpenEditDialog = (pdf: PDF) => {
    setPdfToEdit(pdf);
    setEditedPdfTitle(pdf.title);
  };
  
  const handleUpdatePdf = () => {
    if (!pdfToEdit || !editedPdfTitle.trim() || !subject) {
        toast({ variant: "destructive", title: "Error", description: "File title cannot be empty." });
        return;
    }

    const savedSemestersRaw = localStorage.getItem('semesters');
    const allSemesters = savedSemestersRaw ? JSON.parse(savedSemestersRaw) : [];
    const updatedSemesters = allSemesters.map(s => {
        if (s.id === params.semesterId) {
            const updatedSubjects = s.subjects.map(sub => {
                if (sub.id === params.subjectId) {
                    const updatedPdfs = sub.pdfs.map(p => 
                        p.id === pdfToEdit.id ? { ...p, title: editedPdfTitle } : p
                    );
                    return { ...sub, pdfs: updatedPdfs };
                }
                return sub;
            });
            return { ...s, subjects: updatedSubjects };
        }
        return s;
    });

    updateSemestersInStorage(updatedSemesters);
    setSubject(prev => prev ? {
      ...prev,
      pdfs: prev.pdfs.map(p => p.id === pdfToEdit.id ? { ...p, title: editedPdfTitle } : p)
    } : undefined);
    setUpdateNote(`A file has been updated! The document formerly known as "${pdfToEdit.title}" is now named "${editedPdfTitle}" in the ${subject.name} subject. 🔄`);
    toast({ title: "Success", description: `File renamed to "${editedPdfTitle}".` });
    setPdfToEdit(null);
  };
  
  const handleDeletePdf = async () => {
    if (!pdfToDelete || !subject) return;

    const savedSemestersRaw = localStorage.getItem('semesters');
    const allSemesters = savedSemestersRaw ? JSON.parse(savedSemestersRaw) : [];
    const updatedSemesters = allSemesters.map(s => {
        if (s.id === params.semesterId) {
            const updatedSubjects = s.subjects.map(sub => {
                if (sub.id === params.subjectId) {
                    return { ...sub, pdfs: sub.pdfs.filter(p => p.id !== pdfToDelete.id) };
                }
                return sub;
            });
            return { ...s, subjects: updatedSubjects };
        }
        return s;
    });

    updateSemestersInStorage(updatedSemesters);
    setSubject(prev => prev ? {
      ...prev,
      pdfs: prev.pdfs.filter(p => p.id !== pdfToDelete.id)
    } : undefined);
    setUpdateNote(`Heads up! The file "${pdfToDelete.title}" has been removed from the ${subject.name} subject. 🧹`);
    toast({ variant: "destructive", title: "Deleted", description: `File "${pdfToDelete.title}" has been deleted.` });
    setPdfToDelete(null);
  };

  const handleAddPdf = async () => {
    if (!newPdfData.title.trim() || !newPdfData.fileId.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Please provide a title and a Google Drive File ID." });
      return;
    }
    if (!subject) return;

      const newPdf: PDF = {
        id: `pdf${Date.now()}`,
        title: newPdfData.title,
        fileId: newPdfData.fileId,
        category: newPdfData.category,
        createdAt: new Date().toISOString().split('T')[0],
      };

      const savedSemestersRaw = localStorage.getItem('semesters');
      const allSemesters = savedSemestersRaw ? JSON.parse(savedSemestersRaw) : [];
      const updatedSemesters = allSemesters.map(s => {
          if (s.id === params.semesterId) {
              const updatedSubjects = s.subjects.map(sub => {
                  if (sub.id === params.subjectId) {
                      return { ...sub, pdfs: [...sub.pdfs, newPdf] };
                  }
                  return sub;
              });
              return { ...s, subjects: updatedSubjects };
          }
          return s;
      });
      
      updateSemestersInStorage(updatedSemesters);
      setSubject(prev => prev ? { ...prev, pdfs: [...prev.pdfs, newPdf] } : undefined);
      
      const updateMessage = newPdfData.category === 'Note'
        ? `New study material available! 📄 Check out the notes for "${newPdfData.title}" in the ${subject.name} subject.`
        : `Get ready to practice! 📝 A new exam paper for "${newPdfData.title}" has been uploaded under ${subject.name}.`;
      setUpdateNote(updateMessage);

      toast({ title: "Success", description: `PDF "${newPdfData.title}" added.` });

      setIsAddDialogOpen(false);
      setNewPdfData({ title: "", fileId: "", category: "Note" });
  };


  if (!subject && !loading) {
    return (
      <AdminLayout pageTitle="Error">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Subject not found</h2>
          <Button asChild className="mt-4">
            <Link href={`/admin/semesters/${params.semesterId}`}>Go Back</Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const notes = subject?.pdfs.filter(pdf => pdf.category === 'Note') || [];
  const exams = subject?.pdfs.filter(pdf => pdf.category === 'Exam') || [];

  return (
    <AdminLayout pageTitle={subject?.name || "Loading..."}>
       <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manage Subject Files</h2>
          <p className="text-muted-foreground">Add, rename, or delete notes and exam papers from Google Drive.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90" onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add PDF
        </Button>
      </div>

      <Card>
        {loading ? (
          <div className="p-4 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <Tabs defaultValue="notes">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
              <TabsTrigger value="exams">Exams ({exams.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="notes">
              <PDFTable pdfs={notes} onDownload={handleDownload} onRename={handleOpenEditDialog} onDelete={setPdfToDelete} type="Note" onAdd={() => setIsAddDialogOpen(true)} />
            </TabsContent>
            <TabsContent value="exams">
              <PDFTable pdfs={exams} onDownload={handleDownload} onRename={handleOpenEditDialog} onDelete={setPdfToDelete} type="Exam" onAdd={() => setIsAddDialogOpen(true)} />
            </TabsContent>
          </Tabs>
        )}
      </Card>
      
      {/* Add PDF Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add PDF from Google Drive</DialogTitle>
            <DialogDescription>
              Enter the PDF title and its Google Drive File ID. Ensure the file is publicly accessible.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pdf-title">PDF Title</Label>
              <Input
                id="pdf-title"
                placeholder="e.g., Chapter 5 Summary"
                value={newPdfData.title}
                onChange={(e) => setNewPdfData({ ...newPdfData, title: e.target.value })}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="file-id">Google Drive File ID</Label>
              <Input
                id="file-id"
                placeholder="e.g., 1-AbCDeFgHiJkLmNoPqRsTuVwXyZ"
                value={newPdfData.fileId}
                onChange={(e) => setNewPdfData({ ...newPdfData, fileId: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <RadioGroup
                value={newPdfData.category}
                onValueChange={(value: "Note" | "Exam") => setNewPdfData({ ...newPdfData, category: value })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Note" id="r-note" />
                  <Label htmlFor="r-note">Note</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Exam" id="r-exam" />
                  <Label htmlFor="r-exam">Exam</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddPdf}>
                <Link2 className="mr-2 h-4 w-4"/>
                Add PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit PDF Dialog */}
      <Dialog open={!!pdfToEdit} onOpenChange={(isOpen) => !isOpen && setPdfToEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename File</DialogTitle>
            <DialogDescription>Enter a new title for "{pdfToEdit?.title}".</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label htmlFor="pdf-title-edit">File Title</Label>
            <Input 
              id="pdf-title-edit" 
              value={editedPdfTitle}
              onChange={(e) => setEditedPdfTitle(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPdfToEdit(null)}>Cancel</Button>
            <Button onClick={handleUpdatePdf}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
       <AlertDialog open={!!pdfToDelete} onOpenChange={(isOpen) => !isOpen && setPdfToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the reference to the file "{pdfToDelete?.title}". It will not delete the file from your Google Drive.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setPdfToDelete(null)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeletePdf} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
