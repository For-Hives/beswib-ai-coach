import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  avatar: { type: String },
  profile: { type: Object },
  planData: { type: Object },
  strava: {
    athlete_id: String,
    token: String,
  },
});

export default mongoose.models.User || mongoose.model("User", userSchema); 