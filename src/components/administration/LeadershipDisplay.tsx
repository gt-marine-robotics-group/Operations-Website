import React, { useState } from 'react'
import { Box, Paper, Typography } from "@mui/material";
import { useMemo } from "react";
import { Leadership } from "./Main";
import { BluePrimaryIconButton, BlueSecondaryButton, RedPrimaryIconButton } from '../misc/buttons'
import EditIcon from '@mui/icons-material/Edit'
import RemoveIcon from '@mui/icons-material/Remove';

interface Props {
    leadership: Leadership;
    projects: {id:string; name:string;}[];
}

const categories:('Executive Officers'|'Technical Leads' | 'Project Leads')[]
    = ['Executive Officers', 'Technical Leads', 'Project Leads']

export default function LeadershipDisplay({leadership, projects}:Props) {

    const {rows, columns} = useMemo(() => {
        const cols = 3
        const projectRows = Object.keys(leadership['Project Leads']).length + 1
        if (projectRows > 3) {
            return {rows: projectRows + 1, columns: cols}
        }
        return {rows: 4, columns: cols}
    }, [leadership])

    const [showEdits, setShowEdits] = useState<boolean[][]>([])

    useMemo(() => {
        const edits = Array(rows - 1).fill(Array(columns).fill(false))
        setShowEdits(edits)
    }, [leadership])

    const toggleEdit = (row:number, col:number) => {
        const edits:boolean[][] = []
        for (let i = 0; i < rows - 1; i++) {
            const arr:boolean[] = []
            for (let j = 0; j < columns; j++) {
                arr.push(false)
            }
            edits.push(arr)
        }
        edits[row][col] = !showEdits[row][col]
        setShowEdits(edits)
    }

    console.log('showEdits', showEdits)

    return (
        <Box>
            <Paper elevation={3}>
                <Box display="grid" gridTemplateColumns={`repeat(${columns}, 1fr)`}
                    gridTemplateRows={`repeat(${rows - 1}, 1fr) auto`} p={3}>
                    <>
                        {categories.map((category, i) => (
                            <React.Fragment key={category}>
                                <Box gridRow={1} gridColumn={i + 1} mb={2}>
                                    <Typography variant="h5">
                                        {category}
                                    </Typography>
                                </Box>
                                {Object.keys(leadership[category]).map((officer, j) => (
                                    <Box key={officer} gridRow={j + 2} gridColumn={i + 1}>
                                        <Box sx={{cursor: 'default'}} position="relative"
                                        minHeight={40} display="flex" alignItems="center"
                                        onMouseEnter={() => toggleEdit(j, i)}
                                        onMouseLeave={() => toggleEdit(j, i)}>
                                            <Typography variant="body1">
                                                <b>{officer}</b> {(leadership[category] as any)[officer]?.email.split('@')[0] || 'None'}
                                            </Typography>
                                            <Box position="absolute" 
                                                right={category === 'Project Leads' ? 
                                                    40 : 0} 
                                                top="50%"
                                                sx={{transform: 'translateY(-50%)'}}
                                                display={(showEdits[j] || [])[i] ? 'initial' : 'none'}>
                                                <BluePrimaryIconButton >
                                                    <EditIcon /> 
                                                </BluePrimaryIconButton>
                                            </Box>
                                            {category === 'Project Leads' && <Box
                                                position="absolute" right={0} top="50%"
                                                sx={{transform: 'translateY(-50%)'}}
                                                display={(showEdits[j] || [])[i] ? 
                                                'initial' : 'none'}>
                                                <RedPrimaryIconButton>
                                                    <RemoveIcon />     
                                                </RedPrimaryIconButton> 
                                            </Box>}
                                        </Box>
                                    </Box>
                                ))}
                            </React.Fragment>
                        ))}
                        <Box gridRow={rows} gridColumn={columns}>
                            <BlueSecondaryButton>
                                Add Project
                            </BlueSecondaryButton>
                        </Box>
                    </>
                </Box>
            </Paper>
        </Box>
    )
}