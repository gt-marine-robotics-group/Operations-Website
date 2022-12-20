import { Alert, Box, FormGroup, Grid } from "@mui/material";
import { useRef, useState } from "react";
import { Formik, FormikHelpers, Form, FormikProps } from 'formik'
import FormikTextField from "../../formik/TextField";
import * as yup from 'yup'
import { C_Category } from "../../../database/interfaces/Category";
import CategorySelect, { CategoryMap } from "./CategorySelect";
import axios from 'axios'
import Router from 'next/router'
import { BluePrimaryButton, BluePrimaryOutlinedButton, BlueSecondaryButton } from "../../misc/buttons";
import { C_Ref } from "../../../database/interfaces/fauna";

class Props {
    initialCategory?: C_Category;
}

interface FormVals {
    name: string;
}

export default function CategoryForm({initialCategory}:Props) {

    const [parentCategory, setParentCategory] = 
        useState<string>(!initialCategory ? '/' : 
            typeof(initialCategory.data.parent) === 'string' ? 
            initialCategory.data.parent : 
            initialCategory.data.parent['@ref'].id)
    const [categoryBank, setCategoryBank] = useState<CategoryMap>({'/': {
        name: '',
        children: []
    }})

    const updateCategoryMap = (vals:CategoryMap) => setCategoryBank(vals)
    
    const [submitting, setSubmitting] = useState(false)
    const formRef = useRef<FormikProps<FormVals>>(null)

    const [alertErrorMsg, setAlertErrorMsg] = useState('')

    const onSubmit = async (values:FormVals, 
        actions:FormikHelpers<FormVals>) => {
        setSubmitting(true)
        try {
            const search = values.name.split(' ').filter(v => v).map(v => v.toLowerCase())
            if (!initialCategory) {
                await axios({
                    method: 'POST',
                    url: '/api/inventory/category/create',
                    data: {data: {
                        name: values.name,
                        parent: parentCategory,
                        children: [],
                        parts: [],
                        search,
                    }, 
                    parentChildren: categoryBank[parentCategory].children
                }
                })
            } else {
                await axios({
                    method: 'POST',
                    url: `/api/inventory/category/${initialCategory.ref['@ref'].id}/update`,
                    data: {data: {
                        name: values.name,
                        parent: parentCategory,
                        search
                    },
                    parentChildren: categoryBank[parentCategory].children,
                    prevParentId: typeof(initialCategory.data.parent) === 'string' ?
                        initialCategory.data.parent : 
                        initialCategory.data.parent['@ref'].id
                }
                })
            }

            Router.push({
                pathname: '/inventory',
                query: {
                    categoryChange: initialCategory ? 'update' : 'add'
                }
            }) 
        } catch (e) {
            console.log(e)
            setSubmitting(false)
        }
    }

    const deleteCategory = async () => {
        if (!initialCategory) return
        if (initialCategory.data.children.length > 0) {
            setAlertErrorMsg('Cannot delete: contains child categories')
            return
        }
        if (initialCategory.data.parts.length > 0) {
            setAlertErrorMsg('Cannot delete: contains parts')
            return
        }
        setSubmitting(true)
        try {
            await axios({
                method: 'POST',
                url: `/api/inventory/category/${initialCategory.ref['@ref'].id}/delete`,
                data: {
                    parentCategoryId: typeof(initialCategory.data.parent) === 'string' ?
                        initialCategory.data.parent : 
                        initialCategory.data.parent['@ref'].id
                }
            })

            Router.push({
                pathname: '/inventory',
                query: {
                    categoryChange: 'delete'
                }
            })
        } catch (e) {
            console.log(e)
            setSubmitting(false)
        }
    }

    return (
        <Box>
            {alertErrorMsg && 
                <Alert severity="error" onClose={() => setAlertErrorMsg('')}>
                    {alertErrorMsg}
                </Alert>
            }
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
                        blacklistCategoryId={initialCategory?.ref['@ref'].id}
                        text="Parent Category" />
                </FormGroup>
            </Box>
            <Box mt={5}>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item>
                        <Box width={150}>
                            <BluePrimaryButton fullWidth onClick={() => formRef.current?.submitForm()}
                                disabled={submitting}>
                                {initialCategory ? 'Update' : 'Create'}
                            </BluePrimaryButton>
                        </Box>
                    </Grid>
                    {initialCategory && <Grid item>
                        <Box width={150} >
                            <BluePrimaryOutlinedButton fullWidth disabled={submitting}
                                onClick={() => deleteCategory()}>
                                Delete
                            </BluePrimaryOutlinedButton>
                        </Box>
                    </Grid>}
                </Grid>
            </Box>
        </Box>
    )
}