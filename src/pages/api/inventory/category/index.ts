import { NextApiRequest, NextApiResponse } from "next";
import { getCategoryName, getCategoryNamesFromParent, getInitialCategoryNames } from "../../../../database/operations/category";
import { getInitialInventoryData, getInventoryDataFromIds } from "../../../../database/operations/inventory";
import { verifyUser } from "../../../../utils/auth";

async function categorySelect(query:NextApiRequest['query']) {

    if ('initialSelected' in query) {
        if (query['onlyInitial'] === 'true') {
            return await getCategoryName(query.initialSelected as string)
        }
        return await getInitialCategoryNames(query.initialSelected as string)
    }
    return await getCategoryNamesFromParent(query.parent as string)
}

async function inventory(query:NextApiRequest['query']) {
    console.log('query', query)

    if (query.parentCategory === '/') {
        return await getInitialInventoryData()
    }

    // if (typeof(query['categoryChildIds[]']) === 'string') {
    //     query['categoryChildIds[]'] = [query['categoryChildIds[]']]
    // } else if (!('categoryChildIds[]' in query)) {
    //     query['categoryChildIds[]'] = []
    // }

    return await getInventoryDataFromIds(query.parentCategory as string)
        // query['categoryChildIds[]'] as string[])
}

export default verifyUser(async function Category(req:NextApiRequest, res:NextApiResponse) {

    try {

        const {mode} = req.query

        if (mode === 'categorySelect') {
            const data = await categorySelect(req.query)
            return res.status(200).json(data)
        }

        if (mode === 'inventory') {
            const data = await inventory(req.query)
            return res.status(200).json(data)
        }

        return res.status(400).json({msg: 'Invalid mode.'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})