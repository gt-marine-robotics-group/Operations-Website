import { ArrowDropDown, ArrowRight} from "@mui/icons-material";
import { Box, Grid, Paper, Typography, Checkbox, CircularProgress } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { C_Location, LOCATION_TYPES, PLURAL_LOCATION_TYPES } from "../../database/interfaces/Location";
import { BluePrimaryIconButton } from "../misc/buttons";

interface Props {
    locations: {[name:string]: C_Location[]};
    loading: boolean;
    loadCategory: (name:string) => void;
    viewingLocations: Set<string>;
    setViewingLocations: Dispatch<SetStateAction<Set<string>>>;
}

export default function ViewLocation({locations, loading, 
    loadCategory, viewingLocations, setViewingLocations}:Props) {

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
        loadCategory(LOCATION_TYPES[index])
    }

    const checkCategory = (name:string) => {
        setCheckedCategories({...checkedCategories, 
            [name]: !checkedCategories[name]})
    }

    const checkLocation = (id:string) => {
        const copy = new Set(viewingLocations)
        if (!viewingLocations.has(id)) {
            copy.add(id)
            setViewingLocations(copy)
        } else {
            copy.delete(id)
            setViewingLocations(copy)
        }
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
                                            {PLURAL_LOCATION_TYPES[i]}
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
                            <Box pl={5}>
                                {expandedCategories[i] && locations[name]?.map(loc => (
                                    <Box key={loc.ref['@ref'].id} my={1}>
                                        <Grid container justifyContent="space-between"
                                            wrap="nowrap" alignItems="center">
                                            <Grid item>
                                                <Typography variant="body1">
                                                    {loc.data.letter}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Checkbox 
                                                    checked={viewingLocations.has(loc.ref['@ref'].id)}
                                                    onChange={() => checkLocation(loc.ref['@ref'].id)} 
                                                    sx={{color: 'primary.main'}}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            ))} 
        </Box>
    )
}