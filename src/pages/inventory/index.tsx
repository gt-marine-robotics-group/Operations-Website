import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import MainHeader from "../../components/nav/MainHeader";
import { getUser } from "../../utils/auth";
import Main from '../../components/inventory/index/Main'

export default function Inventory() {

    return (
        <>
            <Head>
                <title>Inventory | MRG Operations</title>     
            </Head> 
            <div className="root-header-only">
                <MainHeader loggedIn />
                <Main />
            </div>
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    const {user, redirect} = await getUser(ctx)

    if (redirect) {
        return redirect
    }

    return {props: {user}}
}