
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
import { PlusCircle, Download, Trash2, FolderOpen, MoreVertical, FileText, Upload, Edit, Eye } from "lucide-react";
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
  onUpload: () => void;
  type: 'Note' | 'Exam';
};

const PDFTable = ({ pdfs, onDownload, onRename, onDelete, onUpload, type }: PDFTableProps) => {
  if (pdfs.length === 0) {
    return (
      <CardContent className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mx-auto bg-secondary p-4 rounded-full">
          <FolderOpen className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No {type}s Available</h3>
        <p className="text-muted-foreground">Upload the first {type.toLowerCase()} for this subject.</p>
        <Button className="mt-4 bg-accent hover:bg-accent/90" onClick={onUpload}>
          <PlusCircle className="mr-2 h-4 w-4" /> Upload First {type}
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
                      <Link href={`/view-pdf?url=${encodeURIComponent(pdf.url)}&title=${encodeURIComponent(pdf.title)}`} target="_blank">
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
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [newFileData, setNewFileData] = useState({ title: "", category: "Note" as "Note" | "Exam" });
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  
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
    const link = document.createElement("a");
    link.href = pdf.url;
    link.download = `${pdf.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    setUpdateNote(`File "${pdfToEdit.title}" was renamed to "${editedPdfTitle}" in ${subject.name}.`);
    toast({ title: "Success", description: `File renamed to "${editedPdfTitle}".` });
    setPdfToEdit(null);
  };
  
  const handleDeletePdf = () => {
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
    setUpdateNote(`File "${pdfToDelete.title}" was deleted from ${subject.name}.`);
    toast({ variant: "destructive", title: "Deleted", description: `File "${pdfToDelete.title}" has been deleted.` });
    setPdfToDelete(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileToUpload(e.target.files[0]);
    }
  };

  const handleUploadFile = () => {
    if (!newFileData.title.trim() || !fileToUpload) {
      toast({ variant: "destructive", title: "Error", description: "Please provide a title and select a file." });
      return;
    }
    if (!subject) return;

    const reader = new FileReader();
    reader.readAsDataURL(fileToUpload);
    reader.onloadend = () => {
        const fileAsDataUrl = reader.result as string;

        const newPdf: PDF = {
          id: `pdf${Date.now()}`,
          title: newFileData.title,
          category: newFileData.category,
          url: fileAsDataUrl,
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
        setUpdateNote(`New ${newFileData.category} "${newFileData.title}" was uploaded to ${subject.name}.`);
        toast({ title: "Success", description: `File "${newFileData.title}" uploaded.` });
        setIsUploadDialogOpen(false);
        setNewFileData({ title: "", category: "Note" });
        setFileToUpload(null);
    };
    reader.onerror = () => {
        console.error("Error reading file");
        toast({ variant: "destructive", title: "Error", description: "Could not read the selected file." });
    };
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
          <p className="text-muted-foreground">Upload, rename, or delete notes and exam papers.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90" onClick={() => setIsUploadDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Upload File
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
              <PDFTable pdfs={notes} onDownload={handleDownload} onRename={handleOpenEditDialog} onDelete={setPdfToDelete} type="Note" onUpload={() => setIsUploadDialogOpen(true)} />
            </TabsContent>
            <TabsContent value="exams">
              <PDFTable pdfs={exams} onDownload={handleDownload} onRename={handleOpenEditDialog} onDelete={setPdfToDelete} type="Exam" onUpload={() => setIsUploadDialogOpen(true)} />
            </TabsContent>
          </Tabs>
        )}
      </Card>
      
      {/* Upload File Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload a New File</DialogTitle>
            <DialogDescription>
              Choose a file, give it a title, and assign it to a category.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file-title">File Title</Label>
              <Input
                id="file-title"
                placeholder="e.g., Chapter 5 Summary"
                value={newFileData.title}
                onChange={(e) => setNewFileData({ ...newFileData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <RadioGroup
                value={newFileData.category}
                onValueChange={(value: "Note" | "Exam") => setNewFileData({ ...newFileData, category: value })}
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
            <div className="space-y-2">
              <Label htmlFor="file-upload">File</Label>
              <Input id="file-upload" type="file" onChange={handleFileChange} accept="application/pdf" />
              {fileToUpload && (
                <p className="text-sm text-muted-foreground">Selected: {fileToUpload.name}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUploadFile}><Upload className="mr-2 h-4 w-4"/> Upload</Button>
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
                      This action cannot be undone. This will permanently delete the file "{pdfToDelete?.title}".
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

    