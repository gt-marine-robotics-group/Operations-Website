import { Box, Container, Paper, Typography } from "@mui/material";
import { C_Ref } from "../../../../database/interfaces/fauna";
import { C_Part } from "../../../../database/interfaces/Part";
import PartForm from "../PartForm";

interface Props {
    part: C_Part;
    categoryParts: C_Ref[];
}

export default function Main({part, categoryParts}:Props) {

    return (
        <Box mt={3}>
            <Container maxWidth="sm">
                <Paper elevation={3}>
                    <Box p={3}>
                        <Box mb={2} textAlign="center">
                            <Typography variant="h4">
                                Update Part
                            </Typography>
                        </Box>
                        <Box maxWidth={400} mx="auto">
                            <PartForm initialPart={part} 
                                initialCategoryParts={categoryParts} />
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}