"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationOnAddJob = exports.validationOnRegister = void 0;
const validator_1 = __importDefault(require("validator"));
const validationOnRegister = (req) => {
    const { fullName, email, password } = req.body;
    const errors = [];
    if (!fullName.firstName || !email || !password) {
        errors.push("Please provide all mandatory fields: first name, email, and password.");
    }
    if (fullName.firstName && fullName.firstName.length < 4) {
        errors.push("First name should be at least 4 characters long.");
    }
    if (email && !validator_1.default.isEmail(email)) {
        errors.push("Please enter a valid email address.");
    }
    if (password && !validator_1.default.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
        errors.push("Password must be at least 8 characters long and contain a mix of uppercase, lowercase, numbers, and symbols.");
    }
    return errors;
};
exports.validationOnRegister = validationOnRegister;
const validationOnAddJob = (req) => {
    const { title, description } = req.body;
    const errors = [];
    if (!title || !description) {
        errors.push("Please provide all mandatory fields");
    }
    return errors;
};
exports.validationOnAddJob = validationOnAddJob;
