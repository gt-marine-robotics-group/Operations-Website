import { Box } from "@mui/material";
import { Cookie_User } from "../../database/interfaces/User";
import useAdmin from "./useAdmin";

interface Props {
    user: Cookie_User;
}

export default function Main({user}:Props) {

    const info = useAdmin(user) 

    return (
        <Box>
            <Box>
                leadership
            </Box>
            <Box>
                team members
            </Box>
        </Box>
    )
}