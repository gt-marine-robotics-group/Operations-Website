import { C_Ref, S_Ref } from "./fauna";

interface ProjectData {
    name: string;
}

export interface S_ProjectData extends ProjectData {
    lead: S_Ref;
}

export interface C_ProjectData extends ProjectData {
    lead: C_Ref;
}

export interface S_Project {
    ref: S_Ref;
    data: S_ProjectData;
}

export interface C_Project {
    ref: C_Ref;
    data: C_ProjectData;
}