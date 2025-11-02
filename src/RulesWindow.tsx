import { Modal } from "@chakra-ui/modal";
import {Box} from "@chakra-ui/react";

function RulesWindow(isOpen:boolean){

    return (
        <>
            <Modal isOpen={isOpen} onClose={}>
                <Box></Box>
            </Modal>
        </>
    )
}

export default RulesWindow;