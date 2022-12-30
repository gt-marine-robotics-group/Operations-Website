import React from 'react'
import { Box, Paper, Typography } from "@mui/material";
import { useMemo } from "react";
import { Leadership } from "./Main";
import { BlueSecondaryButton } from '../misc/buttons'

interface Props {
    leadership: Leadership;
}

const categories:('Executive Officers'|'Technical Leads' | 'Project Leads')[]
    = ['Executive Officers', 'Technical Leads', 'Project Leads']

export default function LeadershipDisplay({leadership}:Props) {

    const {rows, columns} = useMemo(() => {
        const cols = 3
        const projectRows = Object.keys(leadership['Project Leads']).length + 1
        if (projectRows > 3) {
            return {rows: projectRows + 1, columns: cols}
        }
        return {rows: 4, columns: cols}
    }, [leadership])

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
                                    <Box key={officer} gridRow={j + 2} gridColumn={i + 1}
                                        sx={{cursor: 'default'}}>
                                        <Typography variant="body1">
                                            <b>{officer}</b> {(leadership[category] as any)[officer]?.email.split('@')[0] || 'None'}
                                        </Typography>
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