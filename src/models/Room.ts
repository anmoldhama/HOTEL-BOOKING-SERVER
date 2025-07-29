import { Schema, model } from 'mongoose';

export interface IRoom {
  number: number;
  floor: number;
  isBooked: boolean;
}

const roomSchema = new Schema<IRoom>({
  number: { type: Number, required: true, unique: true },
  floor: { type: Number, required: true },
  isBooked: { type: Boolean, default: false },
});

export const Room = model<IRoom>('Room', roomSchema);