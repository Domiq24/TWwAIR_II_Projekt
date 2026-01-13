import { Schema, model } from 'mongoose';
import { IEvent } from "../models/event.model";

export const EventSchema: Schema = new Schema({
    spaceName: { type: String, required: true, match: /^[A-Z]\d{1,2}$/ },
    state: { type: String, required: true, enum: ['free', 'occupied', 'emergency'] },
    date: { type: Date, default: Date.now },
});

export default model<IEvent>('Event', EventSchema);