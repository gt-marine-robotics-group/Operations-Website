import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import MainHeader from "../../../components/nav/MainHeader";
import { getPartModifierUser } from "../../../utils/auth";

export default function AddCategory() {
    
    return (
        <>
           <Head>
                <title>
                    Add Category | MRG Operations     
                </title>      
            </Head> 
            <div className="root-header-only">
                <MainHeader loggedIn />
                <div>main section</div>
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