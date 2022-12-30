import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import MainHeader from "../../../../components/nav/MainHeader";
import { C_Ref } from "../../../../database/interfaces/fauna";
import { C_Part } from "../../../../database/interfaces/Part";
import { getUpdatePartInfo } from "../../../../database/operations/parts";
import { getPartModifierUser } from "../../../../utils/auth";
import Main from '../../../../components/inventory/part/update/Main'

interface Props {
    part: C_Part;
    categoryParts: C_Ref[];
}

export default function UpdatePart({part, categoryParts}:Props) {

    console.log('part', part)
    console.log('categoryParts', categoryParts)

    return (
        <>
            <Head>
                <title>
                    Update {part.data.name} | MRG Operations
                </title>     
            </Head> 
            <div className="root-header-only">
                <MainHeader loggedIn />
                <Main part={part} categoryParts={categoryParts} />
            </div>
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx) => {
    const {user, redirect} = await getPartModifierUser(ctx)

    if (redirect) {
        return redirect
    }

    try {

        const {part, categoryParts} = await 
            getUpdatePartInfo(ctx.params?.id?.toString() as string)

        return {props: {
            part: JSON.parse(JSON.stringify(part)),
            categoryParts: JSON.parse(JSON.stringify(categoryParts))
        }}
    } catch (e) {
        console.log(e)
        return {props: {}, redirect: {destination: '/inventory'}}
    }
}
