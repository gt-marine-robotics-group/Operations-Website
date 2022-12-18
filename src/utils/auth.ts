import { GetServerSidePropsContext } from "next";
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

export async function getPartModifierUser(ctx:GetServerSidePropsContext) {

    const {user, redirect} = await getUser(ctx)

    if (redirect) {
        return {user, redirect}
    }

    for(const role of user.roles) {
        if (role === 'President' || role === 'Operations Officer' || 
            role.includes('Technical Lead')) {
            return {user, redirect: null}
        }
    }

    return {user: null, redirect: {
        props: {},
        redirect: {destination: '/'}
    }}
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