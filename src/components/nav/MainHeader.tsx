import { AppBar, Box, Grid, Toolbar, Typography } from "@mui/material";
import Link from "next/link";

interface Props {
    loggedIn?: boolean;
}

export default function MainHeader({loggedIn}:Props) {

    return (
        <Box mb={3}>
            <AppBar position="static" sx={{backgroundColor: "primary.light"}}>
                <Toolbar>
                    <Grid item flex={1}>
                        <Box>
                            <Link href="/">
                                <Typography variant="h4">
                                    MRG Operations
                                </Typography>
                            </Link>
                        </Box>
                    </Grid>
                    {loggedIn && <Grid item>
                        Logout
                    </Grid>}
                </Toolbar>
            </AppBar>
        </Box>
    )
}