import { GetServerSideProps } from "next";
import Head from "next/head";
import MainHeader from "../../components/nav/MainHeader";
import { getAdminUser } from "../../utils/auth";
import Main from '../../components/location/Main'
import { Cookie_User } from "../../database/interfaces/User";

interface Props {
    user: Cookie_User;
}

export default function Location({user}:Props) {

    return (
        <>
            <Head>
                <title>
                    Locations | MRG Operations     
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

    const {user, redirect} = await getAdminUser(ctx)
    if (redirect) {
        return redirect
    }

    return {props: {user}}
}