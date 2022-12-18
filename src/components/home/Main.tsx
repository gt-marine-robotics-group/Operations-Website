import { Box, Container, Typography } from "@mui/material";
import Link from "next/link";
import { useMemo } from "react";
import { Cookie_User } from "../../database/interfaces/User";
import { PrimaryLink } from "../misc/links";

interface Props {
    user: Cookie_User;
}

export default function Main({user}:Props) {

    const username = useMemo(() => {
        return user.email.substring(0, user.email.indexOf('@'))
    }, [])

    const options = useMemo(() => {
        const opts = ['Inventory', 'Bills']
        if (user.roles.includes('President') 
            || user.roles.includes('Operations Officer')) {
            opts.push('Administration')
        }
        return opts
    }, [])

    return (
        <Container maxWidth="md">
            <Box mt={3} textAlign="center">
                <Box mb={1}>
                    <Typography variant="h4">
                        Welcome, {username} 
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="h6">
                        {user.roles.join(', ')}
                    </Typography>
                </Box>
            </Box>
            <Box mt={3} textAlign="center">
                {options.map(option => (
                    <Box key={option} mb={1}>
                        <PrimaryLink href={`/${option.toLowerCase()}`} variant="h5">
                            {option}
                        </PrimaryLink>
                    </Box>
                ))}
            </Box>
        </Container>
    )
}