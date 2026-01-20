import { useState, useEffect } from 'react';
import { FiFileText, FiX, FiFile } from 'react-icons/fi';

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

type PDFViewerPageProps = {
  onClose?: () => void;
};

export default function PDFViewerPage({ onClose }: PDFViewerPageProps) {
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

  useEffect(() => {
    if (documents.length > 0 && !selectedDoc) {
      setSelectedDoc(documents[0]);
    }
  }, [selectedDoc]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/5 bg-white shadow flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-gray-800">Documents</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100"
            title="Back to transactions"
          >
            <FiX size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={`w-full text-left px-4 py-2 flex items-center gap-2 border-l-4 transition ${
                selectedDoc?.id === doc.id
                  ? 'bg-blue-50 border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-700 hover:bg-gray-50'
              }`}
            >
              {doc.type === 'json' ? <FiFile size={18} /> : <FiFileText size={18} />}
              {doc.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden items-center">
        <div className="bg-white p-4 border-b">
          <h1 className="text-xl font-semibold text-gray-800 width-full py-10 items-center">
            {selectedDoc?.name || 'Select a document'}
          </h1>
        </div>

        <div className="flex-1 bg-gray-50 flex justify-center items-center">
          {selectedDoc ? (
            selectedDoc.type === 'pdf' ? (
              <iframe
                src={selectedDoc.url}
                title={selectedDoc.name}
      className="rounded shadow"
      style={{
        width: '100%',
        height: '100%',
        maxWidth: '1200px', // limit to max width
        minHeight: '800px',
        maxHeight: '1200px',  // limit to max height
        border: 'none',
      }}
              />
            ) : (
              <div className="space-y-4 max-w-4xl mx-auto">
                <div className="bg-white p-4 rounded shadow">
                  <h2 className="font-semibold text-gray-800 mb-2">Regulation Summary</h2>
                  <p className="text-gray-700">
                    {jsonRules?.regulationsummary || 'Loading...'}
                  </p>
                </div>

                <h2 className="text-lg font-semibold text-gray-800">Actionable Rules</h2>
                {jsonRules?.actionablerules?.map((rule: any) => (
                  <div key={rule.ruleid} className="bg-white p-4 rounded shadow space-y-2">
                    <h3 className="font-semibold text-blue-600">{rule.ruleid}</h3>
                    <p><strong>Obligation:</strong> {rule.obligation}</p>
                    <p><strong>Who it applies to:</strong> {rule.whoitappliesto}</p>
                    <p><strong>Risk signals to monitor:</strong></p>
                    <ul className="list-disc list-inside ml-4">
                      {rule.risksignalstomonitor.map((signal: string, idx: number) => (
                        <li key={idx}>{signal}</li>
                      ))}
                    </ul>
                    <p><strong>Required documents or controls:</strong></p>
                    <ul className="list-disc list-inside ml-4">
                      {rule.requireddocumentsorcontrols.map((doc: string, idx: number) => (
                        <li key={idx}>{doc}</li>
                      ))}
                    </ul>
                    <p><strong>Requires EDD:</strong> {rule.requiresedd}</p>
                  </div>
                )) || <p className="text-gray-500">Loading rules...</p>}
              </div>
            )
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a document from the sidebar
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
