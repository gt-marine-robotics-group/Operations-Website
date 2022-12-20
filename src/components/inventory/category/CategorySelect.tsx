import { Box,Grid, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import axios from 'axios'
import { BlueSecondaryButton } from "../../misc/buttons";
import CategorySelectDialog from './CategorySelectDialog'

interface Props {
    setSelected: Dispatch<SetStateAction<string>>;
    selected: string;
    text: string;
    updateCategoryMap?: (vals:CategoryMap) => void;
}

export interface CategoryMap {
    [id:string]: {
        name: string;
        children: string[];
        parent?: string;
    }
}

const defaultBank:CategoryMap = {'/': {
    name: '',
    children: []
}}

export default function CategorySelect({setSelected, selected, 
    text, updateCategoryMap}:Props) {

    const [bank, setBank] = useState<CategoryMap>(defaultBank)
    const [loadingInitialData, setLoadingInitialData] = useState(true)
    const [errorLoadingInitialData, setErrorLoadingInitialData] = useState(false)

    const [openDialog, setOpenDialog] = useState(false)

    const path = useMemo(() => {
        if (loadingInitialData) {
            return 'None'
        }
        if (!selected || selected === '/') {
            return 'None'
        }
        if (!bank[selected].parent) {
            return `.../ ${bank[selected].name}`
        }
        const p = []
        let c:string|undefined = selected
        while (c) {
            p.push(bank[c].name)
            c = bank[c].parent
        }
        return p.reverse().join(' / ')
    }, [selected, loadingInitialData])

    useEffect(() => {
        const loadInitialData = async () => {
            try {

                const {data} = await axios.get('/api/inventory/category', {
                    params: {
                        parent: '/',
                        initialSelected: selected || '/',
                        mode: 'categorySelect'
                    },
                    retry: 3
                })

                const bankCopy:CategoryMap = {'/': {
                    name: '',
                    children: []
                }}
                for (const info of data) {
                    if (Array.isArray(info)) {
                        bankCopy['/'].children.push(info[0])
                        bankCopy[info[0]] = {
                            name: info[1],
                            children: info[2] ? info[2].split(',') : [],
                            parent: '/'
                        }
                    } else if (!(bankCopy['/'].children.includes(info))) {
                        bankCopy[selected] = {
                            name: info,
                            children: []
                        }
                    }
                }
                setBank(bankCopy)
                setLoadingInitialData(false)
                if (updateCategoryMap) {
                    updateCategoryMap(bankCopy)
                }
            } catch (e) {
                console.log(e)
                setErrorLoadingInitialData(true)
            }
        }
        loadInitialData()
    }, [])

    return (
        <Box>
            <Grid container spacing={0} alignItems="center">
                <Grid item>
                    <Box mr={1}>
                        <Typography variant="h6">
                            {text}:
                        </Typography>
                    </Box>
                </Grid>
                <Grid item>
                    <Box mr={1}>
                        <Typography variant="h6">
                            {!errorLoadingInitialData ? path : 'Error Loading Categories'}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item>
                    <BlueSecondaryButton disabled={loadingInitialData || errorLoadingInitialData}
                        onClick={() => setOpenDialog(true)}>
                        Change
                    </BlueSecondaryButton>
                </Grid>
            </Grid>
            <CategorySelectDialog setSelected={setSelected} open={openDialog}
                setOpen={setOpenDialog} bank={bank} setBank={setBank}
                updateCategoryMap={updateCategoryMap} />
        </Box>
    )
}