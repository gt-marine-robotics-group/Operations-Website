import { Box, Container, Grid, useMediaQuery } from "@mui/material";
import { useMemo, useState } from "react";
import { Cookie_User } from "../../database/interfaces/User";
import { includesAdminRole } from "../../utils/auth";
import { BluePrimaryButtonGroup } from "../misc/buttonGroups";
import LocationViz from "./LocationViz";
import useLocations from "./useLocations";
import ViewLocation from "./ViewLocations";

const options = [
    {text: 'View', value: 'view'},
    {text: 'Add', value: 'add'},
    {text: 'Update', value: 'update'}
]

interface Props {
    user: Cookie_User;
}

export default function Main({user}:Props) {

    const {locations, loadCategory, loading, 
        viewingLocations, setViewingLocations} = useLocations()

    const [optionSelected, setOptionSelected] = useState('view')

    const isAdmin = useMemo(() => (
        includesAdminRole(user.roles)
    ), [user])

    return (
        <Box mt={3}>
            <Container maxWidth="xl">
                <Grid container spacing={3} justifyContent="center">
                    <Grid item>
                        <Box minWidth={270}>
                            {isAdmin && <Box>
                                <BluePrimaryButtonGroup selected={optionSelected}
                                    setSelected={setOptionSelected}
                                    options={options} />
                            </Box>}
                            <Box display={optionSelected === 'view' ? 'initial': 'none'}>
                                <ViewLocation locations={locations} loading={loading} 
                                    loadCategory={loadCategory} 
                                    viewingLocations={viewingLocations}
                                    setViewingLocations={setViewingLocations} />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Box textAlign="center">
                            <LocationViz locations={locations} />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}