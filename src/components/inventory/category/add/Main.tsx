import { Box, Container, Paper, Typography } from "@mui/material";
import CategoryForm from "../CategoryForm";

export default function Main() {

    return (
        <Box mt={3}>
            <Container maxWidth="sm">
                <Paper elevation={3}>
                    <Box p={3}>
                        <Box mb={2} textAlign="center">
                            <Typography variant="h4">
                                Add Category
                            </Typography>
                        </Box>
                        <Box maxWidth={400} mx="auto">
                            <CategoryForm initialVals={{name: ''}} />
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}