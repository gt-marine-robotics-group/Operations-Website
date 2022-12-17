import { S_Ref, C_Ref } from "./fauna";

interface UserData {
    email: string;
    roles: string[]; // e.g. ["President", "RoboBoat Project Lead"]
}

export interface S_UserData extends UserData {
    password: string;
}

export interface C_UserData extends UserData {}

export interface S_User {
    ref: S_Ref;
    data: S_UserData;
}

export interface C_User {
    ref: C_Ref;
    data: C_UserData;
}

export interface Cookie_User extends C_UserData {
    id: string;
}