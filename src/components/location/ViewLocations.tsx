import { ArrowDropDown, ArrowRight} from "@mui/icons-material";
import { Box, Grid, Paper, Typography, Checkbox } from "@mui/material";
import { useState } from "react";
import { C_Location, LOCATION_TYPES } from "../../database/interfaces/Location";
import { BluePrimaryIconButton } from "../misc/buttons";

interface Props {
    locations: C_Location[];
    loading: boolean;
    loadCategory: (name:string) => void;
}

export default function ViewLocation({locations, loading, 
    loadCategory}:Props) {

    const [expandedCategories, setExpandedCategories] = 
        useState(LOCATION_TYPES.map(() => false))

    const [checkedCategories, setCheckedCategories] = useState(() => {
        const categories:{[name:string]: boolean} = {}
        LOCATION_TYPES.forEach((name) => {
            categories[name] = false
        })
        return categories
    })

    const openCategory = (index:number) => {
        const copy = [...expandedCategories]
        copy[index] = !copy[index]
        setExpandedCategories(copy)
    }

    const checkCategory = (name:string) => {
        setCheckedCategories({...checkedCategories, 
            [name]: !checkedCategories[name]})
    }

    return (
        <Box>
            {LOCATION_TYPES.map((name, i) => (
                <Box my={2} key={i}>
                    <Paper elevation={3}>
                        <Box py={1}>
                            <Box>
                                <Grid container alignItems="center" wrap="nowrap">
                                    <Grid item>
                                        <BluePrimaryIconButton disabled={loading}
                                            onClick={() => openCategory(i)}>
                                            {expandedCategories[i] ? 
                                                <ArrowDropDown /> :
                                                <ArrowRight />
                                            }
                                        </BluePrimaryIconButton>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h6">
                                            {name}s
                                        </Typography>
                                    </Grid>
                                    <Grid item flex={1} />
                                    <Grid item>
                                        <Checkbox checked={checkedCategories[name]}
                                            onChange={() => checkCategory(name)}
                                            sx={{color: 'primary.main'}} />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            ))} 
        </Box>
    )
}