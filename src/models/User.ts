import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  profile?: any;
  preferences?: any;
  goals?: any;
  trainingPlan?: any[];
  strava?: any;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: { type: Schema.Types.Mixed, default: {} },
  preferences: { type: Schema.Types.Mixed, default: {} },
  goals: { type: Schema.Types.Mixed, default: {} },
  trainingPlan: { type: Array, default: [] },
  strava: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export default models.User || mongoose.model<IUser>("User", UserSchema); 