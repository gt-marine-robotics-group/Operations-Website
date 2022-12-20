import { Box, FormGroup } from "@mui/material";
import { useRef, useState } from "react";
import { Formik, FormikHelpers, Form, FormikProps } from 'formik'
import FormikTextField from "../../formik/TextField";
import * as yup from 'yup'
import { C_Category } from "../../../database/interfaces/Category";
import CategorySelect, { CategoryMap } from "./CategorySelect";
import axios from 'axios'
import Router from 'next/router'
import { BluePrimaryButton } from "../../misc/buttons";
import { C_Ref } from "../../../database/interfaces/fauna";

class Props {
    initialCategory?: C_Category;
}

interface FormVals {
    name: string;
}

export default function CategoryForm({initialCategory}:Props) {

    console.log('initialCategory', initialCategory)
    const [parentCategory, setParentCategory] = 
        useState<string>(!initialCategory ? '/' : 
            typeof(initialCategory.data.parent) === 'string' ? 
            initialCategory.data.parent as string : 
            (initialCategory.data.parent as C_Ref)['@ref'].id as any)
    const [categoryBank, setCategoryBank] = useState<CategoryMap>({'/': {
        name: '',
        children: []
    }})

    const updateCategoryMap = (vals:CategoryMap) => setCategoryBank(vals)
    
    const [submitting, setSubmitting] = useState(false)
    const formRef = useRef<FormikProps<FormVals>>(null)

    const onSubmit = async (values:FormVals, 
        actions:FormikHelpers<FormVals>) => {
        setSubmitting(true)
        try {
            if (!initialCategory) {
                await axios({
                    method: 'POST',
                    url: '/api/inventory/category/create',
                    data: {data: {
                        name: values.name,
                        parent: parentCategory,
                        children: [],
                        parts: [],
                        search: values.name.split(' ').filter(v => v).map(v => v.toLowerCase()),
                    }, 
                    parentChildren: categoryBank[parentCategory].children
                }
                })
            } else {
                // update the category
            }

            Router.push({
                pathname: '/inventory',
                query: {
                    categoryAdded: true
                }
            }) 
        } catch (e) {
            console.log(e)
            setSubmitting(false)
        }
    }

    return (
        <Box>
            <Formik innerRef={formRef} validationSchema={yup.object({
                name: yup.string().required('Please enter a name.')
            })} initialValues={{name: initialCategory?.data.name || ''}} 
            onSubmit={(values, actions) => onSubmit(values, actions)}>
                {() => (
                    <Form>
                        <Box my={3}>
                            <FormGroup>
                                <FormikTextField name="name" label="Name" />
                            </FormGroup>
                        </Box>
                    </Form>
                )}
            </Formik>
            <Box my={3}>
                <FormGroup>
                    <CategorySelect setSelected={setParentCategory}
                        selected={parentCategory} 
                        updateCategoryMap={updateCategoryMap}
                        text="Parent Category" />
                </FormGroup>
            </Box>
            <Box my={3} maxWidth={200} mx="auto">
                <BluePrimaryButton fullWidth onClick={() => formRef.current?.submitForm()}
                    disabled={submitting}>
                    Submit
                </BluePrimaryButton>
            </Box>
        </Box>
    )
}