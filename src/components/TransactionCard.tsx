import type {Transaction} from "../App.tsx";
import {Box, Button, Flex, Icon, Text} from "@chakra-ui/react";
import {FiCheck, FiX} from "react-icons/fi";

type CardProps = {
    transaction: Transaction
}

function TransactionCard({transaction}: CardProps){
    const {id, booking_jurisdiction, regulator, amount, currency, date, time, suspicion} = transaction;
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
                        <Text fontSize={"lg"} fontWeight={"bold"} textAlign={"left"}>{id}</Text>
                        <Box bg={suspicion ? "red" : suspicion == false ? "green" : "grey"}>
                            <Text p={1}>
                                {suspicion != null ? suspicion : "Untested"}
                            </Text>
                        </Box>
                    </Flex>
                    <Flex wrap="wrap" justify="space-between" mb={2} gap={2}>
                        <Text><b>Jurisdiction</b>: {booking_jurisdiction}</Text>
                        <Text><b>Regulator</b>: {regulator}</Text>
                    </Flex>

                    <Flex wrap="wrap" justify="space-between" gap={2}>
                        <Text><b>Date</b>: {date} {time}</Text>
                        <Text><b>Amount</b>: {amount} {currency}</Text>
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