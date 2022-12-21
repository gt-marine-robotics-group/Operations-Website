import { NextApiRequest, NextApiResponse } from "next";
import { getProjectIdsAndNames } from "../../../database/operations/project";
import { verifyUser } from "../../../utils/auth";

export default verifyUser(async function Projects(req:NextApiRequest, res:NextApiResponse) {

    try {

        const data = await getProjectIdsAndNames()

        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})