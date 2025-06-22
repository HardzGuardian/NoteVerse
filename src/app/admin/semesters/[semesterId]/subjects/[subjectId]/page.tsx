
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { semesters as allSemesters, PDF, Subject } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Download, Trash2, FolderOpen, MoreVertical, FileText, Upload } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type PDFTableProps = {
  pdfs: PDF[];
  onDownload: (title: string) => void;
  onDelete: (title: string) => void;
  onUpload: () => void;
  type: 'Note' | 'Exam';
};

const PDFTable = ({ pdfs, onDownload, onDelete, onUpload, type }: PDFTableProps) => {
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
                  <DropdownMenuItem onClick={() => onDownload(pdf.title)}>
                    <Download className="mr-2 h-4 w-4" /> Download
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                      onClick={() => onDelete(pdf.title)}
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

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSemester = allSemesters.find((s) => s.id === params.semesterId);
      const currentSubject = currentSemester?.subjects.find((sub) => sub.id === params.subjectId);
      setSubject(currentSubject);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [params.semesterId, params.subjectId]);
  
  const handleDownload = (title: string) => {
    toast({
      title: "Downloading...",
      description: `${title} has started downloading.`,
    });
  };

  const handleDelete = (title: string) => {
    toast({
      variant: "destructive",
      title: "Deleting...",
      description: `Request to delete ${title} sent.`,
    });
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

    const newPdf: PDF = {
      id: `pdf${Date.now()}`,
      title: newFileData.title,
      category: newFileData.category,
      url: "#", // In a real app, this would be the URL from blob storage
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updatedSubject = {
      ...subject,
      pdfs: [...subject.pdfs, newPdf],
    };
    setSubject(updatedSubject);
    // Note: This updates the local state for the UI. In a real app, you'd persist this change.

    toast({ title: "Success", description: `File "${newFileData.title}" uploaded.` });
    setIsUploadDialogOpen(false);
    setNewFileData({ title: "", category: "Note" });
    setFileToUpload(null);
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
          <p className="text-muted-foreground">Upload, download, or delete notes and exam papers.</p>
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
              <PDFTable pdfs={notes} onDownload={handleDownload} onDelete={handleDelete} type="Note" onUpload={() => setIsUploadDialogOpen(true)} />
            </TabsContent>
            <TabsContent value="exams">
              <PDFTable pdfs={exams} onDownload={handleDownload} onDelete={handleDelete} type="Exam" onUpload={() => setIsUploadDialogOpen(true)} />
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
              <Input id="file-upload" type="file" onChange={handleFileChange} />
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
    </AdminLayout>
  );
}
