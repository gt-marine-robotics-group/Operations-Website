import { Box, Container, Paper, Typography } from "@mui/material";
import { C_User } from "../../database/interfaces/User";

interface Props {
    user: C_User;
}

export default function Main({user}:Props) {

    return (
        <Box mt={3}>
            <Container maxWidth="sm">
                <Paper elevation={5} sx={{borderRadius: 5}}>
                    <Box p={3}>
                        <Box textAlign="center" mb={3}>
                            <Typography variant="h4">
                                {user.data.email}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}