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
exports.logout = exports.getProfile = exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const BlacklistToken_1 = require("../models/BlacklistToken");
const validation_1 = require("../utils/validation");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password, user_type } = req.body;
        // Validate request data
        const validationErrors = (0, validation_1.validationOnRegister)(req);
        if (validationErrors.length > 0) {
            return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
        }
        // Check if email already exists
        const emailExist = yield User_1.User.findOne({ email: email });
        if (emailExist) {
            return res.status(400).send("Email already exists!");
        }
        // Hash the password using the static method
        const hashedPassword = yield User_1.User.hashPassword(password);
        // Create a new user document
        const user = new User_1.User({
            email: email,
            password: hashedPassword,
            fullName: { firstName: fullName.firstName, lastName: fullName.lastName },
            user_type: user_type
        });
        const Gentoken = yield user.getJWT();
        const savedUser = yield user.save();
        return res.status(201).json({ message: 'User created successfully', data: savedUser, token: Gentoken });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error creating user', error });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error("Provide all mandatory fields!");
        }
        const fetchUser = yield User_1.User.findOne({ email }).select('+password');
        if (!fetchUser) {
            throw new Error("User not exist!");
        }
        const isPasswordValid = yield fetchUser.validatePassword(password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }
        const token = yield fetchUser.getJWT();
        res.cookie("token", token);
        return res.status(200).send({ status: "Login Successfully!", token: token, user: fetchUser.fullName });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error in login', error });
    }
});
exports.login = login;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        return res.status(200).json({ user });
    }
    catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err.message });
    }
});
exports.getProfile = getProfile;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get the token from the request cookies or headers
        const token = req.cookies.token || ((_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', ''));
        if (!token) {
            return res.status(400).send("No token provided!");
        }
        // Blacklist the token
        yield BlacklistToken_1.BlacklistToken.create({ token });
        // Clear the token cookie
        res.cookie("token", null, {
            httpOnly: true,
            expires: new Date(0),
        });
        return res.status(200).send("Logged out successfully!");
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Something went wrong during logout.");
    }
});
exports.logout = logout;
