import { Box } from "@mui/material"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { Cookie_User } from "../database/interfaces/User"
import { getUser } from "../utils/auth"

interface Props {
	user: Cookie_User;
}

export default function Home({user}:Props) {

	console.log(user)

	return (
		<div>
			hello world
			<Box p={5}>
				bye world
			</Box>
		</div>
	)
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
	const {user, redirect} = await getUser(ctx)

	if (redirect) {
		return redirect
	}

	return {props: {user}}
}