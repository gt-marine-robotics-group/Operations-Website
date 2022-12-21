import client from '../fauna'
import { Expr, query as q } from 'faunadb'
import { PartData, S_Part } from "../interfaces/Part";
import { addPartToCategoryInnerQuery } from './category';

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