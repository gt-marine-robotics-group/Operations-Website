import { GetServerSideProps } from "next";
import Head from "next/head";
import MainHeader from "../components/nav/MainHeader";
import { C_User } from "../database/interfaces/User";
import { getUserFromEmail } from "../database/operations/user";
import { mustNotBeAuthenticated } from "../utils/auth";
import Main from '../components/setup/Main'

interface Props {
    user: C_User;
}

export default function Setup({user}:Props) {

    return (
        <>
            <Head>
                <title>
                    Set up your Account | MRG Operations 
                </title>     
            </Head> 
            <div className="root-header-only">
                <MainHeader loggedIn />
                <Main user={user} />
            </div>
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx) => {
    const redirect = await mustNotBeAuthenticated(ctx)

    if (redirect) {
        return redirect
    }

    try {
        const user = await getUserFromEmail(ctx.query.username + '@gatech.edu')

        if (!user) {
            throw new Error('No user found.')
        }

        if (user.data.password) {
            throw new Error('User already has password.')
        }

        return {props: {
            user: JSON.parse(JSON.stringify(user))
        }}
    } catch (e) {
        return {props: {}, redirect: {destination: '/'}}
    }
}