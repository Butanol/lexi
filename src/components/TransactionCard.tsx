import type {Transaction} from "../App.tsx";
import {Box, Flex, Text} from "@chakra-ui/react";

type CardProps = {
    transaction: Transaction
}

function TransactionCard({transaction}: CardProps){
    const {id, booking_jurisdiction, regulator, amount, currency, date, time} = transaction;
    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="show"
            p={4}
            shadow={"lg"}
            _hover={{ boxShadow: "md" }}
            justifyContent={"left"}
        >
            <Flex>
                <div style={{paddingRight:"10px"}}>
                    <Text fontSize={"lg"} fontWeight={"bold"}>{id}</Text>
                    <Flex wrap="wrap" justify="space-between" mb={2} gap={2}>
                        <Text><b>Jurisdiction</b>: {booking_jurisdiction}</Text>
                        <Text><b>Regulator</b>: {regulator}</Text>
                    </Flex>

                    <Flex wrap="wrap" justify="space-between" gap={2}>
                        <Text><b>Date</b>: {date} {time}</Text>
                        <Text><b>Amount</b>: {amount} {currency}</Text>
                    </Flex>
                </div>
                <Text>placeholder</Text>
            </Flex>
        </Box>
    )
}
export default TransactionCard;