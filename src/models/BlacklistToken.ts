import mongoose, { Document, Schema, Model } from 'mongoose';

// Define an interface for the BlacklistToken document
export interface IBlacklistToken extends Document {
    token: string;
    createdAt: Date;
}

// Define the schema for the BlacklistToken
const blacklistTokenSchema: Schema<IBlacklistToken> = new Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400, // TTL index to expire documents after 24 hours
    },
});

// Create and export the model
const BlacklistToken: Model<IBlacklistToken> = mongoose.model<IBlacklistToken>('BlacklistToken', blacklistTokenSchema);

export {BlacklistToken};
