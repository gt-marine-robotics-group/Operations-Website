import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import MainHeader from "../../../../components/nav/MainHeader";
import { C_Category } from "../../../../database/interfaces/Category";
import { getCategory } from "../../../../database/operations/category";
import { getPartModifierUser } from "../../../../utils/auth";
import Main from '../../../../components/inventory/category/update/Main'

interface Props {
    category: C_Category;
}

export default function UpdateCategory({category}:Props) {

    return (
        <>
            <Head>
                <title>
                    Update {category.data.name} Category | MRG Operations
                </title>
            </Head> 
            <div className="root-header-only">
                <MainHeader loggedIn />
                <Main category={category} />
            </div>
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
    const {user, redirect} = await getPartModifierUser(ctx)

    if (redirect) {
        return redirect
    }

    try {
        const category = await getCategory(ctx.params?.id?.toString() as string)

        return {props: {
            category: JSON.parse(JSON.stringify(category))
        }}
    } catch (e) {
        console.log(e)
        return {props: {}, redirect: {destination: '/inventory'}}
    }
}