import {useEffect, useState} from 'react'
import './App.css'
import TransactionCard from "./components/TransactionCard.tsx";
import {Box, Center, Flex, Icon, VStack, Button} from "@chakra-ui/react";
import {FiUpload} from "react-icons/fi"
import PDFViewerPage from "./components/PDFViewerPage.tsx";

export type Transaction = {
    id: string,
    booking_jurisdiction: string
    regulator: string,
    amount: string,
    currency: string,
    date: string,
    time: string,
    rating?: number,
    priorty?: number,
}

let test: Transaction = {
    id:"a",
    booking_jurisdiction:"sg",
    regulator:"mas",
    amount:"20",
    currency:"sgd",
    date:"24-10-25",
    time:"2059"
}

function App() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isReviewMode, setIsReviewMode] = useState(false);
    const [showPDFViewer, setShowPDFViewer] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }
    
    const loadTransactions = () => {
        setTransactions([test])
    }
    
    useEffect(() => {
        loadTransactions()
    })

    // Show PDF Viewer if active
    if (showPDFViewer) {
        return <PDFViewerPage onClose={() => setShowPDFViewer(false)} />;
    }

    // Show main transactions page
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

            <Flex height={"90vh"} w={"90vw"}>
                <Box h={"100%"} w={"60%"} bg={"gray.100"} borderRadius={"md"} p={6}>
                    <VStack w={"100%"} align={"stretch"}>
                        {transactions.map(transaction => (
                            <Box key={transaction.id} w={"100%"} p={5}>
                                <TransactionCard transaction={transaction}/>
                            </Box>
                        ))}
                    </VStack>
                </Box>
                <Box h={"100%"} w = {"40%"}>
                    {!isReviewMode ? (
                        <>
                            <Box
                                w="80%"
                                maxW="500px"
                                h="100%"
                                border="3px dashed"
                                borderColor={isDragging ? 'brand.400' : 'gray.300'}
                                borderRadius="xl"
                                bg={isDragging ? 'brand.50' : 'gray.50'}
                                transition="all 0.3s"
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                position="relative"
                                _hover={{
                                    borderColor: 'brand.400',
                                    bg: 'brand.50',
                                }}
                            >
                                <Center h={"100%"} flexDirection={"column"}>
                                    <Icon as={FiUpload}/>
                                </Center>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Box
                                w="100%"
                                maxW="500px"
                                h="100%"
                                border="3px dashed"
                                borderColor={isDragging ? 'brand.400' : 'gray.300'}
                                borderRadius="xl"
                                bg={isDragging ? 'brand.50' : 'gray.50'}
                                transition="all 0.3s"
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                position="relative"
                                _hover={{
                                    borderColor: 'brand.400',
                                    bg: 'brand.50',
                                }}
                            >
                            </Box>
                        </>
                    )}
                </Box>
            </Flex>
        </>
    )
}

export default App;