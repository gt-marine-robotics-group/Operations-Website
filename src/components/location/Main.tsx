import { Box, Container, Grid, useMediaQuery } from "@mui/material";
import { useMemo, useState } from "react";
import { Cookie_User } from "../../database/interfaces/User";
import { includesAdminRole } from "../../utils/auth";
import { BluePrimaryButtonGroup } from "../misc/buttonGroups";
import LocationViz from "./LocationViz";
import useLocations from "./useLocations";

const options = [
    {text: 'View', value: 'view'},
    {text: 'Add', value: 'add'},
    {text: 'Update', value: 'update'}
]

interface Props {
    user: Cookie_User;
}

export default function Main({user}:Props) {

    const {locations} = useLocations()

    const [optionSelected, setOptionSelected] = useState('view')

    const isAdmin = useMemo(() => (
        includesAdminRole(user.roles)
    ), [user])

    return (
        <Box mt={3}>
            <Container maxWidth="xl">
                <Grid container spacing={3} justifyContent="space-between">
                    <Grid item>
                        <Box minWidth={420}>
                            {isAdmin && <Box textAlign="center">
                                <BluePrimaryButtonGroup selected={optionSelected}
                                    setSelected={setOptionSelected}
                                    options={options} />
                            </Box>}
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