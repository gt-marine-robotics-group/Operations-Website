import client from '../fauna'
import {query as q, Expr} from 'faunadb'
import { S_Category, S_CategoryData } from '../interfaces/Category'
import { S_Ref } from '../interfaces/fauna'

function getCategoryNamesAndChildrenFromParentInnerQuery(parentId:string) {

    return q.Paginate(
        q.Match(q.Index('categories_by_parent_w_id_name_and_children'), 
            parentId === '/' ? parentId : q.Ref(q.Collection('categories'), parentId))
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

interface CreateCategoryData extends Omit<S_CategoryData, 'parent'> {
    parent: string | Expr;
}

export async function createCategory(data:CreateCategoryData, 
    parentChildren:string[]) {

    if (data.parent !== '/') {
        data.parent = q.Ref(q.Collection('categories'), data.parent)
    }

    const strParentChildren = parentChildren.length > 0 ? parentChildren.join(',') + ',' : ''

    await client.query(
        q.Let(
            {
                childId: q.Select(['ref', 'id'], 
                    q.Create(q.Collection('categories'), {data}))
            },
            q.If(
                data.parent !== '/',
                q.Update(
                    data.parent,
                    {data: {
                        children: q.Concat(
                            [strParentChildren, q.Var('childId')],
                        )
                    }}
                ),
                null
            )
        )
    )
}

export async function getCategory(id:string) {
    
    return await client.query(
        q.Get(q.Ref(q.Collection('categories'), id))
    ) as S_Category
}