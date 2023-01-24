import { NextApiRequest, NextApiResponse } from "next";
import { getLocationsFromTypes } from "../../../../database/operations/location";
import { verifyUser } from "../../../../utils/auth";

export default verifyUser(async function Locations(req:NextApiRequest, res:NextApiResponse) {

    try {

        console.log(req.query)

        // const {data} = await getLocationsFromTypes(req.query.types)

        return res.status(200).json({data: 'data'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})