import client from '../fauna'
import {query as q, Expr} from 'faunadb'

function getCategoryNamesAndChildrenFromParentInnerQuery(parentId:string) {

    return q.Paginate(
        q.Match(q.Index('categories_by_parent_w_id_name_and_children'), parentId)
    )
}

export async function getCategoryNamesFromParent(parentId:string) {

    return await client.query(
        q.Select('data', getCategoryNamesAndChildrenFromParentInnerQuery(parentId))
    )
}

export async function getInitialCategoryNames(initialCategoryId:string) {

    if (!initialCategoryId) {
        initialCategoryId = '/'
    }

    return await client.query(
        q.Let(
            {
                top: q.Select('data', 
                    getCategoryNamesAndChildrenFromParentInnerQuery('/')),
                initialId: initialCategoryId
            },
            q.If(
                q.Equals(initialCategoryId, '/'),
                q.Var('top'),
                q.Append(
                    q.Select(['data', 0], q.Paginate(q.Match(
                        q.Index('categories_by_id_w_name'),
                        initialCategoryId
                    ))),
                    q.Var('top')
                )
            )
        )
    )
}