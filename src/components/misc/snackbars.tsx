import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import {IconButton, Snackbar as MUISnackbar} from '@mui/material'

interface Props {
    msg: {content:string;type:string;};
    setMsg: Dispatch<SetStateAction<Props['msg']>>;
}

export function PrimarySnackbar({msg, setMsg}:Props) {

    return (
        <MUISnackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={Boolean(msg.type)}
        onClose={() => setMsg({type: '', content: ''})} message={msg.content} autoHideDuration={6000}
        ContentProps={{sx: {backgroundColor: msg.type === 'success' ? 'primary.main' : msg.type === 'error' ? 'error.main' : ''}}}
        action={<IconButton size="small" sx={{color: '#fff'}}
        onClick={() => setMsg({type: '', content: ''})}>
            <CloseIcon />
        </IconButton>} />
    )
}