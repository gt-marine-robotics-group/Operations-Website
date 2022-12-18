import { Container, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Cookie_User } from "../../../database/interfaces/User";
import { BluePrimaryButton, BlueSecondaryButton } from "../../misc/buttons";
import { PrimarySearchBar } from "../../misc/searchBars";

interface Props {
    user: Cookie_User;
}

export default function Main({user}:Props) {

    const [search, setSearch] = useState('')

    const isAdmin = useMemo(() => (
        user.roles.includes('President') || user.roles.includes('Operations Officer')
    ), [])

    return (
        <Box mt={3}>
            <Container maxWidth="md">
                <Box>
                    <Container maxWidth="sm">
                        <PrimarySearchBar search={search} setSearch={setSearch} />
                    </Container>
                </Box>
                {isAdmin && <Box mt={2}>
                    <Grid container spacing={3} justifyContent="center">
                        <Grid item>
                            <Link href="/inventory/part/add">
                                <BlueSecondaryButton>
                                    Add Part
                                </BlueSecondaryButton>
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/inventory/category/add">
                                <BlueSecondaryButton>
                                    Add Category
                                </BlueSecondaryButton>
                            </Link>
                        </Grid>
                    </Grid>
                </Box>}
            </Container>
        </Box>
    )
}