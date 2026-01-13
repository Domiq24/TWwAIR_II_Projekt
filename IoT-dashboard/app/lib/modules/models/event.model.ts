export interface IEvent {
    _id?: string;
    spaceName: string;
    state: string;
    date?: Date;
}

export type Query<T> = {
    [key: string]: T;
};