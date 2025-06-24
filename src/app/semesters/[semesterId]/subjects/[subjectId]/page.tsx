
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Semester, PDF, Subject } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Download, FolderOpen, MoreVertical, FileText } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type PDFTableProps = {
  pdfs: PDF[];
  onDownload: (pdf: PDF) => void;
  type: 'Note' | 'Exam';
};

const PDFTable = ({ pdfs, onDownload, type }: PDFTableProps) => {
  const router = useRouter();

  if (pdfs.length === 0) {
    return (
      <CardContent className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mx-auto bg-secondary p-4 rounded-full">
          <FolderOpen className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No {type}s Available</h3>
        <p className="text-muted-foreground">The admin hasn't uploaded any {type.toLowerCase()}s for this subject yet.</p>
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
            <TableRow 
                key={pdf.id}
                className="cursor-pointer"
                onClick={() => router.push(`/view-pdf?fileId=${pdf.fileId}&title=${encodeURIComponent(pdf.title)}`)}
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground"/>
                    <span>{pdf.title}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">{pdf.createdAt}</TableCell>
              <TableCell className="text-right">
                <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onDownload(pdf)}>
                          <Download className="mr-2 h-4 w-4" /> Download
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
  )
};

export default function PDFsPage() {
  const params = useParams<{ semesterId: string; subjectId: string }>();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [subject, setSubject] = useState<Subject | undefined>();
  const [semesters, setSemesters] = useState<Semester[]>([]);

  useEffect(() => {
    setLoading(true);
    const savedSemestersRaw = localStorage.getItem('semesters');
    const allSemesters = savedSemestersRaw ? JSON.parse(savedSemestersRaw) : [];
    setSemesters(allSemesters);
    const semester = allSemesters.find((s) => s.id === params.semesterId);
    const currentSubject = semester?.subjects.find((sub) => sub.id === params.subjectId);
    setSubject(currentSubject);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [params.semesterId, params.subjectId]);
  
  const handleDownload = (pdf: PDF) => {
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${pdf.fileId}`;
    window.open(downloadUrl, '_blank');
    toast({
      title: "Downloading...",
      description: `${pdf.title} has started downloading.`,
    });
  };

  if (!subject && !loading) {
    return (
      <AppLayout pageTitle="Error">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Subject not found</h2>
          <Button asChild className="mt-4">
            <Link href={`/semesters/${params.semesterId}`}>Go Back</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }
  
  const notes = subject?.pdfs.filter(pdf => pdf.category === 'Note') || [];
  const exams = subject?.pdfs.filter(pdf => pdf.category === 'Exam') || [];


  return (
    <AppLayout pageTitle={subject?.name || "Loading..."}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Subject Files</h2>
          <p className="text-muted-foreground">All available notes and exam papers for this subject.</p>
        </div>
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
              <PDFTable pdfs={notes} onDownload={handleDownload} type="Note" />
            </TabsContent>
            <TabsContent value="exams">
              <PDFTable pdfs={exams} onDownload={handleDownload} type="Exam" />
            </TabsContent>
          </Tabs>
        )}
      </Card>
    </AppLayout>
  );
}
