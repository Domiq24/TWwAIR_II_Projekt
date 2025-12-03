export interface IUser {
    _id: string;
    name: string;
    email: string;
    role?: string;
    isActive?: boolean;
}

export type Query<T> = {
    [key: string]: T;
};