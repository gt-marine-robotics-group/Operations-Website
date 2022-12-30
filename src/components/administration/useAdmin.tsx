import { useEffect, useState } from "react";
import { Cookie_User, C_User } from "../../database/interfaces/User";
import axios from 'axios'
import { C_Ref } from "../../database/interfaces/fauna";

interface UserResponseData {
    after?: [C_Ref];
    data: (C_User|null)[];
}

interface InitialUserData {
    projects: {
        data: [string, string][];
    };
    users: UserResponseData;
}

export default function useAdmin(localUser:Cookie_User) {

    const [projects, setProjects] = useState<{id:string,name:string}[]>([])
    const [users, setUsers] = useState([localUser])
    const [moreToLoad, setMoreToLoad] = useState(false)
    const [loading, setLoading] = useState(false)

    const loadInitialUsers = async () => {

        try {
            const sessionUsers = sessionStorage.getItem('users')
            const parsedSessionUsers:Cookie_User[] = JSON.parse(sessionUsers as string)

            const sessionProjects = sessionStorage.getItem('projectIdAndNames')
            const parsedSessionProjects = JSON.parse(sessionProjects as string)

            if (!sessionUsers || !sessionProjects) {
                throw new Error('Cannot use session storage')
            }
            
            const noMoreToLoad = sessionStorage.getItem('noMoreUsersToLoad')

            console.log('using session storage')
            setUsers(parsedSessionUsers)
            setProjects(parsedSessionProjects)
            setMoreToLoad(!noMoreToLoad)
            setLoading(false)
            return
        } catch (e) {}

        try {

            const {data} = await axios.get<InitialUserData>('/api/administration/user', {
                params: {
                    userId: localUser.id,
                }
            })

            const resProjects = data.projects.data.map(project => (
                {id: project[0], name: project[1]}
            ))

            const resUsers:Cookie_User[] = data.users.data.map(user => {
                if (!user)  {
                    return localUser
                }
                return {
                    id: user.ref['@ref'].id,
                    email: user.data.email,
                    roles: user.data.roles
                }
            })

            try {
                sessionStorage.setItem('users', JSON.stringify(resUsers))
                sessionStorage.setItem('projectIdAndNames', JSON.stringify(resProjects))
                if (!data.users.after) {
                    sessionStorage.setItem('noMoreUsersToLoad', 'true')
                }
            } catch (e) {}

            setUsers(resUsers)
            setProjects(resProjects)
            setMoreToLoad(!data.users.after)
            setLoading(false)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        loadInitialUsers()
    }, [])

    console.log('users', users)

    return {users, projects, moreToLoad, loading}
}