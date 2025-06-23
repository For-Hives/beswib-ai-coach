import { NextResponse } from "next/server";
import mongoose from "mongoose";

if (!mongoose.connection.readyState) {
  await mongoose.connect(process.env.MONGODB_URI!);
}

const UserSchema = new mongoose.Schema({
  email: String,
  gender: String,
  age: String,
  maxHeartRate: String,
  restingHeartRate: String,
  trainingFrequency: String,
  sportsBackground: String,
  targetRaces: String,
  targetDistance: String,
  targetMonth: String,
  dataUsageConsent: Boolean,
  notificationConsent: Boolean,
});
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export async function POST(req: Request) {
  const data = await req.json();
  if (!data.email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }
  await User.findOneAndUpdate({ email: data.email }, data, { upsert: true, new: true });
  return NextResponse.json({ success: true });
} 