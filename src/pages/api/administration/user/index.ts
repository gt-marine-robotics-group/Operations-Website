import { NextApiRequest, NextApiResponse } from "next";
import { getInitialUserList, getUsersAfter } from "../../../../database/operations/user";
import { verifyUser } from "../../../../utils/auth";

export default verifyUser(async function Users(req:NextApiRequest, res:NextApiResponse) {

    try {

        if ('after' in req.query) {
            const data = await getUsersAfter(req.query.after as string)
            return res.status(200).json(data)
        } else {
            const stuff = await getInitialUserList(req.query.userId as string)
            console.log('stuff', stuff)
            return res.status(200).json(stuff)
        }

    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})