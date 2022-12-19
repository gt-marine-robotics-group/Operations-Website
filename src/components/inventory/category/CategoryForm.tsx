import { Box, FormGroup } from "@mui/material";
import { useState } from "react";
import { Formik, FormikHelpers, Form } from 'formik'
import FormikTextField from "../../formik/TextField";
import * as yup from 'yup'
import { C_Category } from "../../../database/interfaces/Category";
import { FormatAlignRight } from "@mui/icons-material";
import CategorySelect from "./CategorySelect";

class Props {
    initialCategory?: C_Category;
}

interface FormVals {
    name: string;
}

export default function CategoryForm({initialCategory}:Props) {

    const [parentCategory, setParentCategory] = 
        useState(initialCategory?.data.parent['@ref'].id || '')

    const onSubmit = async (values:FormVals, 
        actions:FormikHelpers<FormVals>) => {
        console.log('submitting')
    }

    return (
        <Box>
            <Formik validationSchema={yup.object({
                name: yup.string().required('Please enter a name.')
            })} initialValues={{name: initialCategory?.data.name || ''}} 
            onSubmit={(values, actions) => onSubmit(values, actions)}>
                {({isSubmitting, isValidating}) => (
                    <Form>
                        <Box my={3}>
                            <FormGroup>
                                <FormikTextField name="name" label="Name" />
                            </FormGroup>
                        </Box>
                        <Box my={3}>
                            <FormGroup>
                                <CategorySelect setSelected={setParentCategory}
                                    selected={parentCategory} 
                                    text="Parent Category" />
                            </FormGroup>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}