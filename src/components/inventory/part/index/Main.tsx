import { Box, CircularProgress, Container, Grid, Paper, Typography } from "@mui/material";
import { useMemo } from "react";
import { Cookie_User } from "../../../../database/interfaces/User";
import { PopulatedPart, ProjectData } from "../usePart";

interface Props {
    user: Cookie_User;
    part: PopulatedPart | null;
    error: boolean;
    projects: ProjectData[];
}

export default function Main({user, part, projects, error}:Props) {

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

    return (
        <Box mt={6}>
            <Container maxWidth="lg">
                <Paper elevation={3}>
                    <Box minHeight={500} px={3} >
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