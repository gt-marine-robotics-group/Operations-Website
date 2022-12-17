import { useField, Field } from 'formik'
import { Props, inputProps, inputLabelProps, formHelperTextProps } from './formikProps'
import { TextField } from '@mui/material'

export default function FormikTextField(props:Props) {

    const [field, meta] = useField({
        name: props.name,
        type: props.type || "text"
    })

    return (
        <Field {...props} {...field} as={TextField} 
        error={meta.touched && meta.error ? true : false} 
        helperText={meta.touched && meta.error ? meta.error : ''}
        InputProps={inputProps} 
        InputLabelProps={inputLabelProps} 
        FormHelperTextProps={formHelperTextProps} fullWidth />
    )
}