import { NextApiRequest, NextApiResponse } from "next";
import { updateCategoryInfo } from "../../../../../database/operations/category";
import { verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function UpdateCategory(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Invalid request method.'})
    }

    try {

        await updateCategoryInfo(req.query.id as string, 
            req.body.data, req.body.parentChildren, req.body.prevParentId)

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})