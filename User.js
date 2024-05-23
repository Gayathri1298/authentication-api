import { Schema, model } from 'mongoose';
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: { type: String },
  bio: { type: String },
  phone: { type: String },
  isAdmin: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: true },
  provider: { type: String },
  providerId: { type: String },
});
export default model('User', UserSchema);
