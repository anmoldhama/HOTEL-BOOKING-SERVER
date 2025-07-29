"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const mongoose_1 = require("mongoose");
const roomSchema = new mongoose_1.Schema({
    number: { type: Number, required: true, unique: true },
    floor: { type: Number, required: true },
    isBooked: { type: Boolean, default: false },
});
exports.Room = (0, mongoose_1.model)('Room', roomSchema);
