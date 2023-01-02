import { Box, FormGroup } from "@mui/material";
import { Form, Formik, FormikHelpers } from "formik";
import * as yup from 'yup'
import FormikPasswordField from "../formik/PasswordField";
import { BluePrimaryButton } from "../misc/buttons";
import Router from 'next/router'
import axios from 'axios'
import { C_User } from "../../database/interfaces/User";

interface Props {
    user: C_User;
}

interface FormVals {
    password: string;
    confirmedPassword: string;
}

export default function CreatePasswordForm({user}:Props) {

    const onSubmit = async (values:FormVals, actions:FormikHelpers<FormVals>) => {

        try {

            await axios({
                method: 'POST',
                url: '/api/setup',
                data: {
                    userId: user.ref['@ref'].id,
                    password: values.password
                }
            })

            Router.push({
                pathname: '/'
            })
        } catch (e) {
            console.log(e)
            actions.setSubmitting(false)
        }
    }

    return (
        <Box>
            <Formik validationSchema={yup.object({
                password: yup.string().required('Please enter a password.'),
                confirmedPassword: yup.string().
                    oneOf([yup.ref('password'), null], 'Passwords must match.')
                    .required('Please confirm your password.')
            })} initialValues={{password: '', confirmedPassword: ''}}
            onSubmit={(values, actions) => onSubmit(values, actions)}>
                {({isSubmitting, isValidating}) => (
                    <Form>
                        <Box my={3}>
                            <FormGroup>
                                <FormikPasswordField name="password" 
                                    label="password" />
                            </FormGroup>
                        </Box>
                        <Box my={3}>
                            <FormGroup>
                                <FormikPasswordField name="confirmedPassword" 
                                    label="Confirm Password" />
                            </FormGroup>
                        </Box>
                        <Box my={3} maxWidth={200} mx="auto">
                            <BluePrimaryButton type="submit" 
                                disabled={isSubmitting || isValidating} fullWidth>
                                Set Password
                            </BluePrimaryButton>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}