import { Schema, model } from 'mongoose';
import { IUser } from "../models/user.model";

export const UserSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'service', 'user'], default: 'user' },
    isActive: { type: Boolean, default: true }
});

export default model<IUser>('User', UserSchema);