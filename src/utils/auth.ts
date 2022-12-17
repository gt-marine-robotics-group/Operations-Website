import { GetServerSidePropsContext } from "next";
import { parseCookies } from 'nookies'
import { Cookie_User } from "../database/interfaces/User";
import jwt from 'jsonwebtoken'

function getDecoded(auth:string) {
    return new Promise<Cookie_User|null>(resolve => {
        jwt.verify(auth, process.env.JWT_TOKEN_SIGNATURE, (err, decoded) => {
            if (!err && decoded) resolve(decoded as Cookie_User)
            resolve(null)
        }) 
    })
}

async function getAuthToken(ctx:GetServerSidePropsContext) {

    const auth = parseCookies(ctx)['user-auth']

    if (!auth) return null

    return await getDecoded(auth) 
}

export async function mustNotBeAuthenticated(ctx:GetServerSidePropsContext) {
    const token = await getAuthToken(ctx)

    if (!token) return null

    return {props: {}, redirect: {destination: '/'}}
}

export async function getUser(ctx:GetServerSidePropsContext) {
    const token = await getAuthToken(ctx)

    if (!token) {
        return {user: null, redirect: {
            props: {},
            redirect: {destination: '/login'}
        }}
    }

    return {user: token, redirect: null}
}