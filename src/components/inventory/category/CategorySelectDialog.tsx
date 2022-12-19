import { Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { BluePrimaryButton, BluePrimaryIconButton, BluePrimaryOutlinedButton } from "../../misc/buttons";
import { CategoryMap } from './CategorySelect'
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import axios from 'axios'

interface Props {
    setSelected: Dispatch<SetStateAction<string>>;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    bank: CategoryMap;
    setBank: Dispatch<SetStateAction<CategoryMap>>;
    updateCategoryMap?: (vals:CategoryMap) => void;
}

interface DisplayProps {
    id: string;
    selected: string;
    setSelected: Dispatch<SetStateAction<string>>;
    bank: Props['bank'];
    setBank: Props['setBank'];
    updateCategoryMap?: (vals:CategoryMap) => void;
}

function CategoryDisplay({id, selected, setSelected, bank, setBank,
    updateCategoryMap}:DisplayProps) {

    const [showChildren, setShowChildren] = useState(false)
    const [loadingChildren, setLoadingChildren] = useState(false)
    const [hovering, setHovering] = useState(false)

    const color = useMemo(() => selected === id ? '#fff' : undefined, [selected])

    useMemo(() => {
        if (!showChildren) return

        for (const childId of bank[id].children) {
            if (!bank[childId]) {
                setLoadingChildren(true)
                return
            }
        }
    }, [showChildren])

    useEffect(() => {
        if (!loadingChildren) return

        const loadChildren = async () => {
            try {
                const {data} = await axios.get('/api/inventory/category', {
                    params: {
                        parent: id,
                        mode: 'categorySelect'
                    },
                    retry: 3
                })

                const bankCopy = {...bank}
                for (const info of data) {
                    bankCopy[info[0]] = {
                        name: info[1],
                        children: info[2] ? info[2].split(',') : [],
                        parent: id
                    }
                }

                setLoadingChildren(false)
                setBank(bankCopy)
                if (updateCategoryMap) {
                    updateCategoryMap(bankCopy)
                }
            } catch (e) {
                console.log(e)
                setLoadingChildren(false)
                setShowChildren(false)
            }
        }
        loadChildren()
    }, [loadingChildren])

    const hasChildren = useMemo(() => (
        id !== '/' && bank[id].children.length > 0
    ), [id, bank])

    return (
        <Box>
            <Box borderRadius={1}
                sx={{bgcolor: selected === id ? "primary.main" : 
                    !hovering ? undefined : "primary.light"}}>
                <Grid container alignItems="center">
                    <Grid item>
                        <BluePrimaryIconButton 
                            onClick={() => setShowChildren(!showChildren)}
                            disabled={!hasChildren || loadingChildren}
                            sx={{opacity: hasChildren ? 1 : 0}}>
                            {showChildren ? <ArrowDropDownIcon
                                sx={{color}} /> : 
                                <ArrowRightIcon sx={{color}} />}
                        </BluePrimaryIconButton>
                    </Grid>
                    <Grid item flex={1} onMouseEnter={() => setHovering(true)} 
                        onMouseLeave={() => setHovering(false)}
                        onClick={() => setSelected(id)}
                        sx={{cursor: "default"}}>
                        <Typography variant="h6" 
                            sx={{color}}>
                            {bank[id].name || 'None'}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            {hasChildren && showChildren && <Box pl={5}>
                {loadingChildren ? <CircularProgress /> : 
                    bank[id].children.map((childId, i) => (
                        <Box key={i}>
                            <CategoryDisplay id={childId} bank={bank}
                                setBank={setBank} selected={selected}
                                setSelected={setSelected}
                                updateCategoryMap={updateCategoryMap} />
                        </Box>
                    ))}
            </Box>}
        </Box>
    )
}

export default function CategorySelectDialog({setSelected, 
    open, setOpen, bank, setBank, updateCategoryMap}:Props) {
    
    const theme = useTheme()
    const fullScreenDialog = useMediaQuery(theme.breakpoints.down('lg'))

    const [dialogSelected, setDialogSelected] = useState('')

    const onSelectClick = () => {
        setOpen(false)
        setSelected(dialogSelected)
    }

    return (
        <Dialog fullScreen={fullScreenDialog} open={open}
            onClose={() => setOpen(false)} maxWidth="lg">
            <DialogTitle>
                Select Category
            </DialogTitle>
            <DialogContent>
                <Box minWidth={!fullScreenDialog ? 900: 0}>
                    {['/', ...bank['/'].children].map((id, i) => (
                        <Box key={i}>
                            <CategoryDisplay id={id} bank={bank} setBank={setBank}
                                setSelected={setDialogSelected} 
                                selected={dialogSelected}
                                updateCategoryMap={updateCategoryMap} /> 
                        </Box>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <BluePrimaryOutlinedButton onClick={() => setOpen(false)}>
                    Cancel
                </BluePrimaryOutlinedButton>
                <BluePrimaryButton disabled={!dialogSelected} 
                    onClick={() => onSelectClick()}>
                    Select
                </BluePrimaryButton>
            </DialogActions>
        </Dialog>
    )
}