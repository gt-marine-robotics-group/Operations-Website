import { Box } from "@mui/material";
import { Cookie_User } from "../../../../database/interfaces/User";
import { PopulatedPart } from "../usePart";

interface Props {
    user: Cookie_User;
    part: PopulatedPart;
    error: boolean;
}

export default function Main({user, part, error}:Props) {

    return (
        <Box>
            main section
        </Box>
    )
}