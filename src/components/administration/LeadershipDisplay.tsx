import React, { Dispatch, SetStateAction, useState } from 'react'
import { Box, Paper, Typography } from "@mui/material";
import { useMemo } from "react";
import { Leadership } from "./Main";
import { BluePrimaryIconButton, BlueSecondaryButton, RedPrimaryIconButton } from '../misc/buttons'
import EditIcon from '@mui/icons-material/Edit'
import RemoveIcon from '@mui/icons-material/Remove';
import UsernameDialog from './UsernameDialog';
import { Cookie_User, C_User } from '../../database/interfaces/User';

interface Props {
    leadership: Leadership;
    setLeadership: Dispatch<SetStateAction<Leadership>>;
    updateUserRoles: (role:string, newUsername:string, 
        prevUserId:string) => Promise<C_User|null>;
}

type Category = 'Executive Officers'| 'Technical Leads' | 'Project Leads'

const categories:Category[] = ['Executive Officers', 'Technical Leads', 'Project Leads']

export default function LeadershipDisplay({leadership, setLeadership, 
    updateUserRoles}:Props) {

    const {rows, columns} = useMemo(() => {
        const cols = 3
        const projectRows = Object.keys(leadership['Project Leads']).length + 1
        if (projectRows > 3) {
            return {rows: projectRows + 1, columns: cols}
        }
        return {rows: 4, columns: cols}
    }, [leadership])

    const [showEdits, setShowEdits] = useState<boolean[][]>([])

    const [roleChangeInfo, setRoleChangeInfo] = useState({
        path: ['', ''] as string[],
        title: '',
        error: ''
    })

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

    const editRole = (category:Category, officer:string) => {
        const title = category === 'Executive Officers' ? 
            officer :
            officer + ' ' + category.substring(0, category.length - 1)
        setRoleChangeInfo({
            path: [category, officer],
            title,
            error: ''
        })
    }

    const onEditSubmit = async (username:string) => {
        console.log('username', username)
        try {
            const user = await updateUserRoles(roleChangeInfo.title, username, 
                (leadership[roleChangeInfo.path[0] as Category] as any)[roleChangeInfo.path[1]]?.id)
            
            if (!user) {
                throw new Error('Username not found.')
            }
            
            setLeadership({...leadership, [roleChangeInfo.path[0]]: {
                ...leadership[roleChangeInfo.path[0] as Category],
                [roleChangeInfo.path[1]]: {
                    id: user.ref['@ref'].id,
                    email: user.data.email,
                    roles: user.data.roles
                }
            }})
            setRoleChangeInfo({...roleChangeInfo, title: ''})
        } catch (e) {
            console.log(e)
            if (e instanceof Error) {
                setRoleChangeInfo({...roleChangeInfo, error: e.message})
            }
        }
    }

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
                                                <BluePrimaryIconButton
                                                    onClick={() => editRole(category, officer)} >
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
            <UsernameDialog title={roleChangeInfo.title} 
                error={roleChangeInfo.error}
                open={Boolean(roleChangeInfo.title)} 
                defaultUsername={(leadership[roleChangeInfo.path[0] as Category] as any || {})[roleChangeInfo.path[1]]?.email.split('@')[0]}
                onSubmit={onEditSubmit}
                onClose={() => setRoleChangeInfo({...roleChangeInfo, title: ''})} />
        </Box>
    )
}