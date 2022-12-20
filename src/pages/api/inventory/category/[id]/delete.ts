import { NextApiRequest, NextApiResponse } from "next";
import { deleteCategory } from "../../../../../database/operations/category";
import { verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function DeleteCategory(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json('Invalid request method.')
    }

    try {

        await deleteCategory(req.query.id as string, 
            req.query.parentCategoryId as string)

        return res.status(200).json({msg: 'Deletion successful'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})