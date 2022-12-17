import { Box, Container, Paper, Typography } from "@mui/material";
import LoginForm from "./LoginForm";

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
                    <Box my={3} maxWidth={400} mx="auto">
                        <LoginForm />                        
                    </Box>
                </Box>
            </Paper>
        </Container>
    )
}