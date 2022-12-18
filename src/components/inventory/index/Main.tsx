import { Container } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import { PrimarySearchBar } from "../../misc/searchBars";

export default function Main() {

    const [search, setSearch] = useState('')

    return (
        <Box mt={3}>
            <Container maxWidth="md">
                <Box mb={3}>
                    <Container maxWidth="sm">
                        <PrimarySearchBar search={search} setSearch={setSearch} />
                    </Container>
                </Box>
            </Container>
        </Box>
    )
}