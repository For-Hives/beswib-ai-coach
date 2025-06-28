import mongoose, { Schema, Document, models } from "mongoose";

export interface IActivity extends Document {
  user: mongoose.Schema.Types.ObjectId;
  strava_id: string;
  type: string;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  start_date: Date;
  start_date_local: Date;
  average_speed: number;
  average_heartrate: number;
  max_heartrate: number;
  data: any;
}

const ActivitySchema = new Schema<IActivity>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  strava_id: { type: String, required: true, unique: true },
  type: { type: String },
  name: { type: String },
  distance: { type: Number },
  moving_time: { type: Number },
  elapsed_time: { type: Number },
  total_elevation_gain: { type: Number },
  start_date: { type: Date },
  start_date_local: { type: Date },
  average_speed: { type: Number },
  average_heartrate: { type: Number },
  max_heartrate: { type: Number },
  data: { type: Schema.Types.Mixed },
}, { timestamps: true });

export default models.Activity || mongoose.model<IActivity>("Activity", ActivitySchema);