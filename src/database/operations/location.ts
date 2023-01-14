import client from '../fauna'
import {query as q} from 'faunadb'
import { S_Location } from '../interfaces/Location'

export async function getLocationsFromType(type:string) {

    return await client.query(
        q.Map(
            q.Paginate(
                q.Match(q.Index('locations_by_type'), type)
            ),
            q.Lambda('ref', q.Get(q.Var('ref')))
        )
    ) as {data: S_Location[]}
}