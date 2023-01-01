import { Box, FormGroup } from "@mui/material";
import { Formik, FormikHelpers, Form } from 'formik'
import * as yup from 'yup'
import FormikPasswordField from "../formik/PasswordField";
import FormikTextField from "../formik/TextField";
import { BluePrimaryButton } from "../misc/buttons";
import axios, { AxiosError } from 'axios'
import Router from 'next/router'

interface FormVals {
    email: string;
    password: string;
}

export default function LoginForm() {

    const onSubmit = async (values:FormVals, actions:FormikHelpers<FormVals>) => {
        try {
            await axios({
                method: 'POST',
                url: '/api/login',
                data: values
            })

            Router.push({
                pathname: '/'
            }) 
        } catch (e) {
            if ((e as AxiosError).response?.status === 409) {
                actions.setFieldError((e as any).response?.data?.field,
                    (e as any).response?.data?.msg)
            } else if ((e as AxiosError).response?.status === 401) {
                Router.push({
                    pathname: '/setup',
                    query: {
                        username: values.email.split('@')[0]
                    }
                })
            }
            actions.setSubmitting(false)
        }
    }

    return (
        <Box>
            <Formik validationSchema={yup.object({
                email: yup.string().required('Please enter your email.')
                    .email('Please enter a valid email.'),
                password: yup.string().required('Please enter your password.')
            })} initialValues={{email: '', password: ''}}
            onSubmit={(values, actions) => onSubmit(values, actions)}>
                {({isSubmitting, isValidating}) => (
                    <Form>
                        <Box my={3}>
                            <FormGroup>
                                <FormikTextField name="email" label="GT Email" />
                            </FormGroup>
                        </Box>
                        <Box my={3}>
                            <FormGroup>
                                <FormikPasswordField name="password" label="Password" />
                            </FormGroup>
                        </Box>
                        <Box my={3} maxWidth={200} mx="auto">
                            <BluePrimaryButton type="submit" 
                                disabled={isSubmitting || isValidating} fullWidth>
                                Login
                            </BluePrimaryButton>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}