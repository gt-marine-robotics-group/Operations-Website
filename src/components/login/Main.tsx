import { Box, Container, Paper, Typography } from "@mui/material";

export default function Main() {

    return (
        <Container maxWidth="sm">
            <Paper sx={{borderRadius: 5}} elevation={5}>
                <Box p={3}>
                    <Box textAlign="center" mb={3}>
                        <Typography variant="h4">
                            Welcome
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Container>
    )
}