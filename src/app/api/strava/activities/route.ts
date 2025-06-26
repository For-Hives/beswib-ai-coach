import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import Activity from "@/models/Activity";

export async function GET(request: Request) {
  const user = await requireAuth(request);
  const activities = await Activity.find({ user: user._id }).sort({ start_date: -1 }).limit(20);
  return NextResponse.json(activities);
} 