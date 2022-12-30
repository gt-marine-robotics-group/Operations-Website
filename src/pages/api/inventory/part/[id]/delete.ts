import { NextApiRequest, NextApiResponse } from "next";
import { deletePart } from "../../../../../database/operations/parts";
import { includesPartModifiableRole, verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function DeletePart(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Invalid request method.'})
    }

    try {

        if (!includesPartModifiableRole(req.body.jwtUser.roles)) {
            return res.status(403).json({msg: 'Permission to delete part denied.'})
        }

        await deletePart(req.query.id as string, 
            req.body.categoryId, req.body.categoryParts)

        return res.status(200).json({msg: 'Deletion successfull'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})