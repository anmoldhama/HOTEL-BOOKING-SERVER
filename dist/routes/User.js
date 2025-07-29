"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../controllers/User");
const Auth_1 = require("../middlewares/Auth");
const router = (0, express_1.Router)();
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
router.post('/register', User_1.register);
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
router.post('/login', User_1.login);
router.get('/logout', Auth_1.userAuth, User_1.logout);
router.get('/getProfile', Auth_1.userAuth, User_1.getProfile);
exports.default = router;
