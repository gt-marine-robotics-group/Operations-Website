import { NextApiRequest, NextApiResponse } from "next";
import { deleteUser } from "../../../../database/operations/user";
import { includesAdminRole, verifyUser } from "../../../../utils/auth";

export default verifyUser(async function DeleteUser(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Invalid request method.'})
    }

    try {

        if (!includesAdminRole(req.body.jwtUser.roles)) {
            return res.status(403).json({msg: 'Permission to delete user denied.'})
        }

        await deleteUser(req.body.userId)

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})