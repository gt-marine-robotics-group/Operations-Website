import { GetServerSideProps } from "next";
import Head from "next/head";
import MainHeader from "../components/nav/MainHeader";
import { Cookie_User } from "../database/interfaces/User";
import { getAdminUser } from "../utils/auth";

interface Props {
    user: Cookie_User;
}

export default function Administration({user}:Props) {

    return (
        <>
            <Head>
                <title>
                    Administration | MRG Operations     
                </title>  
            </Head> 
            <div className="root-header-only">
                <MainHeader loggedIn />
                <div>main secton</div>
            </div>
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx) => {
    const {user, redirect} = await getAdminUser(ctx)
    if (redirect) {
        return redirect
    }

    try {
        
        return {props: {user}}
    } catch (e) {
        console.log(e)
        return {props: {}, redirect: {destination: '/inventory'}}
    }
}