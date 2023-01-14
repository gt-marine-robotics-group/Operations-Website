import { useEffect, useState } from "react"
import { C_Location } from "../../database/interfaces/Location"
import axios from 'axios'

export default function useLocations() {

    const [categoryLocs, setCategoryLocs] = useState<{[name:string]: C_Location[]}>({})

    const [viewingLocations, setViewingLocations] = useState(new Set<string>())

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        try {

            const sessionLocations = sessionStorage.getItem('locations')

            if (sessionLocations) {
                const parsedSessionLocation = JSON.parse(sessionLocations)
                setCategoryLocs(parsedSessionLocation)
            }
        } catch (e) {}
    }, [])
    
    const loadCategory = async (name:string, show?:boolean) => {
        if (Object.keys(categoryLocs).includes(name)) {
            show && setViewingLocations(new Set([
                ...Array.from(viewingLocations),
                ...categoryLocs[name].map(d => d.ref['@ref'].id)
            ]))
            return
        }

        setLoading(true)

        const {data} = await axios.get<C_Location[]>(`/api/location/type/${name}`)

        setCategoryLocs({...categoryLocs, 
            [name]: data
        })
        if (show) {
            setViewingLocations(new Set([
                ...Array.from(viewingLocations),
                ...data.map(d => d.ref['@ref'].id)
            ]))
        }
        setLoading(false)
    }

    console.log('categoryLocs', categoryLocs)

    return {
        loading,
        loadCategory,
        locations: categoryLocs
    }
}