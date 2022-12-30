import client from '../fauna'
import {query as q} from 'faunadb'

export async function getProjectIdsAndNames() {

    return (await client.query(
        q.Paginate(q.Match(q.Index('all_projects_w_id_and_name'))),
    ) as {data: [string,string][]}).data
}