import { Box, Dialog, DialogActions, DialogTitle, Grid, TextField, useMediaQuery, useTheme } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import { BluePrimaryButton, BluePrimaryOutlinedButton } from "../misc/buttons";

interface Props {
    title: string;
    error: string;
    open: boolean;
    defaultUsername: string;
    onSubmit: (username:string) => void;
    onClose: () => void;
}

export default function UsernameDialog({title, error, open, defaultUsername,
    onSubmit, onClose}:Props) {

    const [submitting, setSubmitting] = useState(false)

    const ref = useRef<HTMLInputElement>(null)

    const theme = useTheme()
    const largeScreen = useMediaQuery(theme.breakpoints.up('sm'))

    useMemo(() => {
        if (!submitting) return
        setSubmitting(false)
    }, [open, error])

    const dialogSubmit = () => {
        if (!ref.current?.value) return

        setSubmitting(true)
        onSubmit(ref.current?.value || '')
    }

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
                            }} error={Boolean(error)} helperText={error} />
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
                        <BluePrimaryButton disabled={submitting}
                            onClick={() => dialogSubmit()}>
                            Submit
                        </BluePrimaryButton>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    )
}