"use client";

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertTriangle, ChevronLeft, ChevronRight, Download, RotateCcw, ZoomIn, ZoomOut, X } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { DialogClose } from './ui/dialog';

// This is the new, correct way. It ensures the worker version always matches the library version.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PdfViewerProps {
  fileId: string;
  title: string;
}

export default function PdfViewer({ fileId, title }: PdfViewerProps) {
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
  }

  const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const rotate = () => setRotation(prev => (prev + 90) % 360);

  const handleDownload = () => {
    window.open(pdfUrl, '_blank');
    toast({
      title: "Downloading...",
      description: `${title} has started downloading.`,
    });
  };
  
  const isLoading = numPages === null && !loadError;

  return (
    <div className="w-full h-full mx-auto flex flex-col items-center bg-muted">
      <div className="w-full bg-card p-2 border-b shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={goToPrevPage} disabled={!numPages || pageNumber <= 1} aria-label="Previous Page"><ChevronLeft className="h-5 w-5" /></Button>
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap w-24 text-center">
                    {numPages ? `Page ${pageNumber} / ${numPages}` : 'Loading...'}
                </span>
                <Button variant="ghost" size="icon" onClick={goToNextPage} disabled={!numPages || pageNumber >= numPages} aria-label="Next Page"><ChevronRight className="h-5 w-5" /></Button>
            </div>
            
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={zoomOut} disabled={!numPages} aria-label="Zoom Out"><ZoomOut className="h-5 w-5" /></Button>
                <span className='text-sm font-medium text-muted-foreground w-12 text-center'>
                    {Math.round(scale * 100)}%
                </span>
                <Button variant="ghost" size="icon" onClick={zoomIn} disabled={!numPages} aria-label="Zoom In"><ZoomIn className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon" onClick={rotate} disabled={!numPages} aria-label="Rotate"><RotateCcw className="h-5 w-5" /></Button>
            </div>

            <div className='flex items-center'>
                <Button variant="ghost" size="icon" onClick={handleDownload} disabled={isLoading} aria-label="Download"><Download className="h-5 w-5" /></Button>
                <div className="h-6 border-l mx-2" />
                <DialogClose asChild>
                    <Button variant="ghost" size="icon" aria-label="Close viewer"><X className="h-5 w-5" /></Button>
                </DialogClose>
            </div>
        </div>
      </div>
      <div className="w-full flex-1 overflow-auto">
        <div className="p-4 flex justify-center">
            {loadError ? (
                 <div className="flex items-center justify-center h-full p-8 mt-10">
                     <Alert variant="destructive" className="max-w-md">
                         <AlertTriangle className="h-4 w-4" />
                         <AlertTitle>Error Loading Document</AlertTitle>
                         <AlertDescription>
                            We couldn't load the PDF. This can happen if the file is private or the link is incorrect. Please ensure the Google Drive file is shared with "Anyone with the link".
                         </AlertDescription>
                     </Alert>
                 </div>
            ) : (
                <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={<Skeleton className="h-[842px] w-[595px] bg-background" />}
                    className="flex justify-center"
                >
                    <Page 
                        pageNumber={pageNumber} 
                        scale={scale} 
                        rotate={rotation}
                        className="shadow-lg"
                        loading={<Skeleton className="h-[842px] w-[595px] bg-background" />}
                    />
                </Document>
            )}
        </div>
      </div>
    </div>
  );
}
