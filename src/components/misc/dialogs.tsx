import { Box, Dialog, DialogActions, DialogContent, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useMemo, useState } from "react";
import { BluePrimaryButton, BluePrimaryOutlinedButton } from "./buttons";

interface Props {
    message: string;
    open: boolean;
    onClose: () => void;
    onProceed: () => void;
}

export function ConfirmationDialog({message, open, onClose, onProceed}:Props) {

    const [submitting, setSubmitting] = useState(false)

    const theme = useTheme()
    const largeScreen = useMediaQuery(theme.breakpoints.up('sm'))

    const proceed = () => {
        setSubmitting(true)
        onProceed()
    }

    useMemo(() => {
        if (!submitting) return
        setSubmitting(false)
    }, [open])

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                <Box minWidth={largeScreen ? 550 : 0} textAlign="center">
                    <Typography variant="body1">
                        {message}
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Grid container spacing={1} justifyContent="center">
                    <Grid item>
                        <BluePrimaryOutlinedButton onClick={onClose}>
                            Cancel
                        </BluePrimaryOutlinedButton>
                    </Grid>
                    <Grid item>
                        <BluePrimaryButton disabled={submitting}
                            onClick={() => proceed()}>
                            Proceed
                        </BluePrimaryButton>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    )
}