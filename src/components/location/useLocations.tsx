import { useState } from "react"
import { C_Location } from "../../database/interfaces/Location"

export default function useLocations() {

    const [locations, setLocations] = useState<C_Location[]>([])

    return {
        locations
    }
}