import { Document, Model, ObjectId } from 'mongoose';

export interface IUser extends Document {
    fullName: {
        firstName: string;
        lastName: string;
    };
    email: string;
    password: string;
    user_type: string;

    getJWT(): Promise<string>;
    validatePassword(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUser> {
    hashPassword(password: string): Promise<string>;
}


export interface IJob extends Document {
    id: string;
     description: string;
    user_id: ObjectId;
    title : string
}


export interface IApplies extends Document {
      id : string,
     job_id: ObjectId,
    user_id: ObjectId
}
