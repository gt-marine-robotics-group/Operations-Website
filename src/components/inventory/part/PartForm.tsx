import { useMemo, useRef, useState } from "react";
import { C_Part } from "../../../database/interfaces/Part";
import { FormikProps, FormikHelpers, Formik, Form } from 'formik'
import { Box, FormGroup } from "@mui/material";
import * as yup from 'yup'
import FormikTextField from "../../formik/TextField";

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

export default function PartForm({initialPart, projects}:Props) {

    const initialValues = useMemo(() => {
        const values:FormVals = {
            name: '', available: 0, projects: {}, img: '', units: '', note: ''
        }
        if (initialPart) {
            values.name = initialPart.data.name
        }
        for (const project of projects) {
            values.projects[project.id] = 0
        }
        return values
    }, [initialPart])

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

    return (
        <Box>
            <Formik innerRef={formRef} validationSchema={yup.object({
                name: yup.string().required('Please enter a name.'),
                available: yup.number().moreThan(-1)
            })} initialValues={initialValues} 
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