import client from '../fauna'
import { Expr, query as q } from 'faunadb'
import { S_Category } from '../interfaces/Category'

function getInitialInventoryInnerQuery(categoryId:Expr|string) {
    
    return q.Let(
        {
            categories: q.Paginate(q.Match('all_categories_w_id_name_and_parent'), 
                {size: 1000}),
            parts: q.Paginate(q.Match(q.Index('parts_by_category_w_id_and_name'), 
                categoryId))
        },
        {
            categories: q.Select('data', q.Var('categories')),
            parts: q.Select('data', q.Var('parts'))
        }
    )
}

export async function getInitialInventoryData() {

    return await client.query(
        getInitialInventoryInnerQuery('/')
    ) as {categories: [string,string,string][], parts: [string,string][]}
}

export async function getInventoryDataFromIds(categoryId:string) {

    return await client.query(
        {
            parts: q.Select('data', q.Paginate(q.Match(
                q.Index('parts_by_category_w_id_and_name'), 
                q.Ref(q.Collection('categories'), categoryId)
            )))
        }
    ) as {parts: [string,string][]}
}

export async function searchInventory(partTerms:string[]) {

    const partMatches = partTerms.map(term => q.Match(
        q.Index('parts_by_search_w_id_name_and_category'), term
    ))
    
    return (await client.query(
        q.Paginate(
            q.Union(
                ...partMatches
            )
        )
    ) as {data: [string,string,string][]}).data
}