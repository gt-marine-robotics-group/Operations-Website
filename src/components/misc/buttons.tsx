import { Button, IconButton } from "@mui/material";
import { styled } from '@mui/material/styles'

export const BluePrimaryButton = styled(Button)(({theme}) => ({
    background: theme.palette.primary.main,
    color: theme.palette.text.secondary,
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
    transition: 'background 300ms',
    '&:hover': {
        background: theme.palette.primary.dark
    },
    '&.Mui-disabled': {
        color: theme.palette.text.secondary,
        opacity: 0.6
    }
}))

export const BlueSecondaryButton = styled(Button)(({theme}) => ({
    background: theme.palette.primary.main,
    color: theme.palette.text.secondary,
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(1)} ${theme.spacing(1)}`,
    transition: 'background 300ms',
    '&:hover': {
        background: theme.palette.primary.dark
    },
    '&.Mui-disabled': {
        color: theme.palette.text.secondary,
        opacity: 0.6
    }
}))

export const BluePrimaryOutlinedButton = styled(Button)(({theme}) => ({
    background: 'transparent',
    border: '2px solid #000',
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
    transition: 'background color border 300ms',
    '&:hover': {
        color: '#fff',
        background: theme.palette.primary.dark,
        borderColor: theme.palette.primary.dark
    }
}))

export const BluePrimaryIconButton = styled(IconButton)(({theme}) => ({
    color: theme.palette.primary.main,
    transition: 'color 300ms',
    '&:hover': {
        color: theme.palette.primary.dark
    }
}))

export const RedPrimaryIconButton = styled(IconButton)(({theme}) => ({
    color: theme.palette.error.main,
    transition: 'color 300ms',
    '&:hover': {
        color: theme.palette.error.dark
    }
}))