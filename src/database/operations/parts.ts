import client from '../fauna'
import { Expr, query as q } from 'faunadb'
import { PartData, S_Part } from "../interfaces/Part";
import { addPartToCategoryInnerQuery, removePartFromCategoryInnerQuery } from './category';
import { S_Ref } from '../interfaces/fauna';

interface CreatePartData extends PartData {
    category: string|Expr;
}

export async function createPart(data:CreatePartData) {

    if (data.category !== '/') {
        data.category = q.Ref(q.Collection('categories'), data.category)
    }

    return await client.query(
        q.Let(
            {
                part: q.Create(q.Collection('parts'), {data})
            },
            q.Do(
                addPartToCategoryInnerQuery(data.category, 
                    q.Select('ref', q.Var('part'))),
                q.Var('part')
            )
        )
    ) as S_Part
}

export async function getUpdatePartInfo(id:string) {

    return await client.query(
        q.Let(
            {
                part: q.Get(q.Ref(q.Collection('parts'), id))
            },
            {
                part: q.Var('part'),
                categoryParts: q.If(
                    q.Equals(q.Select(['data', 'category'], q.Var('part')), '/'),
                    [],
                    q.Select(
                        'data',
                        q.Paginate(q.Match(
                            q.Index('categories_by_ref_w_parts'), 
                            q.Select(['data', 'category'], q.Var('part'))
                        ))
                    )
                )
            }
        )
    ) as {part:S_Part, categoryParts:S_Ref[]}
}

export async function updatePart(id:string, data:CreatePartData, 
    prevCategoryId:string, prevCategoryParts:string[]) {

    const newCategoryId = data.category

    if (data.category !== '/') {
        data.category = q.Ref(q.Collection('categories'), data.category)
    }

    await client.query(
        q.Do(
            q.If(
                prevCategoryId === newCategoryId,
                null,
                q.Do(
                    removePartFromCategoryInnerQuery(id, prevCategoryId, 
                        prevCategoryParts),
                    addPartToCategoryInnerQuery(data.category, 
                        q.Ref(q.Collection('parts'), id))
                )
            ),
            q.Update(
                q.Ref(q.Collection('parts'), id),
                {data}
            )
        )
    )
}