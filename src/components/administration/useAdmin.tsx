import { useEffect, useState } from "react";
import { Cookie_User } from "../../database/interfaces/User";
import axios from 'axios'

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

            const {data} = await axios.get('/api/administration/user', {
                params: {
                    userId: localUser.id,
                }
            })

            console.log('data', data)

        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        loadInitialUsers()
    }, [])

    return {users, projects, moreToLoad, loading}
}