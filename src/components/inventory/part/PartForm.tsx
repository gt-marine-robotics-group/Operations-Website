import { useEffect, useMemo, useRef, useState } from "react";
import { C_Part } from "../../../database/interfaces/Part";
import { FormikProps, FormikHelpers, Formik, Form } from 'formik'
import { Box, FormGroup } from "@mui/material";
import * as yup from 'yup'
import FormikTextField from "../../formik/TextField";
import axios from 'axios'

interface Props {
    initialPart?: C_Part;
    projects: {
        id: string;
        name: string;
    }[];
}

interface FormVals {
    name: string;
    available: number;
    projects: {
        [name:string]: number;
    };
    img: string;
    units: string;
    note: string;
}

export default function PartForm({initialPart}:Props) {

    const [initialValues, setInitialValues] = useState(() => {
        const values:FormVals = {
            name: '', available: 0, projects: {}, img: '', units: '', note: ''
        }
        if (initialPart) {
            values.name = initialPart.data.name
        }
        return values
    })

    const [projects, setProjects] = useState<{id:string,name:string}[]>([])

    useMemo(() => {
        if (projects.length === 0) return

        const formProjects:FormVals['projects'] = {}
        for (const project of projects) {
            formProjects[project.id] = 0
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
        setSubmitting(true)
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
                {() => (
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
                    </Form>
                )}
            </Formik>
        </Box>
    )
}