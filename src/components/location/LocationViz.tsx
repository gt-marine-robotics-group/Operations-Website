import { Box } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { C_Location } from "../../database/interfaces/Location";
import { drawBg, drawLocations } from "./LocationVizHelpers";

interface Props {
    locations: {[name:string]: C_Location[]};
    viewingLocations: Set<string>;
    drawingEnabled?: boolean;
    editing?: boolean;
    selectedSquares?: [number, number][];
    setSelectedSquares?: Dispatch<SetStateAction<[number, number][]>>;
}

export default function LocationViz({locations, viewingLocations,
    drawingEnabled, editing, selectedSquares, setSelectedSquares}:Props) {

    const [displayLocs, setDisplayLocs] = useState<C_Location[]>([])

    useMemo(() => {
        const locs:C_Location[] = []

        Object.keys(locations).forEach(locCategory => {
            locations[locCategory].forEach(loc => {
                if (viewingLocations.has(loc.ref['@ref'].id)) {
                    locs.push(loc)
                }
            })
        })

        setDisplayLocs(locs)
    }, [viewingLocations])

    const ref = useRef<HTMLCanvasElement>(null)

    const draw = () => {
        if (!ref || !ref.current) return
        drawBg(ref.current.getContext('2d') as CanvasRenderingContext2D)
        drawLocations(ref.current.getContext('2d') as CanvasRenderingContext2D, 
            displayLocs)
    }

    useEffect(() => {
        draw()
    }, [viewingLocations])

    return (
        <Box>
            <canvas ref={ref} width={800} height={800} />
        </Box>
    )
}