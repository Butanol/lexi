import { useEffect, useState } from 'react'
import './App.css'
import { Box, Flex, Button, Text, Center, Icon } from "@chakra-ui/react";
import { FiX, FiCheck } from "react-icons/fi";
import PDFViewerPage from "./components/PDFViewerPage.tsx";

export type Transaction = {
    transaction_id: string,
    regulator: string,
    value_date: string,
    assign_team: string,
    suspicion_confidence: number,
    flagged: number
}

function parseCSV(csvText: string): Transaction[] {
    const lines = csvText.split(/\r?\n/).filter(Boolean)
    if (lines.length < 2) return []
    const headers = lines[0].split(',').map(h => h.trim())
    const idx = (name: string) => headers.findIndex(h => h.toLowerCase() === name.toLowerCase())
    const tid = idx('transaction_id')
    const reg = idx('regulator')
    const vd = idx('value_date')
    const sc = idx('suspicion_confidence')
    const fl = idx('flagged')
    const at = idx('assign_team')

    const out: Transaction[] = []
    for (let i = 1; i < lines.length; i++){
        const row = lines[i]
        // simple CSV split - assumes no commas in quoted fields for this dataset
        const cols = row.split(',')
        if (cols.length <= Math.max(tid, reg, vd, at, sc, fl)) continue
        out.push({
            transaction_id: cols[tid],
            regulator: cols[reg],
            value_date: cols[vd],
            assign_team: cols[at],
            suspicion_confidence: parseFloat(cols[sc]) || 0,
            flagged: parseInt(cols[fl]) || 0
        })
    }
    return out
}

function App() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [showPDFViewer, setShowPDFViewer] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const STORAGE_KEY = 'lexi.completedTransactions'

    const loadCompletedFromStorage = (): Set<string> => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (!raw) return new Set()
            const arr: string[] = JSON.parse(raw)
            return new Set(arr)
        } catch {
            return new Set()
        }
    }

    const saveCompletedToStorage = (setVals: Set<string>) => {
        try {
            const arr = Array.from(setVals)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
        } catch {
            // no-op
        }
    }

    useEffect(() => {
        // load completed first, then fetch CSV
        const completedSet = loadCompletedFromStorage()
        fetch('/transactions_with_suspicion_score.csv')
            .then(r => r.text())
            .then(text => {
                const data = parseCSV(text)
                // sort by descending suspicion_confidence
                data.sort((a,b) => b.suspicion_confidence - a.suspicion_confidence)
                // show all transactions (including flagged=1), but hide completed
                const visible = data.filter(t => !completedSet.has(t.transaction_id))
                setTransactions(visible)
            })
            .catch(() => {
                setTransactions([])
            })
    }, [])

    // Show PDF Viewer if active
    if (showPDFViewer) {
        return <PDFViewerPage onClose={() => setShowPDFViewer(false)} />;
    }

    // Show main transactions page
    const handleComplete = (id: string) => {
        // persist completion and remove from UI
        setTransactions(prev => prev.filter(t => t.transaction_id !== id))
        const next = loadCompletedFromStorage()
        next.add(id)
        saveCompletedToStorage(next)
    }

    // drag & drop upload handlers
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        const files = Array.from(e.dataTransfer.files || [])
        if (files.length) {
            setUploadedFiles(prev => [...prev, ...files])
            // TODO: Wire up actual upload endpoint if needed.
            // For now, we just store and list selected files.
        }
    }
    return (
        <>
            {/* Navigation button */}
            <Box position="absolute" top={4} left={4} zIndex={10}>
                <Button
                    onClick={() => setShowPDFViewer(true)}
                    colorScheme="blue"
                    size="md"
                    color="black"
                >
                    View Circulars
                </Button>
            </Box>

            <Flex height={"90vh"} w={"90vw"} p={6} gap={6} flexWrap="nowrap">
                {/* Left: Transactions table */}
                <Box h={"100%"} flex={3} minW={0} bg={"gray.50"} borderRadius={"md"} p={6}>
                    <Text fontSize="xl" mb={4}>Transactions (sorted by suspicion confidence)</Text>
                    <Box overflowX="auto">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '8px' }}>Transaction ID</th>
                                    <th style={{ textAlign: 'left', padding: '8px' }}>Regulator</th>
                                    <th style={{ textAlign: 'left', padding: '8px' }}>Value Date</th>
                                    <th style={{ textAlign: 'right', padding: '8px' }}>Suspicion Confidence</th>
                                    <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((t) => (
                                    <tr key={t.transaction_id} style={{ backgroundColor: t.flagged === 1 ? '#FED7D7' : '#F0FFF4' }}>
                                        <td style={{ padding: '8px', borderTop: '1px solid #E2E8F0' }}>{t.transaction_id}</td>
                                        <td style={{ padding: '8px', borderTop: '1px solid #E2E8F0' }}>{t.regulator}</td>
                                        <td style={{ padding: '8px', borderTop: '1px solid #E2E8F0' }}>{t.value_date}</td>
                                        <td style={{ padding: '8px', borderTop: '1px solid #E2E8F0', textAlign: 'right' }}>{Math.round(t.suspicion_confidence * 100)}</td>
                                        <td style={{ padding: '8px', borderTop: '1px solid #E2E8F0' }}>
                                            <button
                                                aria-label="reject"
                                                onClick={() => handleComplete(t.transaction_id)}
                                                style={{
                                                    marginRight: '8px',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #CBD5E0',
                                                    background: '#FFF5F5',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <FiX />
                                            </button>
                                            <button
                                                aria-label="accept"
                                                onClick={() => handleComplete(t.transaction_id)}
                                                style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #CBD5E0',
                                                    background: '#F0FFF4',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <FiCheck />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Box>
                </Box>
                {/* Right: Drag & Drop upload panel */}
                <Box h={"100%"} flex={2} minW={0}>
                    <Box
                        w="100%"
                        h="100%"
                        border="3px dashed"
                        borderColor={isDragging ? 'blue.400' : 'gray.300'}
                        borderRadius="xl"
                        bg={isDragging ? 'blue.50' : 'gray.50'}
                        transition="all 0.2s ease"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        position="relative"
                        _hover={{ borderColor: 'blue.400', bg: 'blue.50' }}
                        p={6}
                    >
                        <Center h="100%" flexDirection="column" gap={3}>
                            <Icon as={FiX} display="none" />
                            <Text fontSize="lg" fontWeight="semibold">Drag and drop files here</Text>
                            <Text fontSize="sm" color="gray.600">PDFs, CSVs, or documents supporting review</Text>
                        </Center>

                        {uploadedFiles.length > 0 && (
                            <Box position="absolute" left={0} right={0} bottom={0} p={4} bg="white" borderTop="1px solid" borderColor="gray.200" borderBottomRadius="xl" maxH="40%" overflowY="auto">
                                <Text fontWeight="semibold" mb={2}>Uploaded files</Text>
                                <ul style={{ listStyle: 'disc', paddingLeft: 18 }}>
                                    {uploadedFiles.map((f, idx) => (
                                        <li key={`${f.name}-${idx}`}>{f.name}</li>
                                    ))}
                                </ul>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Flex>
        </>
    )
}

export default App;