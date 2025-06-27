import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "../../../../models/User";
import jwt from "jsonwebtoken";

if (!mongoose.connection.readyState) {
  await mongoose.connect(process.env.MONGODB_URI!);
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.replace("Bearer ", "");
  let email;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded === "string" || !("email" in decoded)) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }
    email = decoded.email;
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const user = await User.findOne({ email });
  if (!user || !user.planData || !user.planData.trainingPlan) {
    return NextResponse.json({ error: "Training plan not found" }, { status: 404 });
  }

  const trainingPlan = user.planData.trainingPlan;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  let nextSession = null;
  let nextSessionIndex = -1;
  let minDiff = Infinity;

  trainingPlan.forEach((session: any, index: number) => {
    const sessionDate = new Date(session.date);
    if (sessionDate >= today) {
      const diff = sessionDate.getTime() - today.getTime();
      if (diff < minDiff) {
        minDiff = diff;
        nextSession = session;
        nextSessionIndex = index;
      }
    }
  });

  if (!nextSession) {
    return NextResponse.json({ message: "No upcoming sessions found." }, { status: 404 });
  }

  // Ensure nextSession is an object before spreading
  const sessionObject = typeof nextSession === 'object' && nextSession !== null ? nextSession : {};

  return NextResponse.json({ ...sessionObject, id: nextSessionIndex });
} 