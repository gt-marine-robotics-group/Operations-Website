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
    const [users, setUsers] = useState<Cookie_User[]>([])
    const [afterId, setAfterId] = useState('')
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
            const afterId = sessionStorage.getItem('userAfterId')

            console.log('using session storage')
            setAfterId(afterId || '')
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
                } else {
                    sessionStorage.setItem('userAfterId', data.users.after[0]['@ref'].id)
                }
            } catch (e) {}

            console.log(data.users.after)
            if (data.users.after) {
                setAfterId(data.users.after[0]["@ref"].id)
            }
            setUsers(resUsers)
            setProjects(resProjects)
            setMoreToLoad(Boolean(data.users.after))
            setLoading(false)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        loadInitialUsers()
    }, [])

    const updateUserRoles = async (role:string, newUsername:string, 
        prevUserId:string) => {

        const newUserEmail = newUsername ? newUsername + '@gatech.edu' : ''

        let prevUserUpdatedRoles:string[]|undefined = undefined
        let prevUserIndex:number|undefined = undefined

        let newUserId:string|undefined = undefined
        let newUserUpdatedRoles:string[]|undefined = undefined
        let newUserIndex:number|undefined = undefined

        users.forEach((user, i) => {
            if (user.id === prevUserId) {
                prevUserIndex = i
                prevUserUpdatedRoles = user.roles.filter(r => r !== role)
            } else if (user.email === newUserEmail) {
                newUserIndex = i
                newUserId = user.id
                newUserUpdatedRoles = [...user.roles, role]
            }
        })

        if (prevUserId && !prevUserUpdatedRoles) {
            throw new Error('Internal Client Error')
        }

        try {

            const {data} = await axios<C_User|null>({
                method: 'POST',
                url: '/api/administration/user/update-role',
                data: {
                    role, prevUserId, prevUserUpdatedRoles,
                    newUserEmail, newUserId, newUserUpdatedRoles
                }
            })

            const usersCopy = [...users]
            if (prevUserIndex) {
                usersCopy[prevUserIndex] = {
                    ...usersCopy[prevUserIndex],
                    roles: prevUserUpdatedRoles as unknown as string[]
                }
            }
            if (newUserIndex) {
                usersCopy[newUserIndex] = {
                    ...usersCopy[newUserIndex],
                    roles: newUserUpdatedRoles as unknown as string[]
                }
            } else if (data && newUsername) {
                usersCopy.push({
                    id: data.ref['@ref'].id,
                    email: data.data.email,
                    roles: data.data.roles
                })
            }
            try {
                sessionStorage.setItem('users', JSON.stringify(usersCopy))
            } catch (e) {
                if (typeof(sessionStorage) !== 'undefined') {
                    sessionStorage.setItem('users', '')
                }
            }

            setUsers(usersCopy)

            return data
        } catch (e) {
            console.log(e)
            throw new Error('Internal Server Error')
        }
    }

    const loadMoreUsers = async () => {
        if (loading) return

        setLoading(true)

        try {

            const {data} = await axios.get<UserResponseData>('/api/administration/user', {
                params: {
                    after: afterId
                }
            })

            const resUsers:Cookie_User[] = [...users, ...data.data.map(user => {
                if (!user)  {
                    return localUser
                }
                return {
                    id: user.ref['@ref'].id,
                    email: user.data.email,
                    roles: user.data.roles
                }
            })]

            try {
                sessionStorage.setItem('users', JSON.stringify(resUsers))
                if (!data.after) {
                    sessionStorage.setItem('noMoreUsersToLoad', 'true')
                    sessionStorage.setItem('userAfterId', '')
                } else {
                    sessionStorage.setItem('userAfterId', data.after[0]['@ref'].id)
                }
            } catch (e) {}

            if (data.after) {
                setAfterId(data.after[0]["@ref"].id)
            }
            setUsers(resUsers)
            setMoreToLoad(Boolean(data.after))
            setLoading(false)
        } catch (e) {
            console.log(e)
        }
    }

    console.log('users', users)

    return {users, projects, moreToLoad, loading, updateUserRoles,
        loadMoreUsers}
}