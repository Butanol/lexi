import {useEffect, useState} from 'react'
import './App.css'
import TransactionCard from "./components/TransactionCard.tsx";
import {Box, Center, Flex, Icon, VStack, Text} from "@chakra-ui/react";
import {FiUpload} from "react-icons/fi"

export type Transaction = {
    id: string,
    booking_jurisdiction: string
    regulator: string,
    amount: string,
    currency: string,
    date: string,
    time: string,
    suspicion?: boolean,
}

type UploadedFile = {
    name: string,
    size: number,
    type: string
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

const accepted_document_types = ["application/pdf", "image/pdf", "image/jpeg", "image/pdf"]
const MAX_FILE_SIZE = 5;

function App() {

    const [uploadedTransaction, setUploadedTransaction] = useState<UploadedFile | null>(null);
    const [uploadedDocument, setUploadedDocument] = useState<UploadedFile | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isTransactionError, setIsTransactionError] = useState(false);
    const [documentError, setDocumentError] = useState<String|null>(null);

    const [isReviewMode, setIsReviewMode] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleTransactionsDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleTransactionsUpload(files[0]);
        }
    }

    const handleDocumentDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleDocumentUpload(files[0]);
        }
        setIsReviewMode(true);

    }

    const handleDocumentUpload = (file: File) => {
        if (!accepted_document_types) {
            setDocumentError("Error: Invalid file type")
            setIsReviewMode(false); //should probably change to some other error alert
            return
        } else if (file.size > MAX_FILE_SIZE * 1024 * 1034) {
            setDocumentError("Error: File size too large");
            setIsReviewMode(false);
            return
        }

        setDocumentError(null);
        setUploadedDocument({
            name:file.name,
            size:file.size,
            type:file.type
        })
    }
    const handleTransactionsUpload = (file:File) => {
        if (file.type != "text/csv") {
            //maybe add an error message
            return
        }
        setUploadedTransaction({
            name: file.name,
            type: file.type,
            size: file.size
        })
    }

    const loadTransactions = () => {
        setTransactions([test])
    }

    const uploadDocument = () => {
    }

    useEffect(() => {
        loadTransactions()
    }, [])



    return (
        <>
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
                                onDrop={handleDocumentDrop}
                                position="relative"
                                _hover={{
                                    borderColor: 'brand.400',
                                    bg: 'brand.50',
                                }}
                            >
                                <Center h={"100%"} flexDirection={"column"}>
                                    <Icon as={FiUpload}/>
                                    <Text color={"red"}>{documentError != null ? documentError : " "}</Text>
                                </Center>

                            </Box>
                        </>
                        ) :
                        (
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
                                onDrop={handleDocumentDrop}
                                position="relative"
                                _hover={{
                                    borderColor: 'brand.400',
                                    bg: 'brand.50',
                                }}
                            >
                            </Box>
                        </>)}
                </Box>
            </Flex>
        </>
    )
}

export default App;
