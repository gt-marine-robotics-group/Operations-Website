import { NextApiRequest, NextApiResponse } from "next";
import { getInitialUserList, getUserFromEmail, getUsersAfter } from "../../../../database/operations/user";
import { verifyUser } from "../../../../utils/auth";

export default verifyUser(async function Users(req:NextApiRequest, res:NextApiResponse) {

    try {

        if ('email' in req.query) {
            const data = await getUserFromEmail(req.query.email as string)
            return res.status(200).json(data)
        }

        if ('after' in req.query) {
            const data = await getUsersAfter(req.query.after as string)
            return res.status(200).json(data)
        } else {
            const data = await getInitialUserList(req.query.userId as string)
            return res.status(200).json(data)
        }

    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})