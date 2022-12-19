import { Box, Container, Paper, Typography } from "@mui/material";

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
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}