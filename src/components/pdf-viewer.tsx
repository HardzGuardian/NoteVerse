
'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set the workerSrc to a reliable CDN. This is the most common fix for "Failed to fetch" errors.
// We are pinning it to the exact version of pdfjs-dist we are using to ensure compatibility.
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="flex flex-col items-center justify-center text-center p-8 bg-destructive/10 text-destructive rounded-lg">
    <AlertCircle className="h-12 w-12 mb-4" />
    <h3 className="text-xl font-semibold mb-2">Failed to load PDF</h3>
    <p className="text-sm">The document could not be loaded. Please check the link or try again later.</p>
    <pre className="mt-4 text-xs text-left bg-destructive/20 p-2 rounded w-full max-w-md overflow-x-auto">
      <code>Error: {error.message}</code>
    </pre>
  </div>
);

export default function PdfViewer() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);

  const pdfUrl = searchParams.get('url');
  const pdfTitle = searchParams.get('title') || 'PDF Document';

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
    setLoadError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error while loading document!', error);
    setIsLoading(false);
    setLoadError(error);
    toast({
        variant: "destructive",
        title: "Error loading PDF",
        description: error.message || "Could not load the document.",
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
                  <Button variant="outline" onClick={() => setScale(s => s - 0.2)} disabled={scale <= 0.5 || !!loadError}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium w-12 text-center">{(scale * 100).toFixed(0)}%</span>
                  <Button variant="outline" onClick={() => setScale(s => s + 0.2)} disabled={scale >= 2 || !!loadError}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>

                  <div className="w-px h-6 bg-border mx-2" />

                  <Button variant="outline" onClick={goToPrevPage} disabled={pageNumber <= 1 || !!loadError}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium w-20 text-center">
                    Page {isLoading ? '...' : pageNumber} of {numPages ?? '...'}
                  </span>
                   <Button variant="outline" onClick={goToNextPage} disabled={!numPages || pageNumber >= numPages || !!loadError}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
              </div>
          </CardHeader>
          <CardContent className="flex justify-center bg-muted/50 p-4 min-h-[800px]">
              <div className="max-w-full overflow-x-auto">
                {isLoading && <Skeleton className="h-[800px] w-[566px] bg-muted" />}
                {!loadError ? (
                  <Document
                      file={pdfUrl}
                      onLoadSuccess={onDocumentLoadSuccess}
                      onLoadError={onDocumentLoadError}
                      loading={<Skeleton className="h-[800px] w-[566px] bg-muted" />}
                      className={isLoading ? 'hidden' : ''}
                  >
                      <Page pageNumber={pageNumber} scale={scale} renderTextLayer={true} />
                  </Document>
                ) : (
                  <ErrorFallback error={loadError} />
                )}
              </div>
          </CardContent>
        </Card>
    </AppLayout>
  );
}
