import { createTheme } from '@mui/material'

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#3333ff', 
            dark: '#002db3',
            light: '#4d79ff'
        },
        background: {
            default: '#f1f4ff',
            paper: '#fff'
        },
        text: {
            secondary: '#fff'
        }
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    }
})