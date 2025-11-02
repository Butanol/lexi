import type { Transaction } from "../App.tsx";
import { Box, Button, Flex, Icon, Text } from "@chakra-ui/react";
import { FiCheck, FiX } from "react-icons/fi";

type CardProps = {
    transaction: Transaction
}

function TransactionCard({ transaction }: CardProps){
    const { transaction_id, regulator, value_date, suspicion_confidence, flagged } = transaction;
    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="show"
            p={4}
            w={"100%"}
            shadow={"lg"}
            _hover={{ boxShadow: "md" }}
            alignItems={"center"}
        >
            <Flex justifyContent={"space-evenly"} alignItems={"center"}>
                <div style={{paddingRight:"10px", width:"80%"}}>
                    <Flex justifyContent={"space-between"}>
                        <Text fontSize={"lg"} fontWeight={"bold"} textAlign={"left"}>{transaction_id}</Text>
                        <Box bg={flagged === 1 ? "red.200" : "green.200"}>
                            <Text p={1}>
                                {Math.round((suspicion_confidence || 0) * 100)}
                            </Text>
                        </Box>
                    </Flex>
                    <Flex wrap="wrap" justify="space-between" mb={2} gap={2}>
                        <Text><b>Regulator</b>: {regulator}</Text>
                        <Text><b>Value Date</b>: {value_date}</Text>
                    </Flex>
                </div>
                <Button bg={"red"} aspectRatio={"5/4"}>
                    <Icon as={FiX} color={"black"}/>
                </Button>
                <Button bg={"green"} aspectRatio={"5/4"}>
                    <Icon as={FiCheck} color={"black"}/>
                </Button>
            </Flex>
        </Box>
    )
}
export default TransactionCard;