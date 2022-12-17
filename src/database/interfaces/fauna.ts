import {Expr} from "faunadb"

export interface S_Ref {
    ref: Expr;
    id: string;
}

export interface C_Ref {
    "@ref": {
        id: string;
    };
}