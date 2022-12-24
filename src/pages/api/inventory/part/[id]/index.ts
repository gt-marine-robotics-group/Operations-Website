import { NextApiRequest, NextApiResponse } from "next";
import { getPart, getPartAndProjects } from "../../../../../database/operations/parts";
import { verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function Part(req:NextApiRequest, res:NextApiResponse) {

    try {

        console.log(req.query)
        if (req.query.loadProjects === 'true') {
            const data = await getPartAndProjects(req.query.id as string) 
            return res.status(200).json(data)
        }

        const part = await getPart(req.query.id as string)
        return res.status(200).json({part})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})