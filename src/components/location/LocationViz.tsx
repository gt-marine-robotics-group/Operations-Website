import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { C_Location } from "../../database/interfaces/Location";
import { drawBg } from "./LocationVizHelpers";

interface Props {
    locations?: C_Location[];
    showing?: Set<string>;
    drawingEnabled?: boolean;
}

export default function LocationViz({locations, showing, 
    drawingEnabled}:Props) {

    const ref = useRef<HTMLCanvasElement>(null)

    const squareHovering = useState({x: -1, y: -1})

    const draw = () => {
        if (!ref || !ref.current) return
        drawBg(ref.current.getContext('2d') as CanvasRenderingContext2D)
    }

    useEffect(() => {
        draw()
    }, [])

    return (
        <Box>
            <canvas ref={ref} width={800} height={800} />
        </Box>
    )
}