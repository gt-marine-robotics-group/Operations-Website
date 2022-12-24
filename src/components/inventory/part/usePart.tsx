import { useEffect, useState } from "react";
import { C_Part, PartData } from "../../../database/interfaces/Part";
import axios from 'axios'
import { useRouter } from 'next/router'
import { PartBank } from "../useInventory";

interface PopulatedPart extends PartData {
    category: string;
}

interface PopulatedPartBank {
    [id:string]: PopulatedPart | PartBank[string];
}

export default function usePart() {

    const router = useRouter()

    const [part, setPart] = useState<PopulatedPart|null>(null)
    const [partName, setPartName] = useState('')

    useEffect(() => {
        const id = router.query.id
        if (!(typeof(id) === 'string')) return

        const loadPartInfo = async (parsedData?:PopulatedPartBank) => {
            try {
                const {data} = await axios.get(`/api/inventory/part/${id}`, {
                    retry: 3
                })
                console.log('data', data)

                const partData = {
                    ...data.data,
                    category: typeof(data.data.category) === 'string' ? 
                        data.data.category :
                        data.data.category['@ref'].id
                }

                if (parsedData) {
                    sessionStorage.setItem('partData', JSON.stringify({
                        ...parsedData,
                        [data.ref['@ref'].id]: partData
                    }))
                } else {
                    sessionStorage.setItem('partData', JSON.stringify({
                        [data.ref['@ref'].id]: partData
                    }))
                }

                if (!partName) {
                    setPartName(partData.name)
                }
                setPart(partData)
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
                loadPartInfo(parsedData)
                return
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