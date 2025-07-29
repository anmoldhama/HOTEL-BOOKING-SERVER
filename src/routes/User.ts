
import { Router } from 'express';
import { register, login, getProfile, logout } from '../controllers/User';
import {userAuth} from '../middlewares/Auth';

const router = Router();

/**
 * @swagger
 * /session/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               user_type:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation failed or email exists
 */

router.post('/register', register);

/**
 * @swagger
 * /session/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User Login successfully
 *       400:
 *         description: Validation failed or incorrect credentials
 */

router.post('/login', login);
router.get('/logout',userAuth, logout);
router.get('/getProfile',userAuth, getProfile);

export default router;
