import { Box, CircularProgress, Container, Grid, Paper, Typography, useTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Cookie_User } from "../../../../database/interfaces/User";
import { PopulatedPart, ProjectData } from "../usePart";
import EditIcon from '@mui/icons-material/Edit';
import { BluePrimaryIconButton } from "../../../misc/buttons";
import Link from "next/link";
import { includesAdminRole } from "../../../../utils/auth";

interface Props {
    user: Cookie_User;
    part: PopulatedPart | null;
    error: boolean;
    projects: ProjectData[];
}

export default function Main({user, part, projects, error}:Props) {

    const theme = useTheme()

    const [updateLink, setUpdateLink] = useState('')

    const isAdmin = useMemo(() => (
        includesAdminRole(user.roles)
    ), [user])

    const categoryPath = useMemo(() => {
        if (!part) return ''

        let id = part.category

        try {

            const sessionCategories = sessionStorage.getItem('categoryData')

            if (!sessionCategories) return ''

            const parsedSessionCategories = JSON.parse(sessionCategories)

            if (!(id in parsedSessionCategories)) return ''

            const path = []
            while (id && id in parsedSessionCategories)  {
                path.push(parsedSessionCategories[id].name) 
                id = parsedSessionCategories[id].parent
            }

            return path.reverse().join(' / ')
        } catch (e) {
            return ''
        }
    }, [part])

     const projectTemplateRow = useMemo(() => {
        return `"${projects.map((_, i) => 'project' + i).join(' ')}"`
     }, [projects])

     const projectTemplateCol = useMemo(() => {
        return projects.map((_, i) => `"project${i}"`).join(' ')
     }, [projects])

     const numInventoryCountColumns = useMemo(() => {
        if (projects.length > 2) {
            return projects.length
        }
        return 2
     }, [projects]) 

     const sortedProjects = useMemo(() => {
        return projects.sort((a, b) => a.name.localeCompare(b.name))
     }, [projects])

     useEffect(() => {
        setUpdateLink(window.location.pathname + '/update')
     }, [])

    return (
        <Box mt={6}>
            <Container maxWidth="lg">
                <Paper elevation={3} sx={{position: 'relative'}}>
                    {isAdmin && <Box position="absolute" top={8} right={8}>
                        <Link href={updateLink}>
                            <BluePrimaryIconButton>
                                <EditIcon />
                            </BluePrimaryIconButton>
                        </Link>
                    </Box>}
                    <Box minHeight={500} mx={3} >
                        <Grid container spacing={3} justifyContent="center">
                            {part?.img && <Grid item>
                                <Box height="max(100%, 500px)" width="min(400px, 95vw)"
                                    overflow="hidden" borderRadius="5px">
                                    <img src={part.img} alt={`Image of ${part.name}`}
                                        style={{width: '100%', borderRadius: 5}} />
                                </Box>
                            </Grid>}
                            <Grid item flex={1}>
                                <Box minWidth="min(600px, 95vw)">
                                    {error ? <Box>
                                        <Typography variant="body1">
                                            Error Loading content
                                        </Typography>
                                    </Box> : !part ? <Box display="flex" 
                                        justifyContent="center">
                                        <CircularProgress />  
                                    </Box> : <Box>
                                        <Box>
                                            <Typography variant="h4">
                                                {part.name}
                                            </Typography>
                                        </Box>
                                        {categoryPath && <Box>
                                            <Typography variant="h6" color="#535040">
                                                {categoryPath}
                                            </Typography>
                                        </Box>}
                                        <Box display="grid" gridTemplateAreas={`
                                            "available on-the-way ${Array(numInventoryCountColumns - 2).fill('.').join(' ')}"
                                            ${projectTemplateRow}
                                        `} gridTemplateColumns={`repeat(${numInventoryCountColumns}, 1fr)`}
                                        gridTemplateRows="auto" maxWidth={200 * numInventoryCountColumns}
                                        mt={3} gap={1}
                                        sx={{
                                            [theme.breakpoints.down('sm')]: {
                                                gridTemplateColumns: 'auto',
                                                gridTemplateAreas: `
                                                    "available" "on-the-way"
                                                    ${projectTemplateCol}
                                                `,
                                                gridTemplateRows: `repeat(${numInventoryCountColumns + 2}, 1fr)`
                                            }
                                        }} >
                                            <Box gridArea="available">
                                                <Typography variant="body1">
                                                    Available: {part.available} {part.units}
                                                </Typography>
                                            </Box>
                                            <Box gridArea="on-the-way">
                                                <Typography variant="body1">
                                                    On the way: {part.onTheWay} {part.units}
                                                </Typography>
                                            </Box>
                                            {sortedProjects.map((project, i) => {
                                                if (project.id in part.projects) {
                                                    return <Box key={i} gridArea={`project${i}`}>
                                                        <Typography variant="body1">
                                                            {project.name}: {part.projects[project.id]} {part.units}
                                                        </Typography>
                                                    </Box>
                                                }
                                                return null
                                            })}
                                        </Box>
                                        {part.note && <Box mt={3}>
                                            <Typography variant="body1">
                                                {part.note}
                                            </Typography>
                                        </Box>}
                                    </Box>}
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}