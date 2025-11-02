import { useState } from 'react';
import { FileText, X } from 'lucide-react';

type PDF = {
  id: number;
  name: string;
  url: string;
};

export default function PDFViewerPage() {
  const [showViewer, setShowViewer] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<PDF | null>(null);

  const pdfList: PDF[] = [
    { id: 1, name: 'MAS Notice 626 30 June 2025', url: '/pdfs/MAS Notice 626 Amendment  new.pdf' },
    { id: 2, name: 'MAS Notice 626 28 Mar 2024', url: '/pdfs/MAS Notice 626 dated 28 March 2024.pdf' },
    { id: 3, name: 'MAS Notice 626 1 Mar 2022', url: '/pdfs/MAS Notice 626 Amendment 2022-4.pdf' },
    { id: 4, name: 'MAS Notice 626 28 Jun 2021', url: '/pdfs/MAS Notice 626  Banks Tracked.pdf' },
    { id: 5, name: 'MAS Notice 626 30 Nov 2015', url: '/pdfs/MAS Notice 626 Amendment Notice November 2015.pdf' },
  ];

  const handleOpenViewer = () => {
    setShowViewer(true);
    if (!selectedPdf && pdfList.length > 0) {
      setSelectedPdf(pdfList[0]);
    }
  };

  const handleClosViewer = () => {
    setShowViewer(false);
  };

  if (!showViewer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <button
          onClick={handleOpenViewer}
          className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <FileText size={24} />
          Open PDF Viewer
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Documents</h2>
          <button
            onClick={handleClosViewer}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Close viewer"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {pdfList.map((pdf) => (
            <button
              key={pdf.id}
              onClick={() => setSelectedPdf(pdf)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 flex items-center gap-3 ${
                selectedPdf?.id === pdf.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''
              }`}
            >
              <FileText 
                size={18} 
                className={selectedPdf?.id === pdf.id ? 'text-indigo-600' : 'text-gray-400'}
              />
              <span className={`text-sm ${
                selectedPdf?.id === pdf.id ? 'text-indigo-600 font-medium' : 'text-gray-700'
              }`}>
                {pdf.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main PDF Display Area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-sm px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">
            {selectedPdf ? selectedPdf.name : 'No document selected'}
          </h1>
        </div>
        
        <div className="flex-1 bg-gray-200 p-4 overflow-hidden">
          {selectedPdf ? (
            <iframe
              src={selectedPdf.url}
              className="w-full h-full bg-white rounded shadow-lg"
              title={selectedPdf.name}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">Select a document from the sidebar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}