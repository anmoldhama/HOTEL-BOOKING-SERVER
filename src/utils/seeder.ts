// seedRooms.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Room } from '../models/Room';

dotenv.config();

async function seedRooms() {
  await mongoose.connect(process.env.MONGO_URI!);

  const rooms = [];

  for (let floor = 1; floor <= 9; floor++) {
    for (let i = 1; i <= 10; i++) {
      rooms.push({ number: floor * 100 + i, floor, isBooked: false });
    }
  }

  for (let i = 1; i <= 7; i++) {
    rooms.push({ number: 1000 + i, floor: 10, isBooked: false });
  }

  await Room.deleteMany(); // Clean existing
  await Room.insertMany(rooms);

  console.log('✅ Rooms seeded successfully');
  process.exit(0);
}

seedRooms().catch(err => {
  console.error('❌ Failed to seed rooms', err);
  process.exit(1);
});
