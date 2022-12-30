import { NextApiRequest, NextApiResponse } from "next";
import { updatePart } from "../../../../../database/operations/parts";
import { includesPartModifiableRole, verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function UpdatePart(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Invalid request method.'})
    }

    try {

        if (!includesPartModifiableRole(req.body.jwtUser.roles)) {
            return res.status(403).json({msg: 'Permission to update part denied.'})
        }

        await updatePart(req.query.id as string, req.body.data, 
            req.body.prevCategoryId, req.body.prevCategoryParts)

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})