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

export async function getLocationsFromTypes(types:string[]) {

    return await client.query(
        q.Map(
            q.Paginate(
                q.Union(
                    q.Map(types, q.Lambda('type', q.Match(q.Index('locations_by_type'), q.Var('type'))))
                ), 
                {size: 1000},
            ),
            q.Lambda('ref', q.Get(q.Var('ref')))
        )
    )
}