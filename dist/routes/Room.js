"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Room_1 = require("../controllers/Room");
const Auth_1 = require("../middlewares/Auth");
const router = express_1.default.Router();
/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Get all rooms
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of rooms
 */
router.get('/', Auth_1.userAuth, Room_1.getAllRooms);
/**
 * @swagger
 * /rooms/reset:
 *   post:
 *     summary: Reset all room bookings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Room bookings reset
 */
router.post('/reset', Auth_1.userAuth, Room_1.resetRooms);
/**
 * @swagger
 * /rooms/random:
 *   post:
 *     summary: Randomly book rooms
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Random rooms booked
 */
router.post('/random', Auth_1.userAuth, Room_1.randomOccupancy);
/**
 * @swagger
 * /rooms/book:
 *   post:
 *     summary: Book optimal N rooms
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numRooms:
 *                 type: integer
 *                 example: 3
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Booked room details
 */
router.post('/book', Auth_1.userAuth, Room_1.bookRooms);
exports.default = router;
