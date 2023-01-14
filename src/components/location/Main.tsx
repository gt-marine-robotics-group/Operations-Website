import { Box, Container, Grid } from "@mui/material";
import { useState } from "react";
import { BluePrimaryButtonGroup } from "../misc/buttonGroups";
import LocationViz from "./LocationViz";
import useLocations from "./useLocations";

const options = [
    {text: 'View', value: 'view'},
    {text: 'Add', value: 'add'},
    {text: 'Update', value: 'update'}
]

export default function Main() {

    const {} = useLocations()

    const [optionSelected, setOptionSelected] = useState('view')

    return (
        <Box mt={3}>
            <Container maxWidth="xl">
                <Grid container spacing={3} justifyContent="space-between">
                    <Grid item>
                        <Box minWidth={420}>
                            <Box textAlign="center">
                                <BluePrimaryButtonGroup selected={optionSelected}
                                    setSelected={setOptionSelected}
                                    options={options} />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Box textAlign="center">
                            <LocationViz />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}