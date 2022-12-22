import { Box, Grid, Paper, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { BluePrimaryIconButton } from "../../misc/buttons";
import { CategoryBank, PartBank } from "../useInventory";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { PrimaryLink } from "../../misc/links";

interface Props {
    categories: CategoryBank;
    parts: PartBank;
    loading: boolean;
    expandCategory: (id:string) => void;
    category: string;
}

export default function ContentDisplay({categories, parts, loading, 
    expandCategory, category}:Props) {
    
    const [categoryOpen, setCategoryOpen] = useState(() => {
        const vals:{[id:string]: boolean} = {}
        categories[category].children.forEach(id => {
            vals[id] = false
        })
        return vals
    })

    const openCategory = (id:string) => {
        setCategoryOpen({...categoryOpen, id: true})
        expandCategory(id)
    }

    return (
        <Box>
            {categories[category].children.map(id => (
                <Box my={3} key={id}>
                    <Paper elevation={3}>
                        <Box py={1}>
                            <Box>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <BluePrimaryIconButton disabled={loading}
                                            onClick={() => openCategory(id)}>
                                            {categoryOpen[id] ? 
                                                <ArrowDropDownIcon /> :
                                                <ArrowRightIcon />}
                                        </BluePrimaryIconButton>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h6">
                                            {categories[id].name}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                            {categoryOpen[id] && <Box pl={5}>
                                children/loading
                            </Box>}
                        </Box>
                    </Paper>
                </Box>
            ))}        
            {categories[category].parts.map(id => (
                <Box my={3} key={id}>
                    <PrimaryLink href="/" variant="h6">
                        {parts[id].name}
                    </PrimaryLink>
                </Box>
            ))}
        </Box>
    )
}