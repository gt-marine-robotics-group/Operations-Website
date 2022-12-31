import { Box, Grid, MenuItem, Paper, Select, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { Cookie_User } from "../../database/interfaces/User";
import { BluePrimaryButton } from "../misc/buttons";
import { PrimarySearchBar } from "../misc/searchBars";

interface Props {
    users: Cookie_User[];
    loading: boolean;
    moreToLoad: boolean;
}

export default function TeamDisplay({users, loading, moreToLoad}:Props) {

    const [viewType, setViewType] = useState('currentMembers')

    const [search, setSearch] = useState('')

    const sortedUsers = useMemo(() => (
        users.sort((a, b) => a.email.localeCompare(b.email))
    ), [users])

    return (
        <Box>
            <Paper elevation={3}>
                <Box p={3}>
                    <Box mb={3}>
                        <Grid container spacing={1} alignItems="center">
                            <Grid item>
                                <Box minWidth={100}>
                                    <Select value={viewType} fullWidth
                                        onChange={(e) => setViewType(e.target.value)}>
                                        <MenuItem value="currentMembers">
                                            Current
                                        </MenuItem>
                                        <MenuItem value="invitedMembers">
                                            Invited 
                                        </MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5">
                                    Team Members
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box mb={3}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item sm={4}>
                                <PrimarySearchBar search={search} setSearch={setSearch} />
                            </Grid>
                            {viewType === 'invitedMembers' && <Grid item>
                                <BluePrimaryButton>
                                    Invite Team Member
                                </BluePrimaryButton>
                            </Grid>}
                        </Grid>
                    </Box>
                    {viewType === 'currentMembers' ? 
                        <Box>
                            <Box display="grid" 
                                gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
                                gap={1}>
                                {sortedUsers.map(user => (
                                    <Box key={user.id}>
                                        <Typography variant="body1" sx={{wordBreak: 'break-word'}}>
                                            {user.email.split('@')[0]}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box> :
                        <Box>
                            invites
                        </Box>
                    }
                </Box>
            </Paper>
        </Box>
    )
}