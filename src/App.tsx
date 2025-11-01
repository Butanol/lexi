import {useEffect, useState} from 'react'
import './App.css'
import TransactionCard from "./components/TransactionCard.tsx";
import {Box, Center, Flex, Icon, VStack} from "@chakra-ui/react";
import {FiUpload} from "react-icons/fi"

export type Transaction = {
    id: string,
    booking_jurisdiction: string
    regulator: string,
    amount: string,
    currency: string,
    date: string,
    time: string
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


        return (
        <>
            <Flex height={"100vh"}>
                <Box flex={"2"}>
                    <VStack>
                        {transactions.map(transaction => (
                            <div style={{padding:20}}>
                                <TransactionCard transaction={transaction} key={transaction.id}/>
                            </div>
                        ))}
                    </VStack>
                </Box>
                <Box flex={"1"} h={"100%"}>
                    <Box
                        w="100%"
                        maxW="500px"
                        h="400px"
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
                </Box>
            </Flex>
            </>
    )
}

export default App;
