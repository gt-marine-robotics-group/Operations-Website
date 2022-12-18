import { S_Ref, C_Ref} from './fauna'

interface CategoryData {
    name: string;
    search: string[];
}

interface S_CategoryData extends CategoryData {
    children: S_Ref[];
    parent: S_Ref;
    parts: S_Ref[];
}

interface C_CategoryData extends CategoryData {
    children: C_Ref[];
    parent: C_Ref;
    parts: C_Ref[];
}

export interface S_Category {
    ref: S_Ref;
    data: S_CategoryData;
}

export interface C_Category {
    ref: C_Ref;
    data: C_CategoryData;
}