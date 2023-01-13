import { GetServerSideProps } from "next";
import Head from "next/head";
import MainHeader from "../../components/nav/MainHeader";
import { getAdminUser } from "../../utils/auth";
import Main from '../../components/location/Main'

export default function Location() {

    return (
        <>
            <Head>
                <title>
                    Locations | MRG Operations     
                </title>     
            </Head> 
            <div className="root-header-only">
                <MainHeader loggedIn />
                <Main />
            </div>
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx) => {

    const {user, redirect} = await getAdminUser(ctx)
    if (redirect) {
        return redirect
    }

    return {props: {user}}
}