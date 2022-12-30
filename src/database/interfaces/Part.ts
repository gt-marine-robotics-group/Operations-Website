import { C_Ref, S_Ref } from "./fauna";

export interface PartData {
    name: string;
    search: string[];
    available: number;
    onTheWay: number;
    projects: {
        [name:string]: number;
    };
    img: string;
    units: string;
    note: string;
}

export interface S_PartData extends PartData {
    category: S_Ref | string;
    location?: S_Ref;
}

export interface C_PartData extends PartData {
    category: C_Ref | string;
    location?: C_Ref;
}

export interface S_Part {
    ref: S_Ref;
    data: S_PartData;
}

export interface C_Part {
    ref: C_Ref;
    data: C_PartData;
}