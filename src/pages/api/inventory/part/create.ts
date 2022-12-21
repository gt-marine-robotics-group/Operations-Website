import { NextApiRequest, NextApiResponse } from "next";
import { createPart } from "../../../../database/operations/parts";
import { includesPartModifiableRole, verifyUser } from "../../../../utils/auth";

export default verifyUser(async function CreatePart(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Invalid request method.'})
    }

    try {

        if (!includesPartModifiableRole(req.body.jwtUser.roles)) {
            return res.status(403).json({msg: 'Permission to add part denied.'})
        }

        const part = await createPart(req.body.data)
        console.log('part', part)

        return res.status(200).json(part)
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})