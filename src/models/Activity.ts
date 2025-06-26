import mongoose, { Schema, Document, models } from "mongoose";

export interface IActivity extends Document {
  user: any;
  strava_id: string;
  name: string;
  type: string;
  distance: number;
  moving_time: number;
  elapsed_time?: number;
  start_date: string;
  average_speed?: number;
  max_speed?: number;
  total_elevation_gain?: number;
  raw?: any;
}

const ActivitySchema = new Schema<IActivity>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  strava_id: { type: String, required: true, unique: true },
  name: String,
  type: String,
  distance: Number,
  moving_time: Number,
  elapsed_time: Number,
  start_date: String,
  average_speed: Number,
  max_speed: Number,
  total_elevation_gain: Number,
  raw: Schema.Types.Mixed,
}, { timestamps: true });

export default models.Activity || mongoose.model<IActivity>("Activity", ActivitySchema); 