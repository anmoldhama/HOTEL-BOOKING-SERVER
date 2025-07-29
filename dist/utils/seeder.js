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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// seedRooms.ts
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Room_1 = require("../models/Room");
dotenv_1.default.config();
function seedRooms() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(process.env.MONGO_URI);
        const rooms = [];
        for (let floor = 1; floor <= 9; floor++) {
            for (let i = 1; i <= 10; i++) {
                rooms.push({ number: floor * 100 + i, floor, isBooked: false });
            }
        }
        for (let i = 1; i <= 7; i++) {
            rooms.push({ number: 1000 + i, floor: 10, isBooked: false });
        }
        yield Room_1.Room.deleteMany(); // Clean existing
        yield Room_1.Room.insertMany(rooms);
        console.log('✅ Rooms seeded successfully');
        process.exit(0);
    });
}
seedRooms().catch(err => {
    console.error('❌ Failed to seed rooms', err);
    process.exit(1);
});
