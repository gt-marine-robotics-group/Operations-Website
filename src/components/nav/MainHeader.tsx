import { AppBar, Box, Grid, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { logout } from '../../utils/auth'

interface Props {
    loggedIn?: boolean;
}

export default function MainHeader({loggedIn}:Props) {

    return (
        <Box mb={3}>
            <AppBar position="static" sx={{backgroundColor: "primary.light"}}>
                <Toolbar>
                    <Grid item>
                        <Box>
                            <Link href="/">
                                <Typography variant="h4">
                                    MRG Operations
                                </Typography>
                            </Link>
                        </Box>
                    </Grid>
                    <Grid item flex={1} />
                    {loggedIn && <Grid item>
                        <Box sx={{cursor: 'pointer'}} onClick={() => logout()}>
                            <Typography variant="body1">
                                Logout
                            </Typography>
                        </Box>
                    </Grid>}
                </Toolbar>
            </AppBar>
        </Box>
    )
}