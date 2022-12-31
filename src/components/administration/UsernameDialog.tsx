import { Box, Dialog, DialogActions, DialogTitle, Grid, TextField, useMediaQuery, useTheme } from "@mui/material";
import { useRef } from "react";
import { BluePrimaryButton, BluePrimaryOutlinedButton } from "../misc/buttons";

interface Props {
    title: string;
    open: boolean;
    defaultUsername: string;
    onSubmit: (username:string) => void;
    onClose: () => void;
}

export default function UsernameDialog({title, open, defaultUsername,
    onSubmit, onClose}:Props) {

    const ref = useRef<HTMLInputElement>(null)

    const theme = useTheme()
    const largeScreen = useMediaQuery(theme.breakpoints.up('sm'))

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm">
            <DialogTitle textAlign="center">
                {title}
            </DialogTitle>
            <DialogTitle>
                <Box minWidth={largeScreen ? 550 : 0}>
                    <Box maxWidth={400} mx="auto">
                        <TextField fullWidth defaultValue={defaultUsername}
                            inputRef={ref} label="GT Username" InputLabelProps={{
                                sx: {color: '#535040'}
                            }} />
                    </Box>
                </Box>
            </DialogTitle>
            <DialogActions>
                <Grid container spacing={1} justifyContent="center">
                    <Grid item>
                        <BluePrimaryOutlinedButton onClick={onClose}>
                            Cancel
                        </BluePrimaryOutlinedButton>
                    </Grid>
                    <Grid item>
                        <BluePrimaryButton onClick={() => onSubmit(ref.current?.value || '')}>
                            Submit
                        </BluePrimaryButton>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    )
}