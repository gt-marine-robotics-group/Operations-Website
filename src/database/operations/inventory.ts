import client from '../fauna'
import { Expr, query as q } from 'faunadb'
import { S_Category } from '../interfaces/Category'

function getInventoryDataFromCategoryInnerQuery(categoryId:Expr|string) {
    
    return q.Let(
        {
            categoryIds: q.Paginate(q.Match(q.Index('categories_by_parent_w_id'), 
                categoryId)),
            parts: q.Paginate(q.Match(q.Index('parts_by_category_w_id_and_name'), 
                categoryId))
        },
        {
            categories: q.Map(q.Var('categoryIds'), q.Lambda(
                'id',
                q.Get(q.Ref(q.Collection('categories'), q.Var('id')))
            )),
            parts: q.Select('data', q.Var('parts'))
        }
    )
}

export async function getInitialInventoryData() {

    return await client.query(
        getInventoryDataFromCategoryInnerQuery('/')
    ) as {categories: S_Category[], parts: [string,string][]}
}

export async function getInventoryDataFromIds(categoryId:string,
    categoryChildrenIds:string[]) {

    return await client.query(
        {
            categories: q.Map(categoryChildrenIds, q.Lambda(
                'id',
                q.Get(q.Ref(q.Collection('categories'), q.Var('id')))
            )),
            parts: q.Select('data', q.Paginate(q.Match(
                q.Index('parts_by_category_w_id_and_name'), 
                q.Ref(q.Collection('categories'), categoryId)
            )))
        }
    ) as {categories: S_Category[], parts: [string,string][]}
}