import { Box, FormGroup } from "@mui/material";
import { useState } from "react";
import { Formik, FormikHelpers, Form } from 'formik'
import FormikTextField from "../../formik/TextField";
import * as yup from 'yup'

class Props {
    'initialVals': {
        name: string,
    };
    categoryId?: string;
}

export default function CategoryForm({initialVals, categoryId}:Props) {

    const [parentCategory, setParentCategory] = useState('')

    const onSubmit = async (values:Props['initialVals'], 
        actions:FormikHelpers<Props['initialVals']>) => {
        console.log('submitting')
    }

    return (
        <Box>
            <Formik validationSchema={yup.object({
                name: yup.string().required('Please enter a name.')
            })} initialValues={initialVals} 
            onSubmit={(values, actions) => onSubmit(values, actions)}>
                {({isSubmitting, isValidating}) => (
                    <Form>
                        <Box my={3}>
                            <FormGroup>
                                <FormikTextField name="name" label="Name" />
                            </FormGroup>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}