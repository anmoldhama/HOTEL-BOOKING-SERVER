import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import { IUser, IUserModel } from '../types/index';

dotenv.config();

const userSchema: Schema<IUser, IUserModel> = new Schema(
    {
        fullName: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true }
        },
        password: { type: String, required: true, select: false },
        email: { type: String, required: true, unique: true },
        user_type:{type: String, enum : ["user", "recruiter"]}
    },
    { timestamps: true }
);

userSchema.statics.hashPassword = async function (password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
};
    
userSchema.methods.getJWT = async function () {
    const token = await jwt.sign({ _id: this._id, first_name: this.fullName.firstName, email: this.email }, process.env.JWT_SECRET || "UBER_CLONE" as string, {expiresIn: '24h'});
    return token;
};

userSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};


const User = mongoose.model<IUser, IUserModel>('User', userSchema);

export { User };
