import { Box, Container, Paper, Typography } from "@mui/material";
import PartForm from "../PartForm";

interface Props {
    projects: {id:string;name:string}[];
}

export default function Main({projects}:Props) {

    return (
        <Box mt={3}>
            <Container maxWidth="sm">
                <Paper elevation={3}>
                    <Box p={3}>
                        <Box mb={2} textAlign="center">
                            <Typography variant="h4">
                                Add Part
                            </Typography>
                        </Box>
                        <Box maxWidth={400} mx="auto">
                            <PartForm projects={projects} />
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}