import { Box, CircularProgress, Container } from "@mui/material";
import { useMemo, useState } from "react";
import { Cookie_User } from "../../database/interfaces/User";
import LeadershipDisplay from "./LeadershipDisplay";
import TeamDisplay from "./TeamDisplay";
import useUsers from "./useUsers";

interface Props {
    user: Cookie_User;
}

export interface Leadership {
    'Executive Officers': {
        President: Cookie_User | null;
        'Operations Officer': Cookie_User | null;
        Treasurer: Cookie_User | null;
    };
    'Technical Leads': {
        Electrical : Cookie_User | null;
        Mechanical: Cookie_User | null;
        Software: Cookie_User | null;
    };
    'Project Leads': {[name:string]: Cookie_User | null};
}

export default function Main({user}:Props) {

    const [leadership, setLeadership] = useState<Leadership>({
        'Executive Officers': {
            President: null,
            'Operations Officer': null,
            Treasurer: null
        },
        'Technical Leads': {
            Electrical: null,
            Mechanical: null,
            Software: null
        },
        'Project Leads': {}
    })

    const {users, projects, moreToLoad, loading, updateUserRoles,
        loadMoreUsers, searchForUser, deleteUser} = useUsers(user) 

    useMemo(() => {
        if (users.length === 0) return
        if (Object.keys(leadership['Project Leads']).length > 0) return

        const leadershipCopy = {...leadership}
        users.forEach(user => {
            if (user.roles.length === 0) return
            user.roles.forEach(role => {
                if (role === 'President') {
                    leadershipCopy['Executive Officers'].President = user
                } else if (role === 'Operations Officer') {
                    leadershipCopy['Executive Officers']['Operations Officer'] = user
                } else if (role === 'Treasurer') {
                    leadershipCopy['Executive Officers'].Treasurer = user
                } else if (role.includes('Technical Lead')) {
                    leadershipCopy['Technical Leads']
                        [role.split(' ')[0] as 'Electrical'|'Software'|'Mechanical']
                         = user
                } else if (role.includes('Project Lead')) {
                    leadershipCopy['Project Leads'][role.split(' ')[0]] = user
                }
            })
        })
        projects.forEach(project => {
            if (!(project.name in leadershipCopy['Project Leads'])) {
                leadershipCopy['Project Leads'][project.name] = null
            }
        })

        setLeadership(leadershipCopy)
    }, [users])

    console.log('leadership', leadership)

    return (
        <Box mt={3}>
            <Container maxWidth="lg">
                {users.length === 0 ? <Box textAlign="center">
                    <CircularProgress />
                </Box> : <Box>
                    <Box>
                        <LeadershipDisplay leadership={leadership}
                            setLeadership={setLeadership}
                            updateUserRoles={updateUserRoles} />
                    </Box>
                    <Box mt={3}>
                        <TeamDisplay users={users} loading={loading}
                            moreToLoad={moreToLoad} loadMoreUsers={loadMoreUsers}
                            searchForUser={searchForUser}
                            deleteUser={deleteUser} />
                    </Box>
                </Box>}
            </Container>
        </Box>
    )
}