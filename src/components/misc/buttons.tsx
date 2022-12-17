import { Button } from "@mui/material";
import { styled } from '@mui/material/styles'

export const BluePrimaryButton = styled(Button)(({theme}) => ({
    background: theme.palette.primary.main,
    color: theme.palette.text.secondary,
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
    transition: 'background 300ms',
    '&:hover': {
        background: theme.palette.primary.dark
    }
}))