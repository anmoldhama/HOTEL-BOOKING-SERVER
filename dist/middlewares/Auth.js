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
exports.recruiterAuth = exports.userAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret)
            throw new Error("JWT_SECRET is not set");
        const token = ((_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '')) || req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        const isBlacklisted = yield User_1.User.findOne({ token: token });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token is already used" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const user = yield User_1.User.findById(decoded._id);
        if ((user === null || user === void 0 ? void 0 : user.user_type) !== "user") {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Unauthorized", error: error.message });
    }
});
exports.userAuth = userAuth;
const recruiterAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret)
            throw new Error("JWT_SECRET is not set");
        const token = req.cookies.token || ((_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', ''));
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        const isBlacklisted = yield User_1.User.findOne({ token: token });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token is already used" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const user = yield User_1.User.findById(decoded._id);
        if ((user === null || user === void 0 ? void 0 : user.user_type) !== "recruiter") {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Unauthorized", error: error.message });
    }
});
exports.recruiterAuth = recruiterAuth;
