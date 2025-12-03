export interface IParkingSpace {
    name: string;
    state?: string;
}

export type Query<T> = {
    [key: string]: T;
};