import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
// @ts-ignore
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.replace("Bearer ", "");
  let email;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded === 'string' || !('email' in decoded)) {
      throw new Error('Invalid token payload');
    }
    email = decoded.email;
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }
    
    // Supprime les données du plan existant pour forcer la regénération
    await User.findOneAndUpdate({ email }, { $set: { planData: {} } });

    return NextResponse.json({ success: true, message: 'Plan data cleared for regeneration.' });

  } catch (error) {
    console.error('Error during plan regeneration:', error);
    return NextResponse.json({ error: 'Failed to clear plan data.' }, { status: 500 });
  }
} 