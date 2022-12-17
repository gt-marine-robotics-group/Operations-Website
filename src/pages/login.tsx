import Head from "next/head";
import MainHeader from "../components/nav/MainHeader";
import Main from '../components/login/Main'

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