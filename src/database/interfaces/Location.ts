import { C_Ref, S_Ref } from "./fauna";

export const LOCATION_TYPES = [
    'Table' , 'Wall' , 'Shelf' , 'Bin' , 'Area'
]
export const PLURAL_LOCATION_TYPES = [
    'Tables', 'Walls', 'Shelves', 'Bins', 'Areas'
]

interface LocationData {
    letter: string;
    type: 'Table' | 'Wall' | 'Shelf' | 'Bin' | 'Area';
    squares: [number, number][];
    image: string;
    relationship: string;
    direction?: 'left' | 'right' | 'down' | 'up';
}

interface S_LocationData extends LocationData {
    parent: S_Ref | string;
}

interface C_LocationData extends LocationData {
    parent: C_Ref | string;
}

export interface S_Location {
    ref: S_Ref;
    data: S_LocationData;
}

export interface C_Location {
    ref: C_Ref;
    data: C_LocationData;
}