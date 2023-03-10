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

function addChildInnerQuery(id:Expr, children:string[], newChild:Expr|string) {

    const strParentChildren = children.length > 0 ? children.join(',') + ',' : ''

    return q.Update(
        id,
        {data: {
            children: q.Concat(
                [strParentChildren, newChild],
            )
        }}
    )
}

function removeChildInnerQuery(id:string, childId:string) {
    return q.If(
        id !== '/',
        q.Let(
            {
                children: q.Select(['data', 0],
                    q.Paginate(q.Match(
                        q.Index('categories_by_id_w_children'),
                        id)
                    )
                )
            },
            q.Let(
                {
                    idRemovedChildren: q.ReplaceStr(
                        q.ReplaceStr(
                            q.Var('children'),
                            childId,
                            ''
                        ),
                        ',,',
                        ','
                    )
                },
                q.Let(
                    {
                        finalChildren: q.If(
                            q.StartsWith(q.Var('idRemovedChildren'), ','),
                            q.SubString(
                                q.Var('idRemovedChildren'),
                                1,
                            ),
                            q.If(
                                q.EndsWith(q.Var('idRemovedChildren'), ','),
                                q.SubString(
                                    q.Var('idRemovedChildren'),
                                    0,
                                    q.Subtract(
                                        q.Length(q.Var('idRemovedChildren')),
                                        1
                                    )
                                ),
                                q.Var('idRemovedChildren')
                            )
                        )
                    },
                    q.Update(
                        q.Ref(q.Collection('categories'), id),
                        {data: {
                            children: q.Var('finalChildren')
                        }}
                    )
                )
            )
        ),
        null
    )
}

export function addPartToCategoryInnerQuery(ref:Expr|'/', part:Expr):Expr {

    if (ref === '/') {
        return null as any
    }

    return q.Let(
        {
            parts: q.Select('data', 
                q.Paginate(q.Match(q.Index('categories_by_ref_w_parts'), ref))
            )
        },
        q.Update(
            ref,
            {data: {
                parts: q.Append(part, q.Var('parts'))
            }} 
        )
    )
}

export function removePartFromCategoryInnerQuery(partId:string, categoryId:string,
    categoryParts:string[]):Expr {

    if (categoryId === '/') {
        return null as any
    }

    const partIndex = categoryParts.indexOf(partId)
    if (partIndex > -1) {
        categoryParts.splice(partIndex)
    }

    return q.Update(
        q.Ref(q.Collection('categories'), categoryId),
        {data: {
            parts: categoryParts.map(p => (
                q.Ref(q.Collection('parts'), p)
            ))
        }}
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

export async function getCategoryName(id:string) {

    return await client.query(
        q.Select(['data'], q.Paginate(q.Match(
            q.Index('categories_by_id_w_name'),
            id
        )))
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

    return await client.query(
        q.Let(
            {
                childId: q.Select(['ref', 'id'], 
                    q.Create(q.Collection('categories'), {data}))
            },
            q.Do(
                q.If(
                    data.parent !== '/',
                    addChildInnerQuery(data.parent as Expr, 
                        parentChildren, q.Var('childId')),
                    null
                ),
                q.Var('childId')
            )
        )
    ) as string
}

interface UpdateCategoryInfoData {
    name: string;
    parent: string|Expr;
    search: string[];
}

export async function updateCategoryInfo(id:string, data:UpdateCategoryInfoData, 
    parentChildren:string[], prevParentId:string) {

    const originalParentId = data.parent
    if (data.parent !== '/') {
        data.parent = q.Ref(q.Collection('categories'), data.parent)
    }

    await client.query(
        q.Do(
            q.If(
                prevParentId === originalParentId,
                null,
                q.Do(
                    q.If(
                        data.parent !== '/',
                        addChildInnerQuery(data.parent as Expr, parentChildren, id),
                        null
                    ),
                    removeChildInnerQuery(prevParentId, id)
                )
            ),
            q.Update(
                q.Ref(q.Collection('categories'), id),
                {data}
            )
        )
    )

}

export async function deleteCategory(id:string, 
    parentCategoryId:string) {

    await client.query(
        q.Do(
            removeChildInnerQuery(parentCategoryId, id),
            q.Delete(q.Ref(q.Collection('categories'), id))
        )
    )
}

export async function getCategory(id:string) {
    
    return await client.query(
        q.Get(q.Ref(q.Collection('categories'), id))
    ) as S_Category
}