"use client";

import React from 'react';
import { Button } from './ui/button';
import { DialogClose } from './ui/dialog';
import { X, Download, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface PdfViewerProps {
  fileId: string;
  title: string;
}

export default function PdfViewer({ fileId, title }: PdfViewerProps) {
  const { toast } = useToast();
  
  if (!fileId) {
    return (
        <div className="w-full h-full mx-auto flex flex-col items-center justify-center bg-muted p-4">
             <Alert variant="destructive" className="max-w-md">
                 <AlertTriangle className="h-4 w-4" />
                 <AlertTitle>Error: No File ID</AlertTitle>
                 <AlertDescription>
                    A file ID was not provided, so the document cannot be displayed.
                 </AlertDescription>
             </Alert>
        </div>
    );
  }

  // Use the Google Drive embeddable URL for iframes
  const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  const handleDownload = () => {
    window.open(downloadUrl, '_blank');
    toast({
      title: "Downloading...",
      description: `${title} has started downloading.`,
    });
  };

  return (
    <div className="w-full h-full mx-auto flex flex-col items-center bg-muted">
      <div className="w-full bg-card p-2 border-b shadow-sm sticky top-0 z-10 flex justify-between items-center">
        <h2 className="text-lg font-semibold px-2 truncate" title={title}>{title}</h2>
        <div className='flex items-center'>
            <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download"><Download className="h-5 w-5" /></Button>
            <div className="h-6 border-l mx-2" />
            <DialogClose asChild>
                <Button variant="ghost" size="icon" aria-label="Close viewer"><X className="h-5 w-5" /></Button>
            </DialogClose>
        </div>
      </div>
      <iframe
        src={embedUrl}
        title={title}
        className="w-full flex-1"
        frameBorder="0"
        allow="autoplay"
      />
    </div>
  );
}
