import Head from "next/head";
import usePart from "../../../../components/inventory/part/usePart";
import MainHeader from "../../../../components/nav/MainHeader";

export default function Part() {

    const {part, partName} = usePart()

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