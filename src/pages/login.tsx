import Head from "next/head";
import MainHeader from "../components/nav/MainHeader";
import Main from '../components/login/Main'
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { mustNotBeAuthenticated } from "../utils/auth";

export default function Login() {

    return (
        <>
            <Head>
                <title>
                    MRG Operations Login     
                </title>   
            </Head> 
            <div className="root-header-only">
                <MainHeader />
                <Main />
            </div>
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    const redirect = await mustNotBeAuthenticated(ctx)

    if (!redirect) {
        return {props: {}}
    }

    return redirect
}