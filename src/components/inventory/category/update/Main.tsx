import { Box, Container, Paper, Typography } from "@mui/material";
import { C_Category } from "../../../../database/interfaces/Category";
import CategoryForm from "../CategoryForm";

interface Props {
    category: C_Category;
}

export default function Main({category}:Props) {

    return (
        <Box mt={3}>
            <Container maxWidth="sm">
                <Paper elevation={3}>
                    <Box p={3}>
                        <Box mb={2} textAlign="center">
                            <Typography variant="h4">
                                Update Category
                            </Typography>
                        </Box>
                        <Box maxWidth={400} mx="auto">
                            <CategoryForm initialCategory={category} />
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}