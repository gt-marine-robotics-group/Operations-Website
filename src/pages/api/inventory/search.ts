import { NextApiRequest, NextApiResponse } from "next";
import { searchInventory } from "../../../database/operations/inventory";
import { verifyUser } from "../../../utils/auth";

export default verifyUser(async function SearchInventory(req:NextApiRequest, res:NextApiResponse) {

    try {

        if (!('partSearch[]' in req.query)) {
            req.query['partSearch[]'] = []
        } else if (typeof(req.query['partSearch[]']) === 'string') {
            req.query['partSearch[]'] = [req.query['partSearch[]']]
        }

        const matches = await searchInventory(req.query['partSearch[]'] as string[])

        return res.status(200).json(matches)
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})