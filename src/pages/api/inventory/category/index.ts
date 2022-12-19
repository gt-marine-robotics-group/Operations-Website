import { NextApiRequest, NextApiResponse } from "next";
import { getCategoryNamesFromParent, getInitialCategoryNames } from "../../../../database/operations/category";
import { verifyUser } from "../../../../utils/auth";

async function categorySelect(query:NextApiRequest['query']) {

    if ('initialSelected' in query) {
        return await getInitialCategoryNames(query.initialSelected as string)
    }
    return await getCategoryNamesFromParent(query.parent as string)
}

export default verifyUser(async function Category(req:NextApiRequest, res:NextApiResponse) {

    try {

        const {mode} = req.query

        if (mode === 'categorySelect') {
            const data = await categorySelect(req.query)
            return res.status(200).json(data)
        }

        return res.status(200).json({msg: 'the data'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})