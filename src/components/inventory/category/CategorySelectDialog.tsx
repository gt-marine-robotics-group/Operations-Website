import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { BluePrimaryButton, BluePrimaryIconButton, BluePrimaryOutlinedButton } from "../../misc/buttons";
import { CategoryMap } from './CategorySelect'
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface Props {
    setSelected: Dispatch<SetStateAction<string>>;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    bank: CategoryMap;
    setBank: Dispatch<SetStateAction<CategoryMap>>;
}

interface DisplayProps {
    id: string;
    selected: string;
    setSelected: Dispatch<SetStateAction<string>>;
    bank: Props['bank'];
    setBank: Props['setBank'];
}

function CategoryDisplay({id, selected, setSelected, bank, setBank}:DisplayProps) {

    const [showChildren, setShowChildren] = useState(false)
    const [hovering, setHovering] = useState(false)

    const hasChildren = useMemo(() => (
        id !== '/' && bank[id].children.length > 0
    ), [id, bank])

    return (
        <Box>
            <Box borderRadius={1}
                sx={{bgcolor: !hovering ? undefined : "primary.light"}}>
                <Grid container alignItems="center">
                    <Grid item>
                        <BluePrimaryIconButton 
                            onClick={() => setShowChildren(!showChildren)}
                            disabled={!hasChildren} sx={{opacity: hasChildren ? 1 : 0}}>
                            {showChildren ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                        </BluePrimaryIconButton>
                    </Grid>
                    <Grid item flex={1} onMouseEnter={() => setHovering(true)} 
                        onMouseLeave={() => setHovering(false)}
                        sx={{cursor: "default"}}>
                        <Typography variant="h6">
                            {bank[id].name || 'None'}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box pl={5}>
                future children
            </Box>
        </Box>
    )
}

export default function CategorySelectDialog({setSelected, 
    open, setOpen, bank, setBank}:Props) {
    
    const theme = useTheme()
    const fullScreenDialog = useMediaQuery(theme.breakpoints.down('lg'))

    const [dialogSelected, setDialogSelected] = useState('')

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
                                selected={dialogSelected} /> 
                        </Box>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <BluePrimaryOutlinedButton onClick={() => setOpen(false)}>
                    Cancel
                </BluePrimaryOutlinedButton>
                <BluePrimaryButton disabled={!dialogSelected}>
                    Select
                </BluePrimaryButton>
            </DialogActions>
        </Dialog>
    )
}