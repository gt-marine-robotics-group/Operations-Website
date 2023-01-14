import { NextApiRequest, NextApiResponse } from "next";
import { getLocationsFromType } from "../../../../database/operations/location";

export default async function LocationByName(req:NextApiRequest, res:NextApiResponse) {

    try {

        const {data} = await getLocationsFromType(req.query.name as string)

        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}