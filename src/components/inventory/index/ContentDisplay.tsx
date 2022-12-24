import { Box, CircularProgress, Grid, Paper, Typography } from "@mui/material";
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
    const [childrenReady, setChildrenReady] = useState(() => {
        const vals:{[id:string]: boolean} = {}
        categories[category].children.forEach(id => {
            vals[id] = false
        })
        return vals
    })

    const openCategory = (id:string) => {
        if (categoryOpen[id]) {
            setCategoryOpen({...categoryOpen, [id]: false})
            return
        }
        setCategoryOpen({...categoryOpen, [id]: true})
        expandCategory(id)
    }

    useMemo(() => {
        const readyCopy = {...childrenReady}
        let change = false
        categories[category].children.forEach(id => {
            if (!categoryOpen[id]) return
            if (categoryOpen[id] && childrenReady[id]) return

            if (!(id in categories)) return
            if (!('parts' in categories[id])) return

            const firstChild = categories[id].children[0]
            const firstPart = categories[id].parts[0]

            const containsPopulatedChildren = !firstChild || 
                ('parts' in (categories[firstChild] || {}))
            const containsParts = !firstPart || parts[firstPart]
            
            if (!(containsPopulatedChildren && containsParts)) return

            change = true
            readyCopy[id] = true
        })
        if (change) {
            setChildrenReady(readyCopy)
        }
    }, [categories, parts, loading])

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
                                {!childrenReady[id] ? 
                                    <CircularProgress /> : 
                                    <ContentDisplay categories={categories}
                                        parts={parts} loading={loading}
                                        expandCategory={expandCategory}
                                        category={id} />}
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