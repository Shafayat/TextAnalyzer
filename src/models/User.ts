import mongoose, { Document, Schema } from 'mongoose';

/**
 * Iterface represents a user document in MongoDB.
 * - username: unique identifier for user login.
 * - password: hashed password for authentication.
 */
export interface IUser extends Document {
  username: string;
  password: string;
}

/**
 * Mongoose schema for application users.
 * - username: required, unique identifier for user login.
 * - password: hashed user password (optional for external auth).
 */
const UserSchema: Schema<IUser> = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String },
});

export default mongoose.model<IUser>('User', UserSchema); 