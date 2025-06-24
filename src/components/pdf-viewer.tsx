import React from 'react';

interface PdfViewerProps {
  url: string;
  title?: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url, title = "Document Viewer" }) => {
  return (
    <div className="w-full h-[90vh] rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-lg font-semibold p-4">
        {title}
      </div>
      <iframe
        src={url}
        title={title}
        className="w-full h-full"
        style={{ border: 'none' }}
      />
    </div>
  );
};

export default PdfViewer;
