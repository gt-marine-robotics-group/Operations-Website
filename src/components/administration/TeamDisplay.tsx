import { Box, Grid, MenuItem, Paper, Select, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { Cookie_User } from "../../database/interfaces/User";
import { BluePrimaryButton } from "../misc/buttons";
import { PrimarySearchBar } from "../misc/searchBars";

interface Props {
    users: Cookie_User[];
    loading: boolean;
    moreToLoad: boolean;
    loadMoreUsers: () => void;
}

export default function TeamDisplay({users, loading, moreToLoad, 
    loadMoreUsers}:Props) {

    const [viewType, setViewType] = useState('currentMembers')

    const [search, setSearch] = useState('')
    const [searchedUser, setSearchedUser] = useState<Cookie_User|null>(null)

    const sortedUsers = useMemo(() => (
        users.sort((a, b) => a.email.localeCompare(b.email))
    ), [users])

    const userSearch = async () => {
        
    }

    useMemo(() => {
        if (!search && !searchedUser) return
        if (!search) {
            setSearchedUser(null)
        }
        // setSearchedUser(users.find(u => u.email.split('@')[0] === search) || null)
    }, [search])

    console.log('moreToLoad', moreToLoad)

    return (
        <Box>
            <Paper elevation={3}>
                <Box p={3}>
                    <Box mb={3}>
                        <Grid container spacing={1} alignItems="center">
                            <Grid item>
                                <Box minWidth={100}>
                                    <Select value={viewType} fullWidth disabled={loading}
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
                    <Box mb={6}>
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
                                    <Box key={user.id}
                                        display={searchedUser && searchedUser.id !== user.id 
                                        ? 'none' : 'initial'}>
                                        <Typography variant="body1" sx={{wordBreak: 'break-word'}}>
                                            {user.email.split('@')[0]}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                            {moreToLoad && <Box mt={6} textAlign="center">
                                <BluePrimaryButton disabled={loading}
                                    onClick={() => loadMoreUsers()}>
                                    Load More
                                </BluePrimaryButton>
                            </Box>}
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