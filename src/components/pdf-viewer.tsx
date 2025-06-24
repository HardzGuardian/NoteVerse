
'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Configure the PDF.js worker using a reliable CDN.
// This dynamically creates the worker URL based on the installed version of pdfjs-dist.
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfViewer() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);

  const pdfUrl = searchParams.get('url');
  const pdfTitle = searchParams.get('title') || 'PDF Document';

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error while loading document!', error);
    setIsLoading(false);
    toast({
        variant: "destructive",
        title: "Error loading PDF",
        description: "Could not load the document. Please try again later.",
    });
  }

  function goToPrevPage() {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  }

  function goToNextPage() {
    if (numPages) {
        setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages));
    }
  }

  if (!pdfUrl) {
    return (
      <AppLayout pageTitle="PDF Viewer">
        <div className="text-center">
          <p>No PDF URL provided.</p>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout pageTitle={pdfTitle}>
        <Card className="w-full">
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <CardTitle className="truncate">{pdfTitle}</CardTitle>
              <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setScale(s => s - 0.2)} disabled={scale <= 0.5}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium w-12 text-center">{(scale * 100).toFixed(0)}%</span>
                  <Button variant="outline" onClick={() => setScale(s => s + 0.2)} disabled={scale >= 2}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>

                  <div className="w-px h-6 bg-border mx-2" />

                  <Button variant="outline" onClick={goToPrevPage} disabled={pageNumber <= 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium w-20 text-center">
                    Page {pageNumber} of {numPages ?? '...'}
                  </span>
                   <Button variant="outline" onClick={goToNextPage} disabled={!numPages || pageNumber >= numPages}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
              </div>
          </CardHeader>
          <CardContent className="flex justify-center bg-muted/50 p-4">
              <div className="max-w-full overflow-x-auto">
                {isLoading && <Skeleton className="h-[800px] w-[566px] bg-muted" />}
                <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={<Skeleton className="h-[800px] w-[566px] bg-muted" />}
                    className={isLoading ? 'hidden' : ''}
                >
                    <Page pageNumber={pageNumber} scale={scale} renderTextLayer={true} />
                </Document>
              </div>
          </CardContent>
        </Card>
    </AppLayout>
  );
}
