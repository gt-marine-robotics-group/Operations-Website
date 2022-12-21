import { useEffect, useMemo, useRef, useState } from "react";
import { C_Part } from "../../../database/interfaces/Part";
import { FormikProps, FormikHelpers, Formik, Form } from 'formik'
import { Box, FormGroup, Skeleton, Autocomplete, TextField, Grid } from "@mui/material";
import * as yup from 'yup'
import FormikTextField from "../../formik/TextField";
import axios from 'axios'
import { FormatAlignCenter } from "@mui/icons-material";
import CategorySelect from "../category/CategorySelect";
import { BluePrimaryButton, BluePrimaryOutlinedButton } from "../../misc/buttons";
import Router from 'next/router'
import { C_Ref } from "../../../database/interfaces/fauna";

interface Props {
    initialPart?: C_Part;
    initialCategoryParts?: C_Ref[];
}

interface FormVals {
    name: string;
    available: number;
    onTheWay: number;
    projects: {
        [name:string]: number;
    };
    img: string;
    units: string;
    note: string;
}

export default function PartForm({initialPart, initialCategoryParts}:Props) {

    const [initialValues, setInitialValues] = useState(() => {
        const values:FormVals = {
            name: '', available: 0, onTheWay: 0, 
            projects: {}, img: '', units: '', note: ''
        }
        if (initialPart) {
            values.name = initialPart.data.name
            values.available = initialPart.data.available
            values.onTheWay = initialPart.data.onTheWay
            values.img = initialPart.data.img
            values.note = initialPart.data.note
        }
        return values
    })

    const [projects, setProjects] = useState<{id:string,name:string}[]>([])

    useMemo(() => {
        if (projects.length === 0) return

        const formProjects:FormVals['projects'] = {}
        for (const project of projects) {
            if (project.id in (initialPart?.data.projects || {})) {
                formProjects[project.id] = initialPart?.data.projects[project.id] as number
            } else {
                formProjects[project.id] = 0
            }
        }
        setInitialValues({...initialValues, projects: formProjects})
    }, [projects])

    useEffect(() => {
        const loadInitialProjects = async () => {

            try {
                const {data} = await axios.get('/api/project', {retry: 3})
            
                const formattedData = data.map((d:[string,string]) => ({id: d[0], name: d[1]}))

                try {
                    sessionStorage.setItem('projectIdAndNames', JSON.stringify(formattedData))
                } catch (e) {}
                setProjects(formattedData)
            } catch (e) {
                console.log(e)
            }
        }
        try {
            const data = sessionStorage.getItem('projectIdAndNames')
            if (data) {
                const parsedData = JSON.parse(data)
                setProjects(parsedData)
                return
            }
        } catch (e) {
            console.log(e)
        }
        loadInitialProjects()
    }, [])

    const [category, setCategory] = 
        useState(!initialPart ? '/' : 
        typeof(initialPart.data.category) === 'string' ? 
        initialPart.data.category : 
        initialPart.data.category['@ref'].id)
    
    const [submitting, setSubmitting] = useState(false)
    const formRef = useRef<FormikProps<FormVals>>(null)

    const onSubmit = async (values:FormVals, 
        actions:FormikHelpers<FormVals>) => {
        console.log(values)
        console.log(category)
        setSubmitting(true)
        try {
            const search = values.name.split(' ').filter(v => v).map(v => v.toLowerCase())
            let id = initialPart?.ref['@ref'].id
            if (!initialPart) {
                const {data} = await axios({
                    method: 'POST',
                    url: '/api/inventory/part/create',
                    data: {data: {
                        ...values,
                        search,
                        category
                    }}
                })
                id = data.ref['@ref'].id
                // TODO: Update the 'partData' in sessionStorage with 
                // Part returned from API call
            }

            Router.push({
                pathname: `/inventory/part/${id}`
            })
        } catch (e) {
            console.log(e)
            setSubmitting(false)
        }
    }

    const deletePart = async () => {

    }

    console.log('projects', projects)
    console.log('initial vals', initialValues)

    return (
        <Box>
            <Formik innerRef={formRef} validationSchema={yup.object({
                name: yup.string().required('Please enter a name.'),
                available: yup.number().moreThan(-1)
            })} initialValues={initialValues} enableReinitialize
            onSubmit={(values, actions) => onSubmit(values, actions)}>
                {(actions) => (
                    <Form>
                        <Box my={3}>
                            <FormGroup>
                                <FormikTextField name="name" label="Name" />
                            </FormGroup>
                        </Box>
                        <Box my={3}>
                            <FormGroup>
                                <FormikTextField name="available" 
                                    label="Amount Available" type="number" />
                            </FormGroup>
                        </Box>
                        <Box my={3}>
                            <FormGroup>
                                <FormikTextField name="onTheWay" 
                                    label="Amount on the Way" type="number" />
                            </FormGroup>
                        </Box>
                        {Object.keys(actions.values.projects).length === 0 ? 
                        Array(3).fill(null).map((_, i) => (
                            <Box my={3} key={i}>
                                <Skeleton variant="rounded" height={50} />
                            </Box>
                        )) : projects.map(p => (
                            <Box key={p.id} my={3}>
                                <FormGroup>
                                    <FormikTextField name={`projects.${p.id}`} 
                                        label={`${p.name} In Use`} type="number" />
                                </FormGroup>
                            </Box>
                        ))}
                        <Box my={3}>
                            <FormGroup>
                                <Autocomplete freeSolo id="autocomplete-units"
                                    options={['m.', 'cm.', 'mm.', 'ft.', 'in.']}
                                    onChange={(e, val) => actions.setFieldValue('units', val)}
                                    renderInput={(params) => <TextField {...params} 
                                    label="Units" 
                                    InputLabelProps={{sx: {color: '#535040'}}} />} 
                                />
                            </FormGroup>
                        </Box>
                        <Box my={3}>
                            <FormGroup>
                                <FormikTextField name="img" label="Image Link" />
                            </FormGroup>
                        </Box>
                        <Box my={3}>
                            <FormGroup>
                                <FormikTextField name="note" label="Note" 
                                multiline rows={3} />
                            </FormGroup>
                        </Box>
                    </Form>
                )}
            </Formik>
            <Box my={3}>
                <FormGroup>
                    <CategorySelect selected={category} setSelected={setCategory}
                        text="Category" />
                </FormGroup>
            </Box>
            <Box mt={5}>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item>
                        <Box width={150}>
                            <BluePrimaryButton fullWidth onClick={() => formRef.current?.submitForm()}
                                disabled={submitting}>
                                {initialPart ? 'Update' : 'Create'}
                            </BluePrimaryButton>
                        </Box>
                    </Grid>
                    {initialPart && <Grid item>
                        <Box width={150} >
                            <BluePrimaryOutlinedButton fullWidth disabled={submitting}
                                onClick={() => deletePart()}>
                                Delete
                            </BluePrimaryOutlinedButton>
                        </Box>
                    </Grid>}
                </Grid>
            </Box>
        </Box>
    )
}