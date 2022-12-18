import { Box, Grid, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import axios from 'axios'
import { BlueSecondaryButton } from "../../misc/buttons";

interface Props {
    setSelected: Dispatch<SetStateAction<string>>;
    initialSelected: string;
    text: string;
}

interface CategoryMap {
    [id:string]: {
        name: string;
        children: string[];
        parent?: string;
    }
}

export default function CategorySelect({setSelected, initialSelected, 
    text}:Props) {

    const [bank, setBank] = useState<CategoryMap>({'/': {
        name: '',
        children: []
    }})
    const [curr, setCurr] = useState('')
    const [loadingInitialData, setLoadingInitialData] = useState(true)
    const [errorLoadingInitialData, setErrorLoadingInitialData] = useState(false)

    const path = useMemo(() => {
        if (!curr) {
            return '/'
        }
        if (curr === '/') {
            return 'None'
        }
        const p = []
        let c:string|undefined = curr
        while (c) {
            p.push(bank[c].name)
            c = bank[c].parent
        }
        return p.reverse().join('/')
    }, [curr])

    console.log(bank)

    useEffect(() => {
        const loadInitialData = async () => {
            try {

                const {data} = await axios.get('/api/inventory/category', {
                    params: {
                        parent: '/',
                        initialSelected,
                        mode: 'categorySelect'
                    },
                    retry: 3
                })

                const bankCopy = {...bank}
                for (const info of data) {
                    if (Array.isArray(info)) {
                        bankCopy['/'].children.push(info[0])
                        bankCopy[info[0]] = {
                            name: info[1],
                            children: info[2].split(',')
                        }
                    } else if (!(bankCopy['/'].children.includes(info))) {
                        bankCopy[initialSelected] = {
                            name: info,
                            children: []
                        }
                    }
                }
                setCurr(initialSelected || '/')
                setBank(bankCopy)
                setLoadingInitialData(false)
            } catch (e) {
                console.log(e)
                setErrorLoadingInitialData(true)
            }
        }
        loadInitialData()
    }, [])

    return (
        <Box>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <Typography variant="h6">
                        {text}:
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="h6">
                        {path}
                    </Typography>
                </Grid>
                <Grid item>
                    <BlueSecondaryButton disabled={loadingInitialData || errorLoadingInitialData}>
                        Change
                    </BlueSecondaryButton>
                </Grid>
            </Grid>
        </Box>
    )
}