"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
const userSchema = new mongoose_1.Schema({
    fullName: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true }
    },
    password: { type: String, required: true, select: false },
    email: { type: String, required: true, unique: true },
    user_type: { type: String, enum: ["user", "recruiter"] }
}, { timestamps: true });
userSchema.statics.hashPassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.hash(password, 10);
    });
};
userSchema.methods.getJWT = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield jsonwebtoken_1.default.sign({ _id: this._id, first_name: this.fullName.firstName, email: this.email }, process.env.JWT_SECRET || "UBER_CLONE", { expiresIn: '24h' });
        return token;
    });
};
userSchema.methods.validatePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, this.password);
    });
};
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
