import { GetServerSideProps } from "next";
import Head from "next/head";
import usePart from "../../../../components/inventory/part/usePart";
import MainHeader from "../../../../components/nav/MainHeader";
import { Cookie_User } from "../../../../database/interfaces/User";
import { getUser } from "../../../../utils/auth";

interface Props {
    user: Cookie_User;
}

export default function Part({user}:Props) {

    const {part, partName, error} = usePart()

    return (
        <>
            <Head>
                <title>
                    {partName || 'Part'} | MRG Operations
                </title>     
            </Head> 
            <div className="root-header-only">
                <MainHeader loggedIn />
                <div>main section</div>
            </div>
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx) => {
    const {user, redirect} = await getUser(ctx)

    if (redirect) {
        return redirect
    }

    return {props: {user}}
}