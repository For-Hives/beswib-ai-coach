import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { requireAuth } from "@/lib/auth";

export async function POST(request: Request) {
  await dbConnect();
  const user = await requireAuth(request);
  const data = await request.json();
  await User.findByIdAndUpdate(user._id, { profile: { ...data } });
  return NextResponse.json({ success: true });
} 