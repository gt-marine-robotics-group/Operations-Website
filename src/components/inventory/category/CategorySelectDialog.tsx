import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { BluePrimaryButton, BluePrimaryOutlinedButton } from "../../misc/buttons";

interface Props {
    setSelected: Dispatch<SetStateAction<string>>;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CategorySelectDialog({setSelected, 
    open, setOpen}:Props) {
    
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
                    hello
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