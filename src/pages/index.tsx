import { GetServerSideProps, GetServerSidePropsContext } from "next"
import Head from "next/head";
import MainHeader from "../components/nav/MainHeader";
import { Cookie_User } from "../database/interfaces/User"
import { getUser } from "../utils/auth"

interface Props {
	user: Cookie_User;
}

export default function Home({user}:Props) {

	console.log(user)

	return (
		<>
			<Head>
				<title>MRG Operations Dashboard</title>
			</Head>
			<div className="root-header-only">
				<MainHeader loggedIn={true} />
				<div>
					main section
				</div>
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