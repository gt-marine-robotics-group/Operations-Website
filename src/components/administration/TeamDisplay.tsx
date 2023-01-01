import { Box, Grid, MenuItem, Paper, Select, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { Cookie_User } from "../../database/interfaces/User";
import { BluePrimaryButton, BluePrimaryIconButton, BluePrimaryOutlinedButton, RedPrimaryIconButton } from "../misc/buttons";
import { PrimarySearchBar } from "../misc/searchBars";
import RemoveIcon from '@mui/icons-material/Remove'

interface Props {
    users: Cookie_User[];
    loading: boolean;
    moreToLoad: boolean;
    loadMoreUsers: () => void;
    searchForUser: (username:string) => Promise<Cookie_User|null>;
}

export default function TeamDisplay({users, loading, moreToLoad, 
    loadMoreUsers, searchForUser}:Props) {

    const [search, setSearch] = useState('')
    const [searchedUser, setSearchedUser] = useState<Cookie_User|null>(null)

    const [showDelete, setShowDelete] = useState<{[id:string]: boolean}>({})

    const sortedUsers = useMemo(() => (
        users.sort((a, b) => a.email.localeCompare(b.email))
    ), [users])

    useMemo(() => {
        const map:{[id:string]: boolean} = {}
        users.forEach(u => {
            map[u.id] = false
        })
        setShowDelete(map)
    }, [users])

    const userSearch = async () => {
        const user = await searchForUser(search)
        setSearchedUser(user)
    }

    useMemo(() => {
        if (loading) return
        if (!search && !searchedUser) return
        if (!search) {
            setSearchedUser(null)
        }
        userSearch()
    }, [search])

    const changeShowDelete = (id:string, value:boolean) => {
        setShowDelete({...showDelete, [id]: value})
    }

    return (
        <Box>
            <Paper elevation={3}>
                <Box p={3}>
                    <Box mb={3}>
                        <Typography variant="h5">
                            Team Members
                        </Typography>
                    </Box>
                    <Box mb={6}>
                            <Box maxWidth={400}>
                                <PrimarySearchBar search={search} setSearch={setSearch} />
                            </Box>
                    </Box>
                    <Box>
                        <Box display="grid" 
                            gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
                            gap={1} mb={6}>
                            {sortedUsers.map(user => (
                                <Box key={user.id} position="relative"
                                    display={searchedUser && searchedUser.id !== user.id 
                                    ? 'none' : 'flex'} minHeight={40}
                                    alignItems="center"
                                    sx={{cursor: 'default'}}
                                    onMouseEnter={() => changeShowDelete(user.id, true)}
                                    onMouseLeave={() => changeShowDelete(user.id, false)}>
                                    <Typography variant="body1" sx={{wordBreak: 'break-word'}}>
                                        {user.email.split('@')[0]}
                                    </Typography>
                                    <Box position="absolute" right={0} top={0}
                                    display={showDelete[user.id] ? 'initial': 'none'}>
                                        <RedPrimaryIconButton>
                                            <RemoveIcon />
                                        </RedPrimaryIconButton>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                        <Grid container spacing={3}>
                            {moreToLoad && <Grid item>
                                <Box textAlign="center">
                                    <BluePrimaryButton disabled={loading}
                                        onClick={() => loadMoreUsers()}>
                                        Load More
                                    </BluePrimaryButton>
                                </Box>
                            </Grid>}
                            <Grid item>
                                <BluePrimaryOutlinedButton disabled={loading}>
                                    Add Team Member
                                </BluePrimaryOutlinedButton>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}