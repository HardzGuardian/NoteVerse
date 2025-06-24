"use client";

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertTriangle, ChevronLeft, ChevronRight, Download, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

// Set worker source from CDN
const pdfjsVersion = '4.4.170';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface PdfViewerProps {
  fileId: string;
  title?: string;
}

export default function PdfViewer({ fileId, title = "Document Viewer" }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const { toast } = useToast();

  const pdfUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setLoadError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error("Failed to load PDF:", error);
    setLoadError(error);
    toast({
        variant: "destructive",
        title: "Failed to load PDF",
        description: "The document could not be loaded. This might be due to sharing permissions on Google Drive or an invalid File ID."
    })
  }

  const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const rotate = () => setRotation(prev => (prev + 90) % 360);

  const handleDownload = () => {
    window.open(pdfUrl, '_blank');
  };
  
  const isLoading = numPages === null && !loadError;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      <div className="w-full bg-card rounded-t-lg border-x border-t p-2 sm:p-4 shadow-md sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <h2 className="text-lg font-bold font-headline truncate" title={title}>{title}</h2>
            {numPages && (
                 <div className="flex items-center gap-1 sm:gap-2">
                    <Button variant="ghost" size="icon" onClick={goToPrevPage} disabled={pageNumber <= 1}><ChevronLeft className="h-5 w-5" /></Button>
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Page {pageNumber} of {numPages}</span>
                    <Button variant="ghost" size="icon" onClick={goToNextPage} disabled={pageNumber >= numPages}><ChevronRight className="h-5 w-5" /></Button>
                    <div className="h-6 border-l mx-2" />
                    <Button variant="ghost" size="icon" onClick={zoomOut}><ZoomOut className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon" onClick={zoomIn}><ZoomIn className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon" onClick={rotate}><RotateCcw className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon" onClick={handleDownload}><Download className="h-5 w-5" /></Button>
                </div>
            )}
        </div>
      </div>
      <div className="w-full h-[calc(100vh-120px)] bg-muted overflow-auto rounded-b-lg border shadow-inner">
        <div className="p-4 flex justify-center">
            {isLoading && <Skeleton className="h-[800px] w-[566px] bg-background" />}
            {loadError && (
                 <div className="flex items-center justify-center h-full p-8">
                     <Alert variant="destructive" className="max-w-md">
                         <AlertTriangle className="h-4 w-4" />
                         <AlertTitle>Error Loading Document</AlertTitle>
                         <AlertDescription>
                            We couldn't load the PDF file. Please ensure the Google Drive link is correct and has public sharing enabled.
                            <pre className="mt-2 text-xs bg-destructive/20 p-2 rounded">Error: {loadError.message}</pre>
                         </AlertDescription>
                     </Alert>
                 </div>
            )}
            {!isLoading && !loadError && (
                <Document
                    file={{ url: pdfUrl }}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    options={{
                        cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsVersion}/cmaps/`,
                        cMapPacked: true,
                    }}
                    className="flex justify-center"
                >
                    <Page 
                        pageNumber={pageNumber} 
                        scale={scale} 
                        rotate={rotation}
                        className="shadow-lg"
                    />
                </Document>
            )}
        </div>
      </div>
    </div>
  );
}
