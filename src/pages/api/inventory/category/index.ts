import { NextApiRequest, NextApiResponse } from "next";
import { getInitialCategoryNames } from "../../../../database/operations/category";

async function categorySelect(query:NextApiRequest['query']) {

    if ('initialSelected' in query) {
        const data = await getInitialCategoryNames(query.initialSelected as string)
        return data
    }
    return null
}

export default async function Category(req:NextApiRequest, res:NextApiResponse) {

    try {

        console.log(req.query)
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
}