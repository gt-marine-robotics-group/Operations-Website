import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import MainHeader from "../../../components/nav/MainHeader";
import { getPartModifierUser } from "../../../utils/auth";
import Main from '../../../components/inventory/part/add/Main'

export default function AddPart() {

    return (
        <>
            <Head>
                <title>
                    Add Part | MRG Operations     
                </title>     
            </Head> 
            <div className="root-header-only">
                <MainHeader loggedIn />
                <Main />
            </div>
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    const {user, redirect} = await getPartModifierUser(ctx)

    if (redirect) {
        return redirect
    }

    return {props: {}}
}