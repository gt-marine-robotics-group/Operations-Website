import { Box, Container, Paper, Typography } from "@mui/material";
import PartForm from "../PartForm";

export default function Main() {

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
                            <PartForm />
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}