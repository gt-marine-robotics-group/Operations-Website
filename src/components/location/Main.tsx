import { Box, Container } from "@mui/material";
import LocationViz from "./LocationViz";
import useLocations from "./useLocations";

export default function Main() {

    const {} = useLocations()

    return (
        <Box>
            <Container maxWidth="lg">
                <Box>
                    stuff
                </Box>
                <Box textAlign="center">
                    <LocationViz />
                </Box>
            </Container>
        </Box>
    )
}