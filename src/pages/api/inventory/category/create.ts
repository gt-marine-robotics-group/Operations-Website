import { NextApiRequest, NextApiResponse } from "next";
import { createCategory } from "../../../../database/operations/category";
import { includesPartModifiableRole, verifyUser } from "../../../../utils/auth";

export default verifyUser(async function CreateCategory(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Invalid request method'})
    }

    try {

        if (!includesPartModifiableRole(req.body.jwtUser.roles)) {
            return res.status(403).json({msg: 'Permission to add category denied.'})
        }

        const id = await createCategory(req.body.data, req.body.parentChildren)

        return res.status(200).json({id})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})