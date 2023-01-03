import { Box, CircularProgress, Grid, Paper, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { BluePrimaryIconButton } from "../../misc/buttons";
import { CategoryBank, PartBank } from "../useInventory";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { PrimaryLink } from "../../misc/links";
import EditIcon from '@mui/icons-material/Edit';
import Link from "next/link";

interface Props {
    categories: CategoryBank;
    parts: PartBank;
    loading: boolean;
    expandCategory: (id:string) => void;
    category: string;
    startOpen:boolean;
    isAdmin: boolean;
}

export default function ContentDisplay({categories, parts, loading, 
    expandCategory, category, startOpen, isAdmin}:Props) {
    
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
        if (!startOpen) {
            expandCategory(id)
        }
    }

    useMemo(() => {
        const readyCopy:{[id:string]: boolean} = {}
        let valChange = false
        let idChange = false
        let sameCount = 0
        categories[category].children.forEach(id => {
            if (!(id in childrenReady)) {
                idChange = true
                readyCopy[id] = false
            } else {
                ++sameCount
                readyCopy[id] = childrenReady[id]
            }
            if (categoryOpen[id] && childrenReady[id]) return

            if (!(id in categories)) return
            if (!('parts' in categories[id])) return

            const firstChild = categories[id].children[0]
            const firstPart = categories[id].parts[0]

            const containsPopulatedChildren = !firstChild || 
                ('parts' in (categories[firstChild] || {}))
            const containsParts = !firstPart || parts[firstPart]
            
            if (!(containsPopulatedChildren && containsParts)) return

            valChange = true
            readyCopy[id] = true
        })
        if (valChange || idChange || sameCount !== Object.keys(childrenReady).length) {
            setChildrenReady(readyCopy)
        }
        if (idChange || sameCount !== Object.keys(categoryOpen).length) {
            const catOpenCopy:{[id:string]: boolean} = {}
            categories[category].children.forEach(id => {
                catOpenCopy[id] = startOpen
            })
            setCategoryOpen(catOpenCopy)
        }
    }, [categories, parts, loading])

    return (
        <Box>
            {categories[category].children.sort((a, b) => (
                categories[a].name.localeCompare(categories[b].name)
            )).map(id => (
                <Box my={3} key={id}>
                    <Paper elevation={3}>
                        <Box py={1}>
                            <Box>
                                <Grid container alignItems="center" wrap="nowrap">
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
                                    {isAdmin && <>
                                        <Grid item flex={1} />
                                        <Grid item>
                                            <Link href="/inventory/category/[id]/update"
                                                as={`/inventory/category/${id}/update`} >
                                                <BluePrimaryIconButton>
                                                    <EditIcon />     
                                                </BluePrimaryIconButton> 
                                            </Link>
                                        </Grid>
                                    </>}
                                </Grid>
                            </Box>
                            {categoryOpen[id] && <Box pl={5}>
                                {!childrenReady[id] ? 
                                    <CircularProgress /> : 
                                    <ContentDisplay categories={categories}
                                        parts={parts} loading={loading}
                                        expandCategory={expandCategory}
                                        category={id} startOpen={startOpen}
                                        isAdmin={isAdmin} />}
                            </Box>}
                        </Box>
                    </Paper>
                </Box>
            ))}        
            {categories[category].parts.sort((a, b) => (
                parts[a].name.localeCompare(parts[b].name)
            )).map(id => (
                <Box my={3} key={id}>
                    <PrimaryLink href="/inventory/part/[id]" 
                        as={`/inventory/part/${id}`} variant="h6">
                        {parts[id].name}
                    </PrimaryLink>
                </Box>
            ))}
        </Box>
    )
}