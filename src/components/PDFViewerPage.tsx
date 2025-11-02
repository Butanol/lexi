import { useState, useEffect } from 'react';
import { FileText, X, FileCode } from 'lucide-react';

type PDF = {
  id: string;
  name: string;
  url: string;
  type: 'pdf';
};

type JSONDoc = {
  id: string;
  name: string;
  type: 'json';
};

type Document = PDF | JSONDoc;

export default function PDFViewerPage() {
  const [showViewer, setShowViewer] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [jsonRules, setJsonRules] = useState<any>(null);

  // Load JSON rules from file
  useEffect(() => {
    fetch('/rules/MAS_rules.json')
      .then(res => res.json())
      .then(data => setJsonRules(data))
      .catch(err => console.error('Error loading JSON rules:', err));
  }, []);

  const documents: Document[] = [
    { id: 'json-rules', name: 'MAS Notice 626 - JSON Rules', type: 'json' },
    { id: 'pdf-1', name: 'MAS Notice 626 30 June 2025', url: '/pdfs/MAS Notice 626 Amendment  new.pdf', type: 'pdf' },
    { id: 'pdf-2', name: 'MAS Notice 626 28 Mar 2024', url: '/pdfs/MAS Notice 626 dated 28 March 2024.pdf', type: 'pdf' },
    { id: 'pdf-3', name: 'MAS Notice 626 1 Mar 2022', url: '/pdfs/MAS Notice 626 Amendment 2022-4.pdf', type: 'pdf' },
    { id: 'pdf-4', name: 'MAS Notice 626 28 Jun 2021', url: '/pdfs/MAS Notice 626  Banks Tracked.pdf', type: 'pdf' },
    { id: 'pdf-5', name: 'MAS Notice 626 30 Nov 2015', url: '/pdfs/MAS Notice 626 Amendment Notice November 2015.pdf', type: 'pdf' },
  ];

  const handleOpenViewer = () => {
    setShowViewer(true);
    if (!selectedDoc && documents.length > 0) {
      setSelectedDoc(documents[0]);
    }
  };

  const handleCloseViewer = () => {
    setShowViewer(false);
  };

  if (!showViewer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4">
        <button
          onClick={handleOpenViewer}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
        >
          <FileText size={24} />
          <span>Open Document Viewer</span>
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-lg flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Documents</h2>
          <button
            onClick={handleCloseViewer}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Close viewer"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 flex items-center gap-3 ${
                selectedDoc?.id === doc.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
              }`}
            >
              {doc.type === 'json' ? (
                <FileCode
                  size={18}
                  className={selectedDoc?.id === doc.id ? 'text-blue-600' : 'text-gray-400'}
                />
              ) : (
                <FileText
                  size={18}
                  className={selectedDoc?.id === doc.id ? 'text-blue-600' : 'text-gray-400'}
                />
              )}
              <span
                className={`text-sm ${
                  selectedDoc?.id === doc.id ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                {doc.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Display Area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-sm px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">
            {selectedDoc ? selectedDoc.name : 'No document selected'}
          </h1>
        </div>

        <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          {selectedDoc ? (
            selectedDoc.type === 'pdf' ? (
              <iframe
                src={selectedDoc.url}
                className="w-full h-full bg-white rounded-md shadow-lg"
                title={selectedDoc.name}
              />
            ) : (
              <div className="max-w-5xl mx-auto">
                {/* Regulation Summary */}
                <div className="bg-white p-6 rounded-md shadow-sm mb-6">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Regulation Summary
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {jsonRules?.regulationsummary || 'Loading...'}
                  </p>
                </div>

                {/* Actionable Rules */}
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Actionable Rules
                </h2>
                <div className="space-y-4">
                  {jsonRules?.actionablerules?.map((rule: any) => (
                    <div key={rule.ruleid} className="bg-white p-6 rounded-md shadow-sm">
                      <h3 className="text-base font-semibold text-blue-600 mb-3">
                        {rule.ruleid}
                      </h3>

                      <div className="mb-4">
                        <p className="font-semibold text-gray-700 mb-1">Obligation:</p>
                        <p className="text-gray-600 text-sm">{rule.obligation}</p>
                      </div>

                      <div className="mb-4">
                        <p className="font-semibold text-gray-700 mb-1">Who it applies to:</p>
                        <p className="text-gray-600 text-sm">{rule.whoitappliesto}</p>
                      </div>

                      <div className="mb-4">
                        <p className="font-semibold text-gray-700 mb-2">Risk signals to monitor:</p>
                        <div className="space-y-1">
                          {rule.risksignalstomonitor.map((signal: string, idx: number) => (
                            <p key={idx} className="text-gray-600 text-sm pl-4">
                              • {signal}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="font-semibold text-gray-700 mb-2">
                          Required documents or controls:
                        </p>
                        <div className="space-y-1">
                          {rule.requireddocumentsorcontrols.map((doc: string, idx: number) => (
                            <p key={idx} className="text-gray-600 text-sm pl-4">
                              • {doc}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="font-semibold text-gray-700 mb-1">Requires EDD:</p>
                        <p className="text-gray-600 text-sm">{rule.requiresedd}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
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