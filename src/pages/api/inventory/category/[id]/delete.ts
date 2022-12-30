import { NextApiRequest, NextApiResponse } from "next";
import { deleteCategory } from "../../../../../database/operations/category";
import { includesPartModifiableRole, verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function DeleteCategory(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json('Invalid request method.')
    }

    try {

        if (!includesPartModifiableRole(req.body.jwtUser.roles)) {
            return res.status(403).json({msg: 'Permission to delete category denied.'})
        }

        await deleteCategory(req.query.id as string, 
            req.body.parentCategoryId as string)

        return res.status(200).json({msg: 'Deletion successful'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})