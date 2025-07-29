import express from 'express';
import { getAllRooms, resetRooms, randomOccupancy, bookRooms } from '../controllers/Room';
import {userAuth} from '../middlewares/Auth';

const router = express.Router();

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

router.get('/',userAuth, getAllRooms);

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
router.post('/reset',userAuth, resetRooms);

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
router.post('/random',userAuth, randomOccupancy);

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
router.post('/book',userAuth, bookRooms);

export default router;
