import client from '../fauna'
import {query as q} from 'faunadb'
import { S_User, S_UserData} from '../interfaces/User'

function existsUserWithEmailInnerQuery(email:string) {
    
    return q.Exists(q.Match(q.Index('users_by_email'), email))
}

interface CreateUserData extends Omit<S_UserData, 'roles'> {}

export async function createUser(data:CreateUserData) {

    return await client.query(
        q.If(
            existsUserWithEmailInnerQuery(data.email),
            null,
            q.Create(q.Collection('users'), {data: {...data, roles: []}})
        )
    ) as S_User
}

export async function getUserFromEmail(email:string) {

    return await client.query(
        q.If(
            existsUserWithEmailInnerQuery(email),
            q.Get(q.Match(q.Index('users_by_email'), email)),
            null
        )
    ) as S_User
}