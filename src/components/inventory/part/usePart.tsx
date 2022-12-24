import { useEffect, useState } from "react";
import { C_Part } from "../../../database/interfaces/Part";
import axios from 'axios'
import { useRouter } from 'next/router'

export default function usePart() {

    const router = useRouter()

    const [part, setPart] = useState<C_Part|null>(null)
    const [partName, setPartName] = useState('')

    useEffect(() => {
        const id = router.query.id
        if (!(typeof(id) === 'string')) return

        const loadPartInfo = async () => {
            try {
                const {data} = await axios.get(`/api/inventory/part/${id}`, {
                    retry: 3
                })
                console.log('data', data)
            } catch (e) {
                console.log(e)
            }
        }
        try {
            const data = sessionStorage.getItem('partData') 
            if (data) {
                const parsedData = JSON.parse(data)
                if (id in parsedData) {
                    setPartName(parsedData[id].name)
                    if ('available' in parsedData[id]) {
                        setPart(parsedData[id])
                        return
                    }
                }
            }
        } catch (e) {
            console.log(e)
        }
        loadPartInfo()
    }, [router.query])

    console.log('part', part)
    console.log('partName', partName)

    return {
        part, partName
    }
}