import { NextApiRequest, NextApiResponse } from "next";
import { addUser } from "../../../../database/operations/user";
import { includesAdminRole, verifyUser } from "../../../../utils/auth";

export default verifyUser(async function AddUser(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Invalid request method.'})
    }

    try {

        if (!includesAdminRole(req.body.jwtUser.roles)) {
            return res.status(403).json({msg: 'Permission to delete user denied.'})
        }

        const user = await addUser(req.body.email)

        return res.status(200).json(user)
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})