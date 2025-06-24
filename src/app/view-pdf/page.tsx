
"use client";

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const PdfViewerSkeleton = () => (
    <AppLayout pageTitle="Loading PDF...">
        <Card className="w-full">
            <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-10 w-80" />
            </CardHeader>
            <CardContent className="flex justify-center bg-muted/50 p-4">
                <Skeleton className="h-[800px] w-[566px] bg-muted" />
            </CardContent>
        </Card>
    </AppLayout>
);

// Dynamically import the viewer component with SSR turned off.
// This prevents the react-pdf library from being loaded on the server.
const PdfViewer = dynamic(() => import('@/components/pdf-viewer'), { 
    ssr: false,
    loading: () => <PdfViewerSkeleton />
});

export default function PdfViewerPage() {
    // The Suspense boundary is required because the dynamically loaded
    // component uses the useSearchParams() hook.
    return (
        <Suspense fallback={<PdfViewerSkeleton />}>
            <PdfViewer />
        </Suspense>
    )
}
