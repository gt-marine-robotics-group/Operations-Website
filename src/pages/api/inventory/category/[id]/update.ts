import { NextApiRequest, NextApiResponse } from "next";
import { updateCategoryInfo } from "../../../../../database/operations/category";
import { includesPartModifiableRole, verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function UpdateCategory(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Invalid request method.'})
    }

    try {

        if (!includesPartModifiableRole(req.body.jwtUser.roles)) {
            return res.status(403).json({msg: 'Permission to update category denied.'})
        }

        await updateCategoryInfo(req.query.id as string, 
            req.body.data, req.body.parentChildren, req.body.prevParentId)

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})