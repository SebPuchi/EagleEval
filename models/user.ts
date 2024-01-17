// user.model.ts
import mongoose, { Schema, Document } from 'mongoose';

// Define the User Interface
export interface IUser extends Document {
  name: string;
  email: string;
}

// Define the User Schema
const userSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
});

// Create the User model
const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;
