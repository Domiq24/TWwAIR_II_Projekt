import { Schema, model } from 'mongoose';
import { IParkingSpace } from "../models/parking.model";

export const ParkingSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true, match: /^[A-Z]\d{1,2}$/ },
    state: { type: String, enum: ['free', 'occupied', 'emergency'], default: 'free' },
});

export default model<IParkingSpace>('ParkingSpace', ParkingSchema);