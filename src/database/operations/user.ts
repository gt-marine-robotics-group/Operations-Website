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

export async function getInitialUserList(localUserId:string) {

    const roleTerms = ['President', 'Operations Officer', 'Treasurer',
        'Software Technical Lead', 'Electrical Technical Lead', 
        'Mechanical Technical Lead']

    return await client.query(
        q.Let(
            {
                projects: q.Paginate(q.Match(q.Index('all_projects_w_id_and_name')))
            },
            q.Let(
                {
                    userIds: q.Paginate(q.Union(
                        q.Match(
                            q.Index('users_by_roles'),
                            q.Append(
                                q.Map(q.Select('data', q.Var('projects')), q.Lambda(
                                    'project',
                                    q.Concat(
                                        [q.Select(1, q.Var('project')), "Project Lead"],
                                        " "
                                    )
                                )),
                                roleTerms
                            )
                        ),
                        q.Match(
                            q.Index('all_users')
                        )
                    ), {size: 15}),
                    projects: q.Var('projects')
                },
                {
                    projects: q.Var('projects'),
                    users: q.Map(q.Var('userIds'), q.Lambda(
                        'ref',
                        q.If(
                            q.Equals(q.Select('id', q.Var('ref')), localUserId),
                            null,
                            q.Get(q.Var('ref'))
                        )
                    ))
                }
            )
        )
    )
}

export async function moveRoleWithKnownUsers(prevUserId:string, 
    prevUserUpdatedRoles:string[], newUserId:string, 
    newUserUpdatedRoles:string[]) {

    return await client.query(
        q.Do(
            q.Update(
                q.Ref(q.Collection('users'), prevUserId), 
                {data: {roles: prevUserUpdatedRoles}}
            ),
            q.Update(
                q.Ref(q.Collection('users'), newUserId),
                {data: {roles: newUserUpdatedRoles}}
            )
        )
    ) as S_User
}

export async function moveRoleWithUnknownUser(role:string, prevUserId:string,
    prevUserUpdatedRoles:string[], newUserEmail:string) {
    
    return await client.query(
        q.If(
            q.Exists(q.Match(q.Index('users_by_email'), newUserEmail)),
            q.Let(
                {
                    newUser: q.Get(q.Match(q.Index('users_by_email'), newUserEmail))
                },
                q.Do(
                    q.Update(
                        q.Ref(q.Collection('users'), prevUserId), 
                        {data: {roles: prevUserUpdatedRoles}}
                    ),
                    q.Update(
                        q.Select('ref', q.Var('newUser')),
                        {data: {
                            roles: q.Append(role, 
                                q.Select(['data', 'roles'], q.Var('newUser')))
                        }}
                    )
                )
            ),
            null
        )
    ) as S_User | null
}

export async function updateUserRoles(userId:string, updatedRoles:string[]) {

    return await client.query(
        q.Update(
            q.Ref(q.Collection('users'), userId),
            {data: {roles: updatedRoles}}
        )
    ) as S_User
}

export async function addUserRoleWithEmail(email:string, role:string) {

    return await client.query(
        q.If(
            q.Exists(q.Match(q.Index('users_by_email'), email)),
            q.Let(
                {
                    user: q.Get(q.Match(q.Index('users_by_email'), email))
                },
                q.Update(
                    q.Select('ref', q.Var('user')),
                    {data: {
                        roles: q.Append(role, 
                            q.Select(['data', 'roles'], q.Var('user')))
                    }}
                )
            ),
            null
        )
    ) as S_User | null
}
