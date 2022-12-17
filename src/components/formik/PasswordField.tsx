import { useField, Field } from 'formik'
import { Props, inputProps, inputLabelProps, formHelperTextProps } from './formikProps'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import { useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

export default function FormikPasswordField(props:Props) {

    const [visible, setVisible] = useState(false)

    const [field, meta] = useField({
        name: props.name,
    })

    return (
        <Field {...props} {...field} as={TextField} 
        error={meta.touched && meta.error ? true : false} 
        helperText={meta.touched && meta.error ? meta.error : ''} 
        type={visible ? "text" : "password"}
        InputProps={{...inputProps, endAdornment: <InputAdornment position="end">
            <IconButton aria-label="Toggle password visiblity" onClick={() => setVisible(!visible)}>
                {visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
        </InputAdornment>}} 
        InputLabelProps={inputLabelProps} FormHelperTextProps={formHelperTextProps} />
    )
}