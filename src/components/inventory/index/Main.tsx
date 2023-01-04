import { CircularProgress, Container, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Cookie_User } from "../../../database/interfaces/User";
import { BlueSecondaryButton } from "../../misc/buttons";
import { PrimarySearchBar } from "../../misc/searchBars";
import useInventory from "../useInventory";
import ContentDisplay from "./ContentDisplay";
import { PrimarySnackbar } from '../../misc/snackbars'
import { useRouter } from 'next/router'

interface Props {
    user: Cookie_User;
}

export default function Main({user}:Props) {

    const [search, setSearch] = useState('')

    const router = useRouter() 
    const [snackbarMsg, setSnackbarMsg] = useState({content: '', type: ''})

    useEffect(() => {
        if (!router.isReady) return

        const {query} = router

        if (query.partChange === 'delete') {
            setSnackbarMsg({content: 'Part Deleted', type: 'success'})
        } else if (query.categoryChange === 'add') {
            setSnackbarMsg({content: 'Category Created', type: 'success'})
        } else if (query.categoryChange === 'update') {
            setSnackbarMsg({content: 'Category Updated', type: 'success'})
        } else if (query.categoryChange === 'delete') {
            setSnackbarMsg({content: 'Category Deleted', type: 'success'})
        }
    }, [router.query])

    const {categories, parts, loading, 
        expandCategory} = useInventory(search)

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
                <Box>
                    {'/' in categories ? <ContentDisplay categories={categories}
                        parts={parts} loading={loading} 
                        expandCategory={expandCategory} category='/'
                        startOpen={Boolean(search)} isAdmin={isAdmin} />
                    : <Box textAlign="center" mt={3}>
                        <CircularProgress /> 
                    </Box>}
                </Box>
            </Container>
            <PrimarySnackbar msg={snackbarMsg} setMsg={setSnackbarMsg} />
        </Box>
    )
}