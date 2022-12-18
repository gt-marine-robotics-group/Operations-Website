import { Box } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from 'axios'

interface Props {
    setSelected: Dispatch<SetStateAction<string>>;
    initialSelected: string;
}

export default function CategorySelect({setSelected, initialSelected}:Props) {

    const [bank, setBank] = useState([])

    useEffect(() => {
        const loadInitialData = async () => {
            try {

                const {data} = await axios.get('/api/inventory/category', {
                    params: {
                        parent: '/',
                        initialSelected,
                        mode: 'categorySelect'
                    },
                    retry: 0
                })

                console.log(data)

            } catch (e) {
                console.log(e)
            }
        }
        loadInitialData()
    }, [])

    return (
        <Box>

        </Box>
    )
}