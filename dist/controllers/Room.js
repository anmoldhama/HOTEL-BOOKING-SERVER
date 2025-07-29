"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRooms = exports.randomOccupancy = exports.resetRooms = exports.getAllRooms = void 0;
const Room_1 = require("../models/Room");
function calculateTravelTime(rooms) {
    const sorted = rooms.sort((a, b) => a.number - b.number);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const vertical = Math.abs(first.floor - last.floor) * 2;
    const horizontal = Math.abs((last.number % 100 || last.number % 1000) - (first.number % 100 || first.number % 1000));
    return vertical + horizontal;
}
function getCombinations(arr, k) {
    const result = [];
    const helper = (start, path) => {
        if (path.length === k)
            return result.push(path);
        for (let i = start; i < arr.length; i++)
            helper(i + 1, [...path, arr[i]]);
    };
    helper(0, []);
    return result;
}
const getAllRooms = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield Room_1.Room.find().sort({ number: 1 });
    res.json({ data: rooms });
});
exports.getAllRooms = getAllRooms;
const resetRooms = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Room_1.Room.updateMany({}, { isBooked: false });
    res.json({ message: 'All rooms have been reset.' });
});
exports.resetRooms = resetRooms;
const randomOccupancy = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield Room_1.Room.find();
    const sampleSize = Math.floor(Math.random() * 20) + 5;
    const shuffled = rooms.sort(() => 0.5 - Math.random()).slice(0, sampleSize);
    yield Promise.all(shuffled.map(room => Room_1.Room.updateOne({ _id: room._id }, { isBooked: true })));
    res.json({ message: `${sampleSize} rooms randomly booked.` });
});
exports.randomOccupancy = randomOccupancy;
const bookRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { numRooms } = req.body;
    if (!numRooms || numRooms < 1 || numRooms > 5) {
        return res.status(400).json({ error: 'Number of rooms must be between 1 and 5.' });
    }
    const availableRooms = yield Room_1.Room.find({ isBooked: false });
    const byFloor = availableRooms.reduce((acc, room) => {
        acc[room.floor] = acc[room.floor] || [];
        acc[room.floor].push(room);
        return acc;
    }, {});
    for (const floor in byFloor) {
        if (byFloor[floor].length >= numRooms) {
            const booked = byFloor[floor].slice(0, numRooms);
            yield Promise.all(booked.map((r) => Room_1.Room.updateOne({ _id: r._id }, { isBooked: true })));
            return res.json({ bookedRooms: booked, travelTime: calculateTravelTime(booked) });
        }
    }
    const combos = getCombinations(availableRooms, numRooms).map(c => ({
        rooms: c,
        travelTime: calculateTravelTime(c),
    })).sort((a, b) => a.travelTime - b.travelTime);
    if (combos.length === 0)
        return res.status(400).json({ error: 'Not enough rooms available.' });
    const best = combos[0].rooms;
    yield Promise.all(best.map((r) => Room_1.Room.updateOne({ _id: r._id }, { isBooked: true })));
    res.json({ bookedRooms: best, travelTime: calculateTravelTime(best) });
});
exports.bookRooms = bookRooms;
