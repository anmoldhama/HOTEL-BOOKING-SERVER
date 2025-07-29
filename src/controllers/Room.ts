import { Request, Response } from 'express';
import { Room } from '../models/Room';

function calculateTravelTime(rooms: { number: number; floor: number }[]): number {
  const sorted = rooms.sort((a, b) => a.number - b.number);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const vertical = Math.abs(first.floor - last.floor) * 2;
  const horizontal = Math.abs((last.number % 100 || last.number % 1000) - (first.number % 100 || first.number % 1000));
  return vertical + horizontal;
}

function getCombinations(arr: any[], k: number) {
  const result: any[] = [];
  const helper = (start: number, path: any[]) => {
    if (path.length === k) return result.push(path);
    for (let i = start; i < arr.length; i++) helper(i + 1, [...path, arr[i]]);
  };
  helper(0, []);
  return result;
}

export const getAllRooms = async (_: Request, res: Response) => {
  const rooms = await Room.find().sort({ number: 1 });
  res.json({data: rooms});
};

export const resetRooms = async (_: Request, res: Response) => {
  await Room.updateMany({}, { isBooked: false });
  res.json({ message: 'All rooms have been reset.' });
};

export const randomOccupancy = async (_: Request, res: Response) => {
  const rooms = await Room.find();
  const sampleSize = Math.floor(Math.random() * 20) + 5;
  const shuffled = rooms.sort(() => 0.5 - Math.random()).slice(0, sampleSize);
  await Promise.all(shuffled.map(room => Room.updateOne({ _id: room._id }, { isBooked: true })));
  res.json({ message: `${sampleSize} rooms randomly booked.` });
};

export const bookRooms = async (req: Request, res: Response) => {
  const { numRooms } = req.body;
  if (!numRooms || numRooms < 1 || numRooms > 5) {
    return res.status(400).json({ error: 'Number of rooms must be between 1 and 5.' });
  }

  const availableRooms = await Room.find({ isBooked: false });
  const byFloor = availableRooms.reduce((acc: any, room) => {
    acc[room.floor] = acc[room.floor] || [];
    acc[room.floor].push(room);
    return acc;
  }, {});

  for (const floor in byFloor) {
    if (byFloor[floor].length >= numRooms) {
      const booked = byFloor[floor].slice(0, numRooms);
      await Promise.all(booked.map((r: { _id: any; }) => Room.updateOne({ _id: r._id }, { isBooked: true })));
      return res.json({ bookedRooms: booked, travelTime: calculateTravelTime(booked) });
    }
  }

  const combos = getCombinations(availableRooms, numRooms).map(c => ({
    rooms: c,
    travelTime: calculateTravelTime(c),
  })).sort((a, b) => a.travelTime - b.travelTime);

  if (combos.length === 0) return res.status(400).json({ error: 'Not enough rooms available.' });

  const best = combos[0].rooms;
  await Promise.all(best.map((r: { _id: any; }) => Room.updateOne({ _id: r._id }, { isBooked: true })));
  res.json({ bookedRooms: best, travelTime: calculateTravelTime(best) });
};