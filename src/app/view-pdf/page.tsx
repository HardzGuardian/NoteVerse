"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import PdfViewer from '@/components/pdf-viewer';

function PdfViewerPageContent() {
    const searchParams = useSearchParams();
    const fileId = searchParams.get('fileId');
    const pdfTitle = searchParams.get('title') || 'PDF Document';

    if (!fileId) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center p-8 bg-card rounded-lg shadow-md max-w-md">
                    <h2 className="text-2xl font-bold text-destructive">Error</h2>
                    <p className="text-muted-foreground mt-2">No PDF File ID was provided in the link.</p>
                </div>
            </div>
        );
    }
  
    return <PdfViewer fileId={fileId} title={pdfTitle} />;
}

const PdfViewerSkeleton = () => {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <Skeleton className="w-full h-[72px] rounded-t-lg" />
        <div className="w-full h-[calc(100vh-120px)] bg-muted rounded-b-lg border p-4 flex justify-center">
            <Skeleton className="h-[800px] w-[566px] bg-background" />
        </div>
      </div>
    );
};

export default function PdfViewerPage() {
    return (
        <div className="bg-background min-h-screen flex items-center justify-center p-4">
            <Suspense fallback={<PdfViewerSkeleton />}>
                <PdfViewerPageContent />
            </Suspense>
        </div>
    )
}
