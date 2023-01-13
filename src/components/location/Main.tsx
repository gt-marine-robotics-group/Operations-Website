import { Box } from "@mui/material";
import useLocations from "./useLocations";

export default function Main() {

    const {} = useLocations()

    return (
        <Box>
            main stuff
        </Box>
    )
}