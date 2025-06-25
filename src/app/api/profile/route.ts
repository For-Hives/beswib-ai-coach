import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import jwt from "jsonwebtoken";

if (!mongoose.connection.readyState) {
  await mongoose.connect(process.env.MONGODB_URI!);
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const token = authHeader.replace("Bearer ", "");
  let email;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded === 'string' || !('email' in decoded)) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }
    email = decoded.email;
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const user = await User.findOne({ email });
  if (!user || !user.profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  return NextResponse.json({ profile: user.profile });
}