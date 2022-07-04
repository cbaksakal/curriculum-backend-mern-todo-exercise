import { model, Schema, Types } from 'mongoose'

// Create an interface representing a document in MongoDB.
export interface IUser {
    _id: Types.ObjectId;
    fullName: string;
    email: string;
    password: string;
};

//TODO: Add types for schema
const userSchema: Schema<IUser> = new Schema<IUser>({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }

}, {timestamps: true})

export default model<IUser>('User', userSchema)