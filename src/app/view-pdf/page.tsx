"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import PdfViewer from '@/components/pdf-viewer';

function PdfViewerPageContent() {
    const searchParams = useSearchParams();
    const pdfUrl = searchParams.get('url');
    const pdfTitle = searchParams.get('title') || 'PDF Document';

    if (!pdfUrl) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center p-8 bg-card rounded-lg shadow-md max-w-md">
                    <h2 className="text-2xl font-bold text-destructive">Error</h2>
                    <p className="text-muted-foreground mt-2">No PDF URL was provided in the link.</p>
                </div>
            </div>
        );
    }
  
    return <PdfViewer url={pdfUrl} title={pdfTitle} />;
}

const PdfViewerSkeleton = () => {
    return (
        <div className="w-full h-[90vh] rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
            <Skeleton className="h-[52px] w-full" />
            <div className="w-full h-full bg-muted" />
        </div>
    );
};

export default function PdfViewerPage() {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4">
            <Suspense fallback={<PdfViewerSkeleton />}>
                <PdfViewerPageContent />
            </Suspense>
        </div>
    )
}
