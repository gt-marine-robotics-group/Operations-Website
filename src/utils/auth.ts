import { GetServerSidePropsContext, NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from 'nookies'
import { Cookie_User } from "../database/interfaces/User";
import jwt from 'jsonwebtoken'
import axios from 'axios'
import Router from 'next/router'

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

async function getAuthTokenFromApiHandler(req:NextApiRequest) {
    const auth = req.cookies['user-auth']

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

export function includesPartModifiableRole(roles:string[]) {
    for (const role of roles) {
        if (role === 'President' || role === 'Operations Officer' || 
            role.includes('Technical Lead')) {
            return true
        }
    }
    return false
}

export function includesAdminRole(roles:string[]) {
    for (const role of roles) {
        if (role === 'President' || role === 'Operations Officer') {
            return true
        }
    }
    return false
}

export async function getPartModifierUser(ctx:GetServerSidePropsContext) {
    return await getUserWithPermission(ctx, includesPartModifiableRole)
}

export async function getAdminUser(ctx:GetServerSidePropsContext) {
    return await getUserWithPermission(ctx, includesAdminRole)
}

type RoleCheck = (roles:string[]) => boolean
async function getUserWithPermission(ctx:GetServerSidePropsContext, 
    roleCheck:RoleCheck) {

    const {user, redirect} = await getUser(ctx)

    if (redirect) {
        return {user, redirect}
    }

    if (roleCheck(user.roles)) {
        return {user, redirect: null}
    }

    return {user: null, redirect: {
        props: {},
        redirect: {destination: '/'}
    }}
}

export function verifyUser(fn:NextApiHandler) {
    return (req:NextApiRequest, res:NextApiResponse) => {
        return new Promise<void>(resolve => {
            getAuthTokenFromApiHandler(req).then(async (authToken) => {
                if (!authToken) {
                    res.status(403).json({msg: 'YOU CANNOT PASS'})
                    return resolve()
                }
                if (req.method !== 'GET') {
                    req.body.jwtUser = authToken
                }
                await fn(req, res)
                return resolve()
            }).catch(() => {
                res.status(500).json({msg: 'Authentication processing error'})
                return resolve()
            })
        })
    }
}

export async function logout() {
    try {
        await axios({
            method: 'POST', 
            url: '/api/logout'
        })
        Router.push({
            pathname: '/login'
        })
    } catch (e) {
        console.log(e)
    }
}