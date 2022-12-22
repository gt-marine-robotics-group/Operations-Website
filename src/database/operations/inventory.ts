import client from '../fauna'
import { query as q } from 'faunadb'
import { S_Category } from '../interfaces/Category'

export async function getInitialInventoryData() {

    return await client.query(
        q.Let(
            {
                categoryIds: q.Paginate(q.Match(q.Index('categories_by_parent_w_id'), '/')),
                parts: q.Paginate(q.Match(q.Index('parts_by_category_w_id_and_name'), '/'))
            },
            {
                categories: q.Map(q.Var('categoryIds'), q.Lambda(
                    'id',
                    q.Get(q.Ref(q.Collection('categories'), q.Var('id')))
                )),
                parts: q.Select('data', q.Var('parts'))
            }
        )
    ) as {categories: S_Category[], parts: [string,string][]}
}