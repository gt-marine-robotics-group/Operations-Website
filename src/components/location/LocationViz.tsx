import { Box } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { C_Location } from "../../database/interfaces/Location";
import { drawBg } from "./LocationVizHelpers";

interface Props {
    locations: C_Location[];
    drawingEnabled?: boolean;
    editing?: string;
    selectedSquares?: [number, number][];
    setSelectedSquares?: Dispatch<SetStateAction<[number, number][]>>;
}

export default function LocationViz({locations, 
    drawingEnabled, editing, selectedSquares, setSelectedSquares}:Props) {

    const ref = useRef<HTMLCanvasElement>(null)

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