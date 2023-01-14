import { useEffect, useState } from "react"
import { C_Location } from "../../database/interfaces/Location"

export default function useLocations() {

    const [locations, setLocations] = useState<C_Location[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        try {

            const sessionLocations = sessionStorage.getItem('locations')

            if (sessionLocations) {
                setLocations(JSON.parse(sessionLocations))
            }
        } catch (e) {}
    }, [])

    const loadCategory = async (name:string) => {
        setLoading(true)
    }

    return {
        locations,
        loading,
        loadCategory
    }
}